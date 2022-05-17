@REM  
@REM    Autores:
    @REM  Alejandro de Jesús ¨Sánchez Morales
    @REM  Emanuel Alejandro Solórzano Guzmán
@REM  
@ECHO OFF
echo.
echo Installing Nora Lends Services

set pwd=%~dp0
echo %pwd%

echo.

set /p DB_USER="Enter the username for the database user: default [admin]: "
IF [%DB_USER%] == [] set DB_USER=admin

set /p DB_PASSWORD="Enter the password for the database user: default [admin]"
IF [%DB_PASSWORD%] == [] set DB_PASSWORD=admin

set /p PORT="Enter the port for the api users: default [8080]"
IF [%PORT%] == [] set PORT=8080

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


docker-compose up -d --build postgres

echo Waiting for the postgres Service to come online
TIMEOUT /t 5

echo Installing node modules...
cd usuarios-api

docker run -it --rm -w /app -v %pwd%:/app node:16 npm i

echo  Creating database...

npx prisma migrate dev --name init

echo Generating Prisma Client for docker environment...

docker run -it --rm -w /app -v %pwd%:/app node:16 npm run generate

set /p USERNAME2="Enter the username for the admin user: default [admin]: "
IF [%USERNAME2%] == [] set USERNAME2=admin

set /p PASSWORD="Enter the password for the admin user: default [admin]: "
IF [%PASSWORD%] == [] set PASSWORD=admin

echo %USERNAME2%:%PASSWORD%

docker run -it --rm --network="host" -w /app -v %pwd%:/app node:16 node create-user --username %USERNAME2% --password %PASSWORD%


echo Shutting down postgres service...
docker-compose down
echo.
echo Install completed
echo.
echo You may run this service with the command
echo.
echo $ docker-compose up -d
echo.


