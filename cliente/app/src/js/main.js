const host = `http://${window.location.host}`;
var eventos = [];
var eventosFiltrados = eventos;


if (token != undefined) {
    let url = `${host}:8081/eventos`;
    axios
        .get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Access-Control-Allow-Origin": "*",
            },
        })
        .then((response) => {
            eventos = response.data;
            eventosFiltrados = eventos;
            // eventos.forEach((evento) => {
            //     insertaEvento(evento);
            // });
            loadEventos();
        })
        .catch((error) => {
            alert(error);
        });
}

$("#search").keyup((event) => {
    let search = $("#search").val().toLowerCase();
    if (search == "") {
        eventosFiltrados = eventos;
        loadEventos();
        return;
    }
    // for (let i = 0; i < eventos.length; i++) {
    //     eventosFiltrados = [];
    //     if (eventos[i].titulo.includes(search)) {
    //         eventosFiltrados.push(eventos[i]);
    //     }
    // }
    eventosFiltrados = eventos.filter((evento) => {
        return evento.titulo.toLowerCase().includes(search);
    });
    loadEventos();
});

$("#search-form").submit((event) => {
    event.preventDefault();
    let search = $("#search").val().toLowerCase();
    if (search == "") {
        eventosFiltrados = eventos;
        return;
    }
    eventosFiltrados = eventos.filter((event) => {
        return event.titulo.includes(search);
    });
    loadEventos();
});

$("#chat-form").submit((event) => {
    ocultarAlerta();
    event.preventDefault();
    let chat = $("#chat").val().toLowerCase();
    axios
        .get(`/functions/get_intent.php?mensaje=${chat}`)
        .then(({ data }) => {
            let hoy = moment();
            console.log(data.intent);
            let count = 0
            switch (data.intent) {
                case "get-event-today":
                    eventosFiltrados = eventos.filter((evento) => {
                        let inicio = moment(evento.fechaDeInicio);
                        let differencia = hoy.diff(inicio, "days");
                        return (
                            differencia == 0 &&
                            parseInt(inicio.format("D")) -
                                parseInt(hoy.format("D")) !=
                                1
                        );
                    });
                    count = eventosFiltrados.length
                    if (count == 0) {
                        myVoice.speak(`No tienes eventos para hoy`);
                    } else if(count == 1) {
                        myVoice.speak(`Tienes un evento para hoy`);
                    } else {
                        myVoice.speak(`Tienes ${count} evento para hoy`);
                    }
                    loadEventos();
                    break;
                case "get-event-tomorrow":
                    eventosFiltrados = eventos.filter((evento) => {
                        let inicio = moment(evento.fechaDeInicio);
                        let differencia = hoy.diff(inicio, "days");
                        return (
                            (differencia == 0 &&
                                parseInt(inicio.format("D")) -
                                    parseInt(hoy.format("D")) ==
                                    1) ||
                            differencia == 1
                        );
                    });

                    count = eventosFiltrados.length
                    if (count == 0) {
                        myVoice.speak(`No tienes eventos para mañana`);
                    } else if(count == 1) {
                        myVoice.speak(`Tienes un evento para mañana`);
                    } else {
                        myVoice.speak(`Tienes ${count} evento para mañana`);
                    }
                    loadEventos();
                    break;
                case "get-event-todos":
                    eventosFiltrados = eventos;

                    count = eventosFiltrados.length
                    if (count == 0) {
                        myVoice.speak(`No tienes eventos.`);
                    } else if(count == 1) {
                        myVoice.speak(`Tienes un evento`);
                    } else {
                        myVoice.speak(`Tienes ${count} eventos`);
                    }
                    loadEventos();
                    break;
                case "add-event":
                    alert("TODO: agregar evento");
                    break;
                case "add-event-today":
                    alert("TODO: agregar evento para hoy");
                    break;
                case "add-event-tomorrow":
                    alert("TODO: agregar evento para mañana");
                    break;
                case "delete-event":
                    alert("TODO: Borra un evento");
                    break;
                default:
                    mostrarAlerta("No pude procesar una acción para eso :(");
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

$("#chat").keyup((event) => {
    event.preventDefault();
    eventosFiltrados = eventos;
    loadEventos();
});

async function loadEventos() {
    $("#eventos").html("");
    if (eventosFiltrados.length == 0) {
        mostrarAlerta("No hay eventos que mostrar");
        return;
    }
    ocultarAlerta();
    eventosFiltrados.forEach((evento) => {
        insertaEvento(evento);
    });
}

// loadEventos();

function ocultarAlerta() {
    $("#alerta").addClass("visually-hidden");
}

function mostrarAlerta(mensaje) {
    $("#alerta").removeClass("visually-hidden");
    $("#alerta").html(mensaje);
}

function insertaEvento(evento) {
    let eventosBox = document.getElementById("eventos");
    let tarjeta = tarjetaEvento(evento);
    eventosBox.appendChild(tarjeta);
}

function tarjetaEvento(evento) {
    let card = document.createElement("div");
    card.style += "width: 18rem;";
    card.classList.add("card");

    let eventData = document.createElement("div");
    eventData.classList.add("card-body");

    let eventTitle = document.createElement("h5");
    eventTitle.classList.add("card-title");
    eventTitle.innerHTML = evento.titulo;

    let eventoInicio = document.createElement("p");
    eventoInicio.classList.add("card-text");
    let eventoInicioTag = document.createElement("strong");
    eventoInicioTag.innerHTML = "Inicio: ";
    let eventoInicioData = document.createElement("small");

    let hoy = moment();
    let inicio = moment(evento.fechaDeInicio);
    let differencia = hoy.diff(inicio, "days");
    if (
        differencia == 0 &&
        parseInt(inicio.format("D")) - parseInt(hoy.format("D")) != 1
    ) {
        eventoInicioData.innerHTML = "Hoy a las " + inicio.format("HH:mm");
    } else if (
        differencia == 1 ||
        (differencia == 0 &&
            parseInt(inicio.format("D")) - parseInt(hoy.format("D")) == 1)
    ) {
        eventoInicioData.innerHTML = "Mañana a las " + inicio.format("HH:mm");
    } else {
        eventoInicioData.innerHTML = inicio.format(
            "dddd, MMMM Do YYYY, h:mm:ss a"
        );
    }
    // eventoInicioData.innerHTML = evento.fechaDeInicio;
    eventoInicio.appendChild(eventoInicioTag);
    eventoInicio.appendChild(eventoInicioData);

    let eventofinalizacion = document.createElement("p");
    eventofinalizacion.classList.add("card-text");
    let eventofinalizacionTag = document.createElement("strong");
    eventofinalizacionTag.innerHTML = "finalizacion: ";
    let eventofinalizacionData = document.createElement("small");

    let final = moment(evento.fechaDeFinalizacion);
    differencia = hoy.diff(inicio, "days");

    if (
        differencia == 0 &&
        parseInt(final.format("D")) - parseInt(hoy.format("D")) != 1
    ) {
        eventofinalizacionData.innerHTML = "Hoy a las " + final.format("HH:mm");
    } else if (
        differencia == 1 ||
        (differencia == 0 &&
            parseInt(final.format("D")) - parseInt(hoy.format("D")) == 1)
    ) {
        eventofinalizacionData.innerHTML =
            "Mañana a las " + final.format("HH:mm");
    } else {
        eventofinalizacionData.innerHTML = final.format(
            "dddd, MMMM Do YYYY, h:mm:ss a"
        );
    }
    // eventofinalizacionData.innerHTML = evento.fechaDeFinalizacion;
    eventofinalizacion.appendChild(eventofinalizacionTag);
    eventofinalizacion.appendChild(eventofinalizacionData);

    eventData.appendChild(eventTitle);
    eventData.appendChild(eventoInicio);
    eventData.appendChild(eventofinalizacion);

    card.appendChild(eventData);

    let notasSeccion = document.createElement("div");
    notasSeccion.classList.add("card-body");

    let notasSeccionTitulo = document.createElement("h3");
    notasSeccionTitulo.innerHTML = "Notas";

    notasSeccion.appendChild(notasSeccionTitulo);

    let listaDeNotas = document.createElement("ul");
    listaDeNotas.classList.add("list-group");
    listaDeNotas.classList.add("list-group-flush");

    evento.notas.forEach((nota) => {
        let notaCard = document.createElement("li");
        notaCard.classList.add("list-group-item");
        let notaCardBody = document.createElement("ul");
        notaCardBody.classList.add("list-group");

        let notaTituloBox = document.createElement("li");
        notaTituloBox.classList.add("list-group-item");
        let notaTitulo = document.createElement("strong");
        notaTitulo.innerHTML = nota.titulo;
        notaTituloBox.appendChild(notaTitulo);

        let notaContenidoBox = document.createElement("li");
        notaContenidoBox.classList.add("list-group-item");
        let notaContenido = document.createElement("small");
        notaContenido.innerHTML = nota.contenido;
        notaContenidoBox.appendChild(notaContenido);

        notaCardBody.appendChild(notaTituloBox);
        notaCardBody.appendChild(notaContenidoBox);

        notaCard.appendChild(notaCardBody);

        listaDeNotas.appendChild(notaCard);
    });

    notasSeccion.appendChild(listaDeNotas);

    if (evento.notas.length > 0) {
        card.appendChild(notasSeccion);
    }

    let opciones = document.createElement("div");
    // opciones.classList.add("card-body");
    opciones.classList.add("text-center");
    opciones.classList.add("opciones");

    let btnEditar = document.createElement("button");
    btnEditar.classList.add("btn");
    btnEditar.classList.add("btn-warning");
    btnEditar.innerHTML = "Editar";
    btnEditar.setAttribute("onclick", `editarEvento('${evento.id}')`);

    let btnBorrar = document.createElement("button");
    btnBorrar.classList.add("btn");
    btnBorrar.classList.add("btn-danger");
    btnBorrar.setAttribute("onclick", `borrarEvento('${evento.id}')`);
    btnBorrar.innerHTML = "Borrar";

    let btnAddNota = document.createElement("button");
    btnAddNota.classList.add("btn");
    btnAddNota.classList.add("btn-success");
    btnAddNota.innerHTML = "+ nota";
    btnAddNota.setAttribute("onclick", `agregarNota('${evento.id}')`);

    // opciones.appendChild(btnAddNota);
    opciones.appendChild(btnEditar);
    opciones.appendChild(btnBorrar);

    card.appendChild(opciones);
    return card;
}

function borrarEvento(id) {
    alert(`TODO: Borrar evento con id: ${id}`);
    // TODO: implementación de borrar evento
}

function editarEvento(id) {
    alert(`TODO: Editar evento con id: ${id}`);
    // TODO: implementación de editar evento
}

function agregarNota(id) {
    alert(`TODO: Agregar nota a evento con id: ${id}`);
    // TODO: implementación de agregar nota
}
