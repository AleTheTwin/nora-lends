<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
    <!-- <script src="src/js/tinysoap-browser-min.js"></script> -->
    <!-- <script src="src/js/main.js"></script> -->
</head>

<body>
    <h1>Asistente</h1>
    <?php
    if ($_SERVER['REQUEST_METHOD'] == "POST") {
        $mensaje = $_POST['mensaje'];
        $history = $_POST['history'];
        
        $history .= "<p>" . $mensaje . "</p>";
        $cliente = new SoapClient("http://chat:8000?wsdl");
        $result = $cliente->get_response(array("mensaje" => $mensaje));
        $respuesta = $result->get_responseResult->string;

        $history .= "<p>" . $respuesta . "</p>";
        echo $history;
        ?>
    <?php
}
    ?>

    <form action="" method="POST">
        <label for="mensaje">Mensaje</label>
        <input type="text" name="mensaje">
        <input style="display: none;" type="text" name="history" value="<?php echo"" ?>">
        <input type="submit" value="enviar">
    </form>

</body>

</html>