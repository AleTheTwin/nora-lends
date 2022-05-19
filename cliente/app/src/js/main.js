const host = "http://mac-mini-de-ale.local";

if(token != undefined) {
    let url = `${host}:8081/eventos`
    axios.get(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Access-Control-Allow-Origin": "*"
        }
    })
    .then((response) => {
        let eventos = response.data
        console.log(eventos);
        eventos.forEach(evento => {
            insertaEvento(evento)
        })
    })
    .catch(error => {
        alert(error);
    })
}

function ocultarAlerta() {
    $("#alerta").addClass("visually-hidden");
}

function mostrarAlerta(mensaje) {
    $("#alerta").removeClass("visually-hidden");
    $("#alerta").html(mensaje);
}

let evento = {
    titulo: "jeje",
    fechaDeInicio: "asdfasfdasdfas",
    fechaDeFinalizacion: "alksdjalsdjasd",
    notas: [{ titulo: "nota1", contenido: "el contenido de la nota jeje" }],
};


function insertaEvento(evento) {
    let main = document.getElementById('main');
    let tarjeta = tarjetaEvento(evento);
    main.appendChild(tarjeta)
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
    eventoInicioData.innerHTML = evento.fechaDeInicio;
    eventoInicio.appendChild(eventoInicioTag);
    eventoInicio.appendChild(eventoInicioData);

    let eventofinalizacion = document.createElement("p");
    eventofinalizacion.classList.add("card-text");
    let eventofinalizacionTag = document.createElement("strong");
    eventofinalizacionTag.innerHTML = "finalizacion: ";
    let eventofinalizacionData = document.createElement("small");
    eventofinalizacionData.innerHTML = evento.fechaDefinalizacion;
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

    card.appendChild(notasSeccion);

    let opciones = document.createElement("div");
    opciones.classList.add("card-body");
    opciones.classList.add("text-center");

    let btnEditar = document.createElement("button");
    btnEditar.classList.add("btn");
    btnEditar.classList.add("btn-warning");
    btnEditar.innerHTML = "Editar";

    let btnBorrar = document.createElement("button");
    btnBorrar.classList.add("btn");
    btnBorrar.classList.add("btn-danger");
    btnBorrar.innerHTML = "Borrar";

    opciones.appendChild(btnEditar);
    opciones.appendChild(btnBorrar);

    card.appendChild(opciones);
    return card;
}
