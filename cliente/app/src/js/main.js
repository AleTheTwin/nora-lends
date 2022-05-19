const host = window.location.host;
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
            eventos = response.data
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
        console.log("hola");
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
    eventosFiltrados = eventos.filter(evento => {
        return evento.titulo.toLowerCase().includes(search)
    })
    console.log(eventosFiltrados);
    loadEventos();
});

$("#search-form").submit((event) => {
    event.preventDefault();
    let search = $("#search").val().toLowerCase();
    console.log(search);
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
    event.preventDefault();
    let chat = $("#chat").val().toLowerCase();
    axios.get(`/functions/get_intent.php?mensaje=${chat}`)
    .then(({data}) => {
        switch(data.intent) {
            case "get-event-today":
                let hoy = new Date()
                let hoyIso = hoy.toISOString()
                moment(eventos[0].fechaDeInicio)
                console.log(hoyIso);
        }
    })
    .catch(err => {
        console.log(err);
    })
});

async function loadEventos() {
    $("#main").html("");
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
    let main = document.getElementById("main");
    let tarjeta = tarjetaEvento(evento);
    main.appendChild(tarjeta);
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
    eventofinalizacionData.innerHTML = evento.fechaDeFinalizacion;
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

    let btnAddNota = document.createElement("button");
    btnAddNota.classList.add("btn");
    btnAddNota.classList.add("btn-success");
    btnAddNota.innerHTML = "+ nota";

    opciones.appendChild(btnAddNota);
    opciones.appendChild(btnEditar);
    opciones.appendChild(btnBorrar);



    card.appendChild(opciones);
    return card;
}

if (!Date.prototype.toISOString) {
    (function() {
  
      function pad(number) {
        if (number < 10) {
          return '0' + number;
        }
        return number;
      }
  
      Date.prototype.toISOString = function() {
        return this.getUTCFullYear() +
          '-' + pad(this.getUTCMonth() + 1) +
          '-' + pad(this.getUTCDate()) +
          'T' + pad(this.getUTCHours()) +
          ':' + pad(this.getUTCMinutes()) +
          ':' + pad(this.getUTCSeconds()) +
          '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
          'Z';
      };
  
    }());
  }
  