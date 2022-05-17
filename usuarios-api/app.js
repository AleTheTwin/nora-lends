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
        message: "Nora Lends - users api",
    });
});

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(500).json({
            error: `Parámetros incompletos. Consulta la documtación en ${documentacionUrl}.`,
            code: `P0001`,
        });
        return;
    }

    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                username,
            },
        });

        if (
            !usuario ||
            !(await passwordController.passwordVerify(
                password,
                usuario.password
            ))
        ) {
            res.status(400).json({
                error: "Credenciales incorrectas",
                code: "C10001",
            });
            return;
        }

        res.json({
            username: usuario.username,
            id: usuario.id,
            token: await createToken(usuario),
        });
    } catch (e) {
        handleError(e, res);
        return;
    }
});

app.get("/users/", ensureAuthenticated, async (req, res) => {
    try {
        const usuarios = await prisma.usuario.findMany({
            select: {
                password: false,
                username: true,
                id: true,
            },
        });
        res.json(usuarios);
    } catch (error) {
        handleError(error, res);
        return;
    }
});

app.get("/personas/", ensureAuthenticated, async (req, res) => {
    const usuario = req.user;

    try {
        const personas = await prisma.persona.findMany({
            select: {
                id: true,
                nombre: true,
                email: true,
                username: true,
            },
        });
        res.json(personas);
    } catch (error) {
        handleError(error, res);
        return;
    }
});

app.get("/personas/:id", ensureAuthenticated, async (req, res) => {
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
        const persona = await prisma.persona.findUnique({
            select: {
                id: true,
                nombre: true,
                email: true,
                username: true,
            },
            where: {
                id,
            },
        });
        if (!persona) {
            res.status(404).json({
                error: `Persona con id ${id} no encontrado.`,
                code: "R0001",
            });
            return;
        }
        res.json(persona);
    } catch (error) {
        handleError(error, res);
        return;
    }
});

app.post("/personas/", ensureAuthenticated, async (req, res) => {
    const usuario = req.user;
    const { username, email, nombre, password } = req.body;

    if (!username || !email || !nombre || !password) {
        res.status(500).json({
            error: `Parámetros incompletos. Consulta la documtación en ${documentacionUrl}.`,
            code: `P0001`,
        });
        return;
    }

    const persona = {
        username,
        email,
        nombre,
        password: await passwordController.hashPassword(password),
    };

    try {
        const result = await prisma.persona.create({
            data: persona,
        });
        res.json(result);
    } catch (error) {
        handleError(error, res);
        return;
    }
});

app.put("/personas/:id", ensureAuthenticated, async (req, res) => {
    const usuario = req.user;
    const { id } = req.params;
    var { username, email, nombre, password } = req.body;

    if (!id || (!username && !email && !nombre && !password)) {
        res.status(500).json({
            error: `Parámetros incompletos. Consulta la documtación en ${documentacionUrl}.`,
            code: `P0001`,
        });
        return;
    }

    try {
        const personaStored = await prisma.persona.findUnique({
            where: {
                id,
            },
        });

        if (!persona) {
            res.status(404).json({
                error: `Persona con id ${id} no encontrado.`,
                code: "R0001",
            });
            return;
        }

        if (!username) {
            username = personaStored.username;
        }

        if (!email) {
            email = personaStored.email;
        }

        if (!nombre) {
            nombre = personaStored.nombre;
        }

        if (!password) {
            password = personaStored.password;
        } else {
            password = await passwordController.hashPassword(password);
        }

        const persona = {
            username,
            email,
            nombre,
            password,
        };

        const result = await prisma.persona.update({
            data: persona,
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

app.delete("/personas/:id", ensureAuthenticated, async (req, res) => {
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
        const persona = await prisma.persona.findUnique({
            where: {
                id,
            },
        });
        if (!persona) {
            res.status(404).json({
                error: `Persona con id ${id} no encontrado.`,
                code: "R0001",
            });
            return;
        }
        const result = await prisma.persona.delete({
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
