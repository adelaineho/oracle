<?php
    header("Access-Control-Allow-Credentials: true");
    //header("Access-Control-Allow-Origin: http://");
    header("Access-Control-Allow-Methods: POST");
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization");

    $request_body = file_get_contents('php://input');
    $request_data = json_decode($request_body);

    $ch = curl_init();

    $url = 'https://www.metamind.io/language/classify';
    $data = array(
        'trained_model_id' => $request_data->trained_model_id,
        'value' => $request_data->value,
    );

    $optArray = array(
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER => false,
        CURLOPT_HTTPHEADER => array(
            'Authorization: Basic 7zZmxxJNVhLH1ZeuCxu3UHwDxCAE8fQFXWyIzejwnNe9vxLLLC',
            'Content-Type: application/json'
        ),
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
    );

    curl_setopt_array($ch, $optArray);

    $result = curl_exec($ch);

    if ($result === false || empty($result)) {
        return;
    } else {
        echo $result;
    }

?>