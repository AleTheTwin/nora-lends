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
printf "${cyan}Installing Nora Lends Services\n"

printf "${reset}\n"
printf "${reset}Enter the usernme for the database user: default [admin]:\n"
read DB_USER

if [ "$DB_USER" = "" ]; then
    DB_USER=admin
fi

printf "${reset}Enter the password for the database user: default [admin]:\n"
read DB_PASSWORD

if [ "$DB_PASSWORD" = "" ]; then
    DB_PASSWORD=admin
fi


printf "${reset}Enter the port for the api users: default [8080]:\n"
read PORT

if [ "$PORT" = "" ]; then
    PORT=8080
fi

printf "${cyan}Generating apikey for Bearer tokens decoding...\n"

API_KEY=$(openssl rand -hex 20)
printf "${green}[ ok ] ${API_KEY}\n"


printf "${cyan}Creating .env files...\n"
echo "
# Variables de entorno para la api

DB_HOST=localhost
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD
PORT=$PORT
API_KEY=$API_KEY


# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB (Preview).
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="'"postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/mydb?schema=public"'"

" > .env
cp .env usuarios-api/


docker-compose up -d --build postgres
printf "${reset}\n"
printf "${cyan}Waiting for the postgres service to come online...\n"
sleep 5

printf "${reset}\n"
printf "${cyan}Installing node modules...\n"
cd usuarios-api

docker run -it --rm -w /app -v $(pwd):/app node:16 npm i

printf "${reset}\n"
printf "${cyan}Creating database..."

# npx prisma migrate dev --name init
docker run -it --rm --network="host" -w /app -v $(pwd):/app node:16 npx prisma migrate dev --name init

printf "${cyan}Generating Prisma Client for docker environment...\n"
docker run -it --rm -w /app -v $(pwd):/app node:16 npm run generate

printf "${reset}\n"
printf "${reset}Enter the usernme for the admin user: default [admin]:\n"
read USERNAME

if [ "$USERNAME" = "" ]; then
    USERNAME=admin
fi

printf "${reset}Enter the password for the admin user: default [admin]:\n"
read PASSWORD

if [ "$PASSWORD" = "" ]; then
    PASSWORD=admin
fi

docker run -it --rm --network="host" -w /app -v $(pwd):/app node:16 node create-user --username $USERNAME --password $PASSWORD

printf "${reset}\n"

printf "${cyan}Shutting down postgres service...\n"
docker-compose down
printf "${reset}\n"
printf "${green}Install completed"

printf "${reset}\n"
printf "${reset}You may run this service with the command"
printf "${reset}\n"
printf "${reset}\t$ ${blue}docker-compose up -d"
printf "${reset}\n"


