# 
#   Autores:
#     Alejandro de Jesús ¨Sánchez Morales
#     Emanuel Alejandro Solórzano Guzmán
# 

#!/bin/sh

alias reset='echo "\033[0m"'
alias cyan='echo "\033[36m"'
alias green='echo "\033[32m"'
alias yellow='echo "\033[33m"'
alias magenta='echo "\033[35m"'
alias blue='echo "\033[34m"'
alias red='echo "\033[31m"'


reset "\n"
cyan "Installing Nora Lends Services"

reset "\n"
reset "Enter the usernme for the database user: default [admin]"
read DB_USER

if [ "$DB_USER" = "" ]; then
    DB_USER=admin
fi

reset "Enter the password for the database user: default [admin]"
read DB_PASSWORD

if [ "$DB_PASSWORD" = "" ]; then
    DB_PASSWORD=admin
fi


reset "Enter the port for the api users: default [8080]"
read PORT

if [ "$PORT" = "" ]; then
    PORT=8080
fi

API_KEY=$(openssl rand -hex 20)


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
reset "\n"
cyan "Waiting for the postgres service to come online..."
sleep 5

reset "\n"
cyan "Installing node modules..."
cd usuarios-api

docker run -it --rm -w /app -v $(pwd):/app node:16 npm i

reset "\n"
cyan "Creating database..."
npx prisma migrate dev --name init

cyan "Generating Prisma Client for docker environment..."
docker run -it --rm -w /app -v $(pwd):/app node:16 npm run generate

reset "\n"
reset "Enter the usernme for the admin user: default [admin]"
read USERNAME

if [ "$USERNAME" = "" ]; then
    USERNAME=admin
fi

reset "Enter the password for the admin user: default [admin]"
read PASSWORD

if [ "$PASSWORD" = "" ]; then
    PASSWORD=admin
fi

docker run -it --rm --network="host" -w /app -v $(pwd):/app node:16 node create-user --username $USERNAME --password $PASSWORD

reset "\n"

cyan "Shutting down postgres service..."
docker-compose down
reset "\n"
green "Install completed"
reset
reset "You may run this service with the command"
reset
reset "\t$"$(blue "docker-compose up -d")
reset


