const { PrismaClient } = require("@prisma/client");
const express = require("express");
const { ensureAuthenticated } = require("./controllers/checkToken");
const { createToken } = require("./controllers/create-token");
const passwordController = require("./controllers/password-hash");

const documentacionUrl = "http://noralends.host/docs";

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.json({
        message: "Nora Lends - Events api",
    });
});


app.get("/eventos/", ensureAuthenticated, async (req, res) => {
    const usuario = req.user;

    try {
        const eventos = await prisma.evento.findMany({
            where:{
                autorId:usuario.id
            },
            include:{
                notas:true
            }
        });
        res.json(eventos);
    } catch (error) {
        handleError(error, res);
        return;
    }
});

app.get("/eventos/:id", ensureAuthenticated, async (req, res) => {
    const usuario = req.user;
    const { id } = req.params;
    if (!id) {
        res.status(500).json({
            error: `Parámetros incompletos. Consulta la documtación en ${documentacionUrl}.`,
            code: `P0001`,
        });
        return;
    }
    try {
        const eventos = await prisma.evento.findUnique({
            where:{
                id
            },
            include:{
                notas:true
            }
        });
        if(!eventos){
            res.status(404).json({
                error: `evento con id ${id} no encontrado.`,
                code: `R0001`,
            });
            return;
        }
        res.json(eventos);
    } catch (error) {
        handleError(error, res);
        return;
    }
});

app.post("/eventos/", ensureAuthenticated, async (req, res) => {
    const usuario = req.user;
    const { titulo, fechaDeInicio, fechaDeFinalizacion} = req.body;
    if (!titulo || !fechaDeInicio || !fechaDeFinalizacion) {
        res.status(500).json({
            error: `Parámetros incompletos. Consulta la documtación en ${documentacionUrl}.`,
            code: `P0001`,
        });
        return;
    }

    const evento = {
        titulo,
        fechaDeInicio,
        fechaDeFinalizacion,
        autorId:usuario.id
    };

    try {
        const result = await prisma.evento.create({
            data: evento,
        });
        res.json(result);
    } catch (error) {
        handleError(error, res);
        return;
    }
});

app.put("/eventos/:id", ensureAuthenticated, async (req, res) => {
    const usuario = req.user;
    const { id } = req.params;
    const { titulo, fechaDeInicio, fechaDeFinalizacion} = req.body;

    if (!id || (!titulo && !fechaDeInicio && !fechaDeFinalizacion)) {
        res.status(500).json({
            error: `Parámetros incompletos. Consulta la documtación en ${documentacionUrl}.`,
            code: `P0001`,
        });
        return;
    }

    try {
        const eventoStored = await prisma.evento.findUnique({
            where: {
                id,
            },
        });

        if (!eventoStored) {
            res.status(404).json({
                error: `evento con id ${id} no encontrado.`,
                code: "R0001",
            });
            return;
        }

        if (!titulo) {
            titulo = eventoStored.titulo;
        }

        if (!fechaDeInicio) {
            fechaDeInicio = eventoStored.fechaDeInicio;
        }

        if (!fechaDeFinalizacion) {
            fechaDeFinalizacion = eventoStored.fechaDeFinalizacion;
        }

        const evento = {
            titulo,
            fechaDeInicio,
            fechaDeFinalizacion
        };

        const result = await prisma.evento.update({
            data: evento,
            where: {
                id,
            },
        });
        res.json(result);
    } catch (error) {
        handleError(error, res);
        return;
    }
});

app.delete("/eventos/:id", ensureAuthenticated, async (req, res) => {
    const usuario = req.user;
    const { id } = req.params;
    if (!id) {
        res.status(500).json({
            error: `Parámetros incompletos. Consulta la documtación en ${documentacionUrl}.`,
            code: `P0001`,
        });
        return;
    }
    try {
        const evento = await prisma.evento.findUnique({
            where: {
                id,
            },
        });
        if (!evento) {
            res.status(404).json({
                error: `evento con id ${id} no encontrado.`,
                code: "R0001",
            });
            return;
        }
        const result = await prisma.evento.delete({
            where: {
                id,
            },
        });
        res.json(result);
    } catch (error) {
        handleError(error, res);
        return;
    }
});

exports.app = app;

function handleError(error, res) {
    console.log(error);

    if (error.code) {
        res.status(500).json({
            error: "Unhandled error. See https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes for more info.",
            code: error.code,
        });
        return;
    }
    res.status(500).json({
        error: error.message,
        code: "U0001",
    });
}
