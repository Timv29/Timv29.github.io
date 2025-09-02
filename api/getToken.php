<?php
    // in own code create config.php with $cliend_id and $client_secret variables, or hardcode directly in here (not recommended!!)
    require_once 'config.php';
    session_start();

    $auth = base64_encode("$client_id:$client_secret");

    if(!isset($_SESSION['token']) || time() >= $_SESSION['tokenExpires']){
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, "https://accounts.spotify.com/api/token");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "Authorization: Basic $auth",
            "Content-Type: application/x-www-form-urlencoded"
        ));
        curl_setopt($ch, CURLOPT_POSTFIELDS, "grant_type=client_credentials");
    
        $result = json_decode(curl_exec($ch));
        $token = $result->access_token;
        $endTime = time() + $result->expires_in;
        $_SESSION['token'] = $token;
        $_SESSION['tokenExpires'] = $endTime;
        curl_close($ch);
    }
    else{
        $token = $_SESSION['token'];
    }
?>
