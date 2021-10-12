const { io } = require("../server");
const { Usuarios } = require("../classes/usuarios");
const { crearMensaje } = require("../utils/utilidades");

const usuarios = new Usuarios();

io.on("connection", client => {
    client.on("entrarChat", (data, callback) => {
        if (!data.nombre || !data.sala) {
            return callback({
                error: true,
                mensaje: "El nombre/sala es necesario"
            });
        }

        client.join(data.sala);

        usuarios.agregarPersona(client.id, data.nombre, data.sala);

        client.broadcast
            .to(data.sala)
            .emit("listaPersona", usuarios.getPersonasPorSala(data.sala));
        client.broadcast
            .to(data.sala)
            .emit(
                "crearMensaje",
                crearMensaje("Administrador", `${data.nombre} se unió`)
            );

        callback(usuarios.getPersonasPorSala(data.sala));
    });

    client.on("crearMensaje", ({ mensaje }, callback) => {
        let { nombre, sala } = usuarios.getPersona(client.id);
        let msg = crearMensaje(nombre, mensaje);

        client.broadcast.to(sala).emit("crearMensaje", msg);
        callback(msg);
    });

    client.on("disconnect", () => {
        let personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast
            .to(personaBorrada.sala)
            .emit(
                "crearMensaje",
                crearMensaje("Administrador", `${personaBorrada.nombre} salió`)
            );
        client.broadcast
            .to(personaBorrada.sala)
            .emit(
                "listaPersona",
                usuarios.getPersonasPorSala(personaBorrada.sala)
            );
    });

    // Mensajes privados
    client.on("mensajePrivado", data => {
        let persona = usuarios.getPersona(client.id);

        client.broadcast
            .to(data.para)
            .emit("mensajePrivado", crearMensaje(persona.nombre, data.mensaje));
    });
});
