const jwt = require("jwt-simple");
const moment = require("moment");
const apikey = process.env.API_KEY;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.ensureAuthenticated = async function (req, res, next) {
    if (!req.headers.authorization) {
        return res
            .status(401)
            .json({
                error: "Tu petición no tiene cabecera de autorización",
                code: "T1003",
            });
    }

    var token = req.headers.authorization.split(" ")[1];
    try {
        var payload = jwt.decode(token, apikey);
    } catch (error) {
        res.status(401).json({
            error: "Error al decodificar su token de autenticación",
            code: "T1001",
        });
        return;
    }

    if (payload.expiration <= moment().unix()) {
        res.status(401).send({
            error: "El token ha expirado",
            code: "T1002",
        });
        return;
    }
    try {
        const storedToken = await prisma.token.findUnique({
            where: {
                id: token,
            },
        });
        if (!storedToken || !storedToken.isActive) {
            res.status(401).send({
                error: "El token ha expirado",
                code: "T1002",
            });
            return;
        }
    } catch (err) {
        console.log(err)
        if(!err) {
            res.status(500).json({
                error: "Error desconocido",
                code: "0"
            })
            return;
        }
        if(!err.code) {
            res.status(500).json({
                error: err.message,
                code: err.code
            })
            return;
        }
    }
    req.user = payload.sub;
    next();
};
