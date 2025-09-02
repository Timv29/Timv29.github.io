<?php
    require_once 'getToken.php';

    $ch = curl_init();

    $id = $_GET['id'];
    $offset = strval($_GET['offset']);

    curl_setopt($ch, CURLOPT_URL, 'https://api.spotify.com/v1/playlists/'.$id.'/tracks?offset='.$offset);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer '.$token
    ]);

    $result = curl_exec($ch);
    curl_close($ch);

    header('Content-Type: application/json');
    echo $result;
?>