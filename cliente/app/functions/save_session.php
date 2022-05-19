<?php

session_start();


$email = $_GET["email"];
$id = $_GET["id"];
$nombre = $_GET["nombre"];
$token = $_GET["token"];
$username = $_GET["username"];

$_SESSION["email"] = $email;
$_SESSION["id"] = $id;
$_SESSION["nombre"] = $nombre;
$_SESSION["token"] = $token;
$_SESSION["username"] = $username;

header('Location: /');