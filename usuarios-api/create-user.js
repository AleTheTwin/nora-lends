const { PrismaClient } = require("@prisma/client");
const passwordController = require("./controllers/password-hash");
const prisma = new PrismaClient();
const argumentos = process.argv;

async function main() {
    let usernameIndex =
        argumentos.indexOf("--username") != -1
            ? argumentos.indexOf("--username") + 1
            : 1;
    let passwordIndex =
        argumentos.indexOf("--password") != -1
            ? argumentos.indexOf("--password") + 1
            : 2;
    let usuario = {
        username: argumentos[usernameIndex],
        password: await passwordController.hashPassword(
            argumentos[passwordIndex]
        ),
    };
    const result = await prisma.usuario.create({
        data: usuario,
    });
    console.log(result);
}

main();
