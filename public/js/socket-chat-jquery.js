const params = new URLSearchParams(window.location.search);

const nombre = params.get("nombre");
const sala = params.get("sala");

// Referencias de jQuery
const divUsuarios = $("#divUsuarios");
const formEnviar = $("#formEnviar");
const txtMensaje = $("#txtMensaje");
const divChatBox = $("#divChatbox");

// Funcion para renderizar usuarios
function renderizarUsuarios(personas) {
    $(".box-title small").text(sala);

    let html = "";

    html += `
		<li>
			<a href="javascript:void(0)" class="active">
				Chat de <span>${sala}</span>
			</a>
	 	</li>
	`;

    personas.map(({ id, nombre }) => {
        html += `
			<li>
				<a data-id="${id}" href="javascript:void(0)">
					<img src="assets/images/users/1.jpg" alt="user-img" class="img-circle">
					<span>${nombre} <small class="text-success">online</small></span>
				</a>
			</li>
		`;
    });

    divUsuarios.html(html);
}

// Funcion para renderizar mensajes
function renderizarMensajes(msg, yo) {

	let {fecha, nombre, mensaje} = msg
    let html = "";
    let date = new Date(fecha);
    let hora = date.getHours() + ":" + date.getMinutes();

    let adminClass = "info";
    if (nombre === "Administrador") {
        adminClass = "danger";
    }

    } else {
        html += '<li class="animated fadeIn">';
        if (nombre !== "Administrador") {
            html += '	<div class="chat-img">';
            html += '		<img src="assets/images/users/1.jpg" alt="user" />';
            html += "	</div>";
        }
        html += '	<div class="chat-content">';
        html += "		<h5>" + nombre + "</h5>";
        html +=
            '		<div class="box bg-light-' +
            adminClass +
            '">' +
            mensaje +
            "</div>";
        html += "	</div>";
        html += '	<div class="chat-time">' + hora + "</div>";
        html += "</li>;";
	}
	
	if (yo) {

		html += `
		   <li class="reverse">
				<div class="chat-content">
					<h5>${nombre}</h5>
					<div class="box bg-light-inverse">${mensaje}</div>
				</div>
				<div class="chat-img">
					<img src="assets/images/users/5.jpg" alt="user" />
				</div>
         		<div class="chat-time">${hora}</div>
          </li>
		`;

	} else {

		let isAdmin = `
			<div class="chat-img">
				<img src="assets/images/users/1.jpg" alt="user" />
			</div>";
		`
		let notAdmin = `
		      	<div class="chat-content">
        		<h5>${nombre}</h5>
            		<div class="box bg-light- 
            adminClass 
            "> 
            mensaje 
            "</div>"
        "	</div>"
        	<div class="chat-time">  hora  "</div>"
        "</li>"
		`


		html += `
			<li class="animated fadeIn">

			${nombre === 'Administrador' ? isAdmin  }

			<div class="chat-content">
        		<h5> + nombre + </h5>
            	<div class="box bg-light-${adminClass}">
           			${mensaje}
            	</div>
			</div>
        	<div class="chat-time"> hora "</div>"
        "</li>"
		`;

	}



    divChatBox.append(html);
}

function scrollBottom() {
    // selectors
    var div = $("#divChatbox");

    var newMessage = div.children("li:last-child");

    // heights
    var clientHeight = div.prop("clientHeight");
    var scrollTop = div.prop("scrollTop");
    var scrollHeight = div.prop("scrollHeight");
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (
        clientHeight + scrollTop + newMessageHeight + lastMessageHeight >=
        scrollHeight
    ) {
        div.scrollTop(scrollHeight);
    }
}

// Listeners
divUsuarios.on("click", "a", e => {
    var id = e.currentTarget.dataset["id"];

    if (id) {
        console.log(id);
    }
});

formEnviar.on("submit", function (e) {
    e.preventDefault();

    if (txtMensaje.val().trim().length === 0) {
        return;
    }

    socket.emit(
        "crearMensaje",
        {
            nombre: nombre,
            mensaje: txtMensaje.val()
        },
        function (mensaje) {
            txtMensaje.val("").focus();
            renderizarMensajes(mensaje, true);
            scrollBottom();
        }
    );
});
