# 
#   Autores:
#     Alejandro de Jesús ¨Sánchez Morales
#     Emanuel Alejandro Solórzano Guzmán
# 

#!/bin/sh

reset="\033[0m"
cyan="\033[36m"
green="\033[32m"
yellow="\033[33m"
magenta="\033[35m"
blue="\033[34m"
red="\033[31m"


printf "${reset}\n"
printf "${cyan}Instslando los servicios de Nora Lends\n"

printf "${reset}\n"
printf "${reset}Ingresa el nombre de usuario para el usuario de la base de datos: default [admin]:\n"
read DB_USER

if [ "$DB_USER" = "" ]; then
    DB_USER=admin
fi

printf "${reset}Ingresa la contraseña para el usuario de la base de datos: default [admin]:\n"
read DB_PASSWORD

if [ "$DB_PASSWORD" = "" ]; then
    DB_PASSWORD=admin
fi


printf "${reset}Ingresa el puerto para la api de los usuarios: default [8080]:\n"
read USERS_API_PORT

if [ "$USERS_API_PORT" = "" ]; then
    USERS_API_PORT=8080
fi

printf "${reset}Ingresa el puerto para la api de los eventos: default [8081]:\n"
read EVENTS_API_PORT

if [ "$EVENTS_API_PORT" = "" ]; then
    EVENTS_API_PORT=8081
fi

printf "${reset}Ingresa el puerto para la api de las notas: default [8082]:\n"
read NOTES_API_PORT

if [ "$NOTES_API_PORT" = "" ]; then
    NOTES_API_PORT=8082
fi

printf "${cyan}Generando la llave secreta para la decodificación de los tokens de acceso...\n"

API_KEY=$(openssl rand -hex 20)
printf "${green}[ Generada ] ${cyan}${API_KEY}\n"


printf "${cyan}Creando archivos .env...\n"
echo "
# Variables de entorno para la api

DB_HOST=localhost
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
USERS_API_PORT=$USERS_API_PORT
EVENTS_API_PORT=$EVENTS_API_PORT
NOTES_API_PORT=$NOTES_API_PORT
API_KEY=$API_KEY


# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB (Preview).
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="'"postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/mydb?schema=public"'"

" > .env
cp .env usuarios-api/
cp .env agenda-api/
cp .env nota-api/


printf "${reset}\n"
printf "${cyan}Iniciando el servicio de base de datos para su configuración inicial...\n"
docker-compose up -d --build postgres

printf "${reset}\n"
printf "${cyan}Instalando módulos de node...\n"

docker run -it --rm -w /app -v $(pwd)/usuarios-api/:/app node:16 npm i
docker run -it --rm -w /app -v $(pwd)/agenda-api/:/app node:16 npm i
docker run -it --rm -w /app -v $(pwd)/nota-api/:/app node:16 npm i

printf "${reset}\n"
printf "${cyan}Creando base de datos..."

# npx prisma migrate dev --name init
docker run -it --rm --network="host" -w /app -v $(pwd)/usuarios-api/:/app node:16 npx prisma migrate dev --name init

printf "${cyan}Generando los clientes de prisma para los ambientes de docker...\n"
docker run -it --rm -w /app -v $(pwd)/usuarios-api/:/app node:16 npm run generate
docker run -it --rm -w /app -v $(pwd)/agenda-api/:/app node:16 npm run generate
docker run -it --rm -w /app -v $(pwd)/nota-api/:/app node:16 npm run generate

printf "${reset}\n"
printf "${reset}Ingresa el nombre de usuario para el administrador de la api: default [admin]:\n"
read USERNAME

if [ "$USERNAME" = "" ]; then
    USERNAME=admin
fi

printf "${reset}Ingresa la contraseña para el administrador de la api: default [admin]:\n"
read PASSWORD

if [ "$PASSWORD" = "" ]; then
    PASSWORD=admin
fi

docker run -it --rm --network="host" -w /app -v $(pwd)/usuarios-api:/app node:16 node create-user --username $USERNAME --password $PASSWORD

printf "${reset}\n"

printf "${cyan}Dando de baja el servicio de base de datos...\n"
docker-compose down
printf "${reset}\n"
printf "${green}Instalación completa"

printf "${reset}\n"
printf "${reset}Ahora puedes correr los servicios con el comando:\n"
echo ""
printf "${reset}\t$ ${blue}docker-compose up -d"
printf "${reset}\n"
echo ""


