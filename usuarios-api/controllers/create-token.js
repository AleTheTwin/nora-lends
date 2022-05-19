const jwt = require("jwt-simple");
const moment = require("moment");
const apikey = process.env.API_KEY;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

exports.createToken = function (usuario) {
    var payload = {
        subscriber: usuario,
        createdAt: moment().unix(),
        expiration: moment().add(30, "days").unix(),
    };
    const token = jwt.encode(payload, apikey);
    return new Promise((resolve, reject) => {
        prisma.token
            .create({
                data: {
                    id: token,
                    isActive: true,
                },
            })
            .then(() => {
                resolve(token);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
