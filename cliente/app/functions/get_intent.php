<?php
header('Content-Type: application/json');

if (isset($_GET["mensaje"])) {
    $mensaje = $_GET["mensaje"];
    $cliente = new SoapClient("http://chat:8000?wsdl");
    $result = $cliente->get_intent(array("mensaje" => $mensaje));
    $respuesta = $result->get_intentResult->string;
    echo json_encode(["intent" => $respuesta]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Se requiere el parámetro 'mensaje'"]);
}
