const { PrismaClient} = require("@prisma/client");
const prisma=new PrismaClient();
async function juas(){
    /*var persona=await prisma.persona.create({data:{
        username:"amary",
        password:"123456",
        email:"amary@emanoxxx.com",
        nombre:"amary"
    }}).catch(err=>{

    })*/
    await prisma.evento.create({data: {
        titulo: "Hola1",
        fechaDeInicio:"2020-03-19T14:21:00+02:00",
        fechaDeFinalizacion:"2020-04-19T14:21:00+02:00",
        autorId:'ae6a3f5e-37b6-47da-9c6e-8004bfb3b210'
    }}).catch(err=>{
        console.log(err)
    })
    /*var personas=await prisma.persona.findMany();
    console.log(personas);*/
    var transaccion=await prisma.$transaction([
        prisma.evento.delete({where: {
            autorId:'ae6a3f5e-37b6-47da-9c6e-8004bfb3b210'
        }}),
        prisma.persona.delete({where: {
            id:"ae6a3f5e-37b6-47da-9c6e-8004bfb3b210"
        }})
    ])
    console.log(transaccion)
    var eventos=await prisma.evento.findMany();
    console.log(eventos);

}
juas();