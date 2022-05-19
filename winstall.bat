@REM  
@REM Aun no ha sido probado en windows
@REM 
@REM    Autores:
    @REM  Alejandro de Jesús ¨Sánchez Morales
    @REM  Emanuel Alejandro Solórzano Guzmán
@REM  
@ECHO OFF
echo.
echo Instslando los servicios de Nora Lends

echo.

set /p DB_USER="Ingresa el nombre de usuario para el usuario de la base de datos: default [admin]: "
IF [%DB_USER%] == [] set DB_USER=admin

set /p DB_PASSWORD="Ingresa la contraseña para el usuario de la base de datos: default [admin]: "
IF [%DB_PASSWORD%] == [] set DB_PASSWORD=admin

set /p USERS_API_PORT="Ingresa el puerto para la api de los usuarios: default [8080]: "
IF [%USERS_API_PORT%] == [] set USERS_API_PORT=8080

set /p EVENTS_API_PORT="Ingresa el puerto para la api de los eventos: default [8081]: "
IF [%EVENTS_API_PORT%] == [] set EVENTS_API_PORT=8081

set /p NOTES_API_PORT="Ingresa el puerto para la api de las notas: default [8082]: "
IF [%NOTES_API_PORT%] == [] set NOTES_API_PORT=8082

SET API_KEY=%random%%random%%random%%random%%random%%random%

SET API_KEY=%API_KEY:0=a%
SET API_KEY=%API_KEY:1=b%
SET API_KEY=%API_KEY:2=c%

echo # Variables de entorno para la api > .env
echo DB_HOST=localhost >> .env
echo DB_USER=%DB_USER% >> .env
echo DB_PASSWORD=%DB_PASSWORD% >> .env
echo PORT=%PORT% >> .env
echo API_KEY=%API_KEY% >> .env
echo DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/mydb?schema=public" >> .env

xcopy /y/f .env usuarios-api/
xcopy /y/f .env agenda-api/

docker-compose up -d --build postgres


echo Instalando módulos de node...

set pwd=%~dp0
docker run -it --rm -w /app -v %pwd%/usuarios-api/:/app node:16 npm i
docker run -it --rm -w /app -v %pwd%/agenda-api/:/app node:16 npm i

echo  Creando base de datos...

docker run -it --rm --network="host" -w /app -v %pwd%/usuarios-api/:/app node:16 npx prisma migrate dev --name init

echo Generando los clientes de prisma para los ambientes de docker...

docker run -it --rm -w /app -v %pwd%/usuarios-api/:/app node:16 npm run generate
docker run -it --rm -w /app -v %pwd%/agenda-api/:/app node:16 npm run generate

set /p USERNAME2="Ingresa el nombre de usuario para el administrador de la api: default [admin]: "
IF [%USERNAME2%] == [] set USERNAME2=admin

set /p PASSWORD="Ingresa la contraseña para el administrador de la api: default [admin]:: "
IF [%PASSWORD%] == [] set PASSWORD=admin

echo %USERNAME2%:%PASSWORD%

docker run -it --rm --network="host" -w /app -v %pwd%/usuarios-api/:/app node:16 node create-user --username %USERNAME2% --password %PASSWORD%


echo Apagando el servicio de base de datos...
docker-compose down
echo.
echo Instalación completa
echo.
echo Ahora puedes correr los servicios con el comando:
echo.
echo $ docker-compose up -d
echo.


