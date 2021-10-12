const socket = io();

const paramsChat = new URLSearchParams(window.location.search);

if (!paramsChat.has('nombre') || !paramsChat.has('sala')) {
	window.location = 'index.html';
	throw new Error('El nombre y sala son necesarios');
}

const usuario = {
	nombre: paramsChat.get('nombre'),
	sala: paramsChat.get('sala'),
};

socket.on('connect', function () {
	console.log('Conectado al servidor');

	socket.emit('entrarChat', usuario, function (resp) {
		renderizarUsuarios(resp);
	});
});

// escuchar
socket.on('disconnect', function () {
	console.log('Perdimos conexión con el servidor');
});

// Escuchar información
socket.on('crearMensaje', function (mensaje) {
    renderizarMensajes(mensaje, false);
    scrollBottom();
});

// Escuchar cambios de usuarios
// cuando un usuario entra o sale del chat
socket.on('listaPersona', function (personas) {
	renderizarUsuarios(personas);
});

// Mensajes privados
socket.on('mensajePrivado', function (mensaje) {
	console.log('Mensaje Privado:', mensaje);
});
