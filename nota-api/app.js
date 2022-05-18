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
        message: "Nora Lends - Nota api",
    });
});


app.get("/eventos/:eventid/notas/", ensureAuthenticated, async (req, res) => {
    const usuario = req.user;
    const { eventid } = req.params;
    if (!eventid) {
        res.status(500).json({
            error: `Parámetros incompletos. Consulta la documtación en ${documentacionUrl}.`,
            code: `P0001`,
        });
        return;
    }
    try {
        const notas = await prisma.nota.findMany({
            where:{
                autorId:usuario.id,
                notaId:eventid
            }
        });
        res.json(notas);
    } catch (error) {
        handleError(error, res);
        return;
    }
});

app.get("/notas/:id", ensureAuthenticated, async (req, res) => {
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
        const notas = await prisma.nota.findUnique({
            where:{
                id:id
            }
        });
        if(!notas){
            res.status(404).json({
                error: `Nota con id ${id} no encontrado.`,
                code: `R0001`,
            });
            return;
        }
        res.json(notas);
    } catch (error) {
        handleError(error, res);
        return;
    }
});

app.post("/notas/", ensureAuthenticated, async (req, res) => {
    const usuario = req.user;
    const { titulo, contenido, autorId,eventoId} = req.body;
    if (!titulo || !contenido || !autorId ||!eventoId) {
        res.status(500).json({
            error: `Parámetros incompletos. Consulta la documtación en ${documentacionUrl}.`,
            code: `P0001`,
        });
        return;
    }

    const nota = {
        titulo,
        contenido,
        fechaDeFinalizacion,
        autorId:usuario.id,
        eventoId
    };

    try {
        const result = await prisma.nota.create({
            data: nota,
        });
        res.json(result);
    } catch (error) {
        handleError(error, res);
        return;
    }
});

app.put("/notas/:id", ensureAuthenticated, async (req, res) => {
    const usuario = req.user;
    const { id } = req.params;
    const { titulo, contenido} = req.body;

    if (!id || (!titulo && !contenido)) {
        res.status(500).json({
            error: `Parámetros incompletos. Consulta la documtación en ${documentacionUrl}.`,
            code: `P0001`,
        });
        return;
    }

    try {
        const notaStored = await prisma.nota.findUnique({
            where: {
                id,
            },
        });

        if (!notaStored) {
            res.status(404).json({
                error: `nota con id ${id} no encontrado.`,
                code: "R0001",
            });
            return;
        }

        if (!titulo) {
            titulo = notaStored.titulo;
        }

        if (!contenido) {
            contenido = notaStored.contenido;
        }

        const nota = {
            titulo,
            contenido
        };

        const result = await prisma.nota.update({
            data: nota,
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

app.delete("/notas/:id", ensureAuthenticated, async (req, res) => {
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
        const nota = await prisma.nota.findUnique({
            where: {
                id,
            },
        });
        if (!nota) {
            res.status(404).json({
                error: `nota con id ${id} no encontrado.`,
                code: "R0001",
            });
            return;
        }
        const result = await prisma.nota.delete({
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
