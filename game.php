<?php
    if(isset($_POST['submit'])){
        if(isset($_POST['premade'])){
            if($_POST['premade'] !== "custom"){
                $playlistID = htmlspecialchars($_POST['premade']);
            }
            else{
                if(!empty($_POST['playlist'])){
                    if(preg_match('/(?<=playlist\/)\w+/', $_POST['playlist'], $matches)){
                        $playlistID = htmlspecialchars($matches[0]);
                    }
                    else{
                        header('Location: index.php?error=playlist_format');
                    }
                }
                else{
                    header('Location: index.php?error=empty_playlist');
                }
            }
        }
        else{
            header('Location: index.php?error=empty_select');
        }
        if(isset($_POST['gamemode'])){
            $gamemode = 'date';
        }
        else{
            $gamemode = 'popularity';
        }
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spotify Game</title>
    <script src="https://kit.fontawesome.com/3407526513.js" crossorigin="anonymous"></script>
    <script>
        const playlistID = <?= json_encode($playlistID);?>;
        const gamemode = <?= json_encode($gamemode);?>;
    </script>
    <script src="js/main.js" type="module"></script>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <a href="index.php" id="back"><i class="fa-solid fa-arrow-left"></i></a>
    <h1><?= $gamemode === 'date' ? 'Which song is older?' : 'Which song is more popular?'?></h1>
    <h2 id="result"></h2>
    <p id="score"></p>
    <span class="loader"></span>
    <div class="songs">
        <div class="song-first">
            <img class="albumCover">
            <div class="info">
                <p class="title"></p>
                <p class="artist"></p>
            </div>
            <div class="progress">
                <img class="bar" src="img/bar.svg">
                <div class="duration">
                    <p class="currentTime">1:23</p>
                    <p class="endTime">4:56</p>
                </div>
            </div>
        </div>
        <div class="song-second">
            <img class="albumCover">
            <div class="info">
                <p class="title"></p>
                <p class="artist"></p>
            </div>
            <div class="progress">
                <img class="bar" src="img/bar.svg">
                <div class="duration">
                    <p class="currentTime">1:23</p>
                    <p class="endTime">4:56</p>
                </div>
            </div>
        </div>
    </div>
    <div id="game-over">
        <div id="game-over-message">
            <h2>Game Over</h2>
            <p id="final-score"></p>
            <p id="high-score"></p>
            <button type="button" id="try-again">Try Again</button>
        </div>
    </div>
</body>
</html>