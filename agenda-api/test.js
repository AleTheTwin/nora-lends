const { PrismaClient} = require("@prisma/client");
const prisma=new PrismaClient();
async function juas(){
    /*var persona=await prisma.persona.create({data:{
        username:"nora",
        password:"123456",
        email:"nora@emanoxxx.com",
        nombre:"nora"
    }}).catch(err=>{

    })
    await prisma.evento.create({data: {
        titulo: "putifiesta del ale",
        fechaDeInicio:"2020-03-19T14:21:00+02:00",
        fechaDeFinalizacion:"2020-04-19T14:21:00+02:00",
        autorId:'cd821ca3-c8d5-4637-bbcf-0f02431d3530'
    }}).catch(err=>{
        console.log(err)
    })*/
    await prisma.persona.deleteMany()

    var personas=await prisma.persona.findMany();
    console.log(personas);
    var eventos=await prisma.evento.findMany();
    console.log(eventos);

}
juas();