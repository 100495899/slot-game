<?php

$action = $_GET['action'] ?? $_POST['action'] ?? '';

if ($action === 'api_login') {
    // api_proxy.php
    $url = "https://promoforms.com/api/login";
    $data = [
        "email" => "api@promoforms.com",
        "password" => "BecomeYoo2021@@"
    ];

    $options = [
        "http" => [
            "header"  => "Content-type: application/json\r\n",
            "method"  => "POST",
            "content" => json_encode($data),
        ],
    ];
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    if ($result === FALSE) {
        http_response_code(500);
        echo json_encode(["error" => "Error al llamar a la API"]);
        exit;
    }
        // Decodifica el JSON y extrae solo el token
    $json = json_decode($result, true);
    $token = $json['token'] ?? null;
    if ($token) {
        echo $token; // Devuelve solo el token
    } else {
        http_response_code(500);
        echo json_encode(["error" => "No se pudo obtener el token"]);
    }
}elseif ($action == 'momento_ganador') {
    // Recoge el token (puedes pasarlo por POST o GET)
    $token = $_POST['token'] ?? $_GET['token'] ?? '';
    $origin = $_POST['origin'] ?? '002';
    $name = $_POST['name'] ?? $_GET['name'] ?? '';

    $url = "https://promoforms.com/api/pr/save/demo-juegos";
    $data = [
        "origin" => $origin,
        "name" => $name,
        "mail" => "ss@ss.com"
    ];

    $options = [
        "http" => [
            "header"  => "Authorization: Bearer $token\r\nContent-type: application/json\r\n",
            "method"  => "POST",
            "content" => json_encode($data),
        ],
    ];
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    
    if ($result === FALSE) {
        http_response_code(500);
        echo json_encode(["error" => "Error al llamar a la API de momento_ganador"]);
        exit;
    }
    echo $result;
   
} else {
    http_response_code(400);
    echo json_encode(["error" => "Acción no válida"]);
}

?>