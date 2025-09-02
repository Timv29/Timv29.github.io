<?php
    if(isset($_GET['error'])){
        switch($_GET['error']){
            case 'empty_playlist':
                $error = 'Error: No playlist submitted!';
                break;
            case 'empty_select':
                $error = 'Error: No option selected!';
                break;
            case 'fetch_error':
                $error = 'Error: Could not find playlist. Make sure playlist is public and not made by Spotify!';
                break;
            case 'playlist_format':
                $error = 'Error: Not a valid playlist url';
                break;
            default:
                $error = 'Error: Unknown error!';
                break;
        }
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spotify Game</title>
    <link rel="stylesheet" href="css/style.css">
    <script src="js/form.js" defer></script>
</head>
<body>
    <h1>Spotify Game</h1>
    <h2>Guess which song is more popular</h2>
    <?='<p class="error">'.($error ?? '').'</p>'?>
    <form action="game.php" method="post">
        <div class="formfield">
            <p>Playlists:</p>
            <div class="radios">
                <div class="radio">
                    <label for="80s">80's classics</label>
                    <input type="radio" name="premade" id="80s" value="0zFSvcgzpslkTia17jCgL7">
                </div>
                <div class="radio">
                    <label for="rollingStone">Rolling Stone top 500</label>
                    <input type="radio" name="premade" id="rollingStone" value="7EAqBCOVkDZcbccjxZmgjp">
                </div>
                <div class="radio">
                    <label for="pop">Pop hits 2000-Now</label>
                    <input type="radio" name="premade" id="pop" value="6mtYuOxzl58vSGnEDtZ9uB">
                </div>
                <div class="radio">
                    <label for="custom">Custom Playlist</label>
                    <input type="radio" name="premade" id="custom" value="custom">
                </div>
            </div>
        </div>
        <div class="formfield custom-playlist">
            <label for="playlist">Enter your own (public) playlist link:</label>
            <input type="text" name="playlist" id="playlist">
        </div>
        <p>Gamemode:</p>
        <div class="formfield gamemode">
            <label for="gamemode">Popularity</label>
            <label class="switch">
                <input type="checkbox" name="gamemode" id="gamemode">
                <span class="slider"></span>
            </label>
            <label for="gamemode">Release Date</label>
        </div>
        <button type="submit" name="submit">Play</button>
    </form>
</body>
</html>