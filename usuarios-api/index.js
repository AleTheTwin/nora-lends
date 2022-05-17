const { PrismaClient } = require("@prisma/client");
const express = require("express");
const { ensureAuthenticated } = require("./controllers/checkToken");
const { createToken } = require("./controllers/create-token");
const fileUpload = require("express-fileupload");
const path = require("path");
const passwordController = require("./controllers/password-hash");

const documentacionUrl = "http://noralends.host/docs";

const prisma = new PrismaClient();

const app = express();

app.use(express.json());
app.use(fileUpload());

const PORT = process.env.PORT || 3000;

app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(500).json({
            error: `Parámetros incompletos. Consulta la documtación en ${documentacionUrl}.`,
            code: `P0001`,
        });
    }

    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                username,
            }
        });

        if (!usuario || !(await passwordController.passwordVerify(password, usuario.password)) ) {
            res.json({
                error: "Credenciales incorrectas",
            });
            return;
        }

        res.json({
            username: usuario.username,
            id: usuario.id,
            token: createToken(usuario?.username),
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
            },
        });
        res.json(usuarios);
    } catch (error) {
        handleError(error, res);
        return;
    }
});

const server = app.listen(PORT, () => {
    console.log(`NORA API listening on port ${PORT}, http://localhost:${PORT}`);
});

function handleError(error, res) {
    console.log(error);
    switch (error.code) {
        case "P1000":
            res.status(500).json({
                error: "Error de autenticación con la base de datos",
                code: error.code,
            });
            break;

        case "P1010":
            res.status(500).json({
                error: `Acceso denegado para el usuario ${error.database_user} a la base de datos ${error.database_name}`,
                code: error.code,
            });
            break;

        case undefined:
            res.status(500).json({
                error: `Error de conexión a la base de datos`,
            });
            break;

        default:
            res.status(500).json({
                error: {
                    ...error,
                    message:
                        "Unhandled error. See https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes for more info.",
                },
            });
    }
}
