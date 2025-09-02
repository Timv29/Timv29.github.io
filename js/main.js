import {Song} from "./classes/Song.js";
import { Playlist } from "./classes/Playlist.js";

let playlist;
let currentSong1;
let currentSong2;
let points;
let highscore;
if(localStorage.getItem("highscore") !== null){
    highscore = localStorage.getItem("highscore");
}
else{
    highscore = 0;
}

if(sessionStorage.getItem("playlistID") !== playlistID){
    sessionStorage.removeItem("playlist");
}

if(sessionStorage.getItem("playlist") === null){
    playlist = new Playlist();
    async function compilePlaylist(id, offset){
        const response = await fetch(`api/playlist.php?id=${id}&offset=${offset}`, {method: 'GET'});
        const data = await response.json()
        if(data.error != undefined){
            window.location.assign("index.php?error=fetch_error");
        }
        console.log(data);
    
        for(const track of data.items){
            const name = track.track.name;
            const artists = [];
            for(const artist of track.track.artists){
                artists.push(artist.name);
            }
            const popularity = track.track.popularity;
            const img = track.track.album.images[0].url;
            const date = track.track.album.release_date;
            const type = track.track.album.album_type;
            if (type === 'album' || type === 'single'){
                const song = new Song(name, artists, popularity, img, date);
                playlist.addSong(song);
            }
        }
        if(data.next !== null){
            const offset = data.next.match(/(?<=offset=)\d+/);
            await compilePlaylist(playlistID, offset);
        }
    }
    
    (async () => {
        await compilePlaylist(playlistID, 0);
        console.log("done", playlist);
        sessionStorage.setItem("playlist", JSON.stringify(playlist.songs));
        sessionStorage.setItem("playlistID", playlistID);
        initializeGame();
    })();
}
else{
    playlist = new Playlist();
    playlist.addFromJson(JSON.parse(sessionStorage.getItem("playlist")));
    console.log("from storage", playlist);
    initializeGame();
}

function displaySongs(){
    document.querySelector(".songs").style.display = "flex";
    document.querySelector(".loader").style.display = "none";
    let song1 = playlist.randomSong();
    let song2 = playlist.randomSong();
    while(song1 === song2){
        song2 = playlist.randomSong();
    }
    song1.displaySong(".song-first");
    song2.displaySong(".song-second");
    currentSong1 = song1;
    currentSong2 = song2;
    console.log(song1.date, song2.date);
}

//Choosing a song
document.querySelector(".song-first").addEventListener("click", () => {
    if(gamemode === 'popularity'){
        if(currentSong1.popularity > currentSong2.popularity || currentSong1.popularity === currentSong2.popularity){
            correct();
        }
        else{
            incorrect();
        }
    }
    else{
        const year1 = currentSong1.date.match(/^[0-9]{4}/);
        const year2 = currentSong2.date.match(/^[0-9]{4}/);

        if(year1[0] < year2[0] || year1[0] == year2[0]){
            correct();
        }
        else{
            incorrect();
        }
    }
})

document.querySelector(".song-second").addEventListener("click", () => {
    if(gamemode === 'popularity'){
        if(currentSong2.popularity > currentSong1.popularity || currentSong2.popularity === currentSong1.popularity){
            correct();
        }
        else{
            incorrect();
        }
    }
    else{
        const year1 = currentSong1.date.match(/^[0-9]{4}/);
        const year2 = currentSong2.date.match(/^[0-9]{4}/);

        if(year2[0] < year1[0] || year1[0] === year2[0]){
            correct();
        }
        else{
            incorrect();
        }
    }
})

document.querySelector("#try-again").addEventListener("click", () => {
    initializeGame();
})

function initializeGame(){
    document.querySelector("#game-over").style.display = "none";
    points = 0;
    document.querySelector("#score").innerHTML = "Score: "+points+" - High Score: "+highscore;
    displaySongs();
}

function correct(){
    points++;
    if(points > highscore){
        highscore = points;
        localStorage.setItem("highscore", highscore);
    }
    document.querySelector("#result").innerHTML = "Correct!";
    document.querySelector("#score").innerHTML = "Score: "+points+" - High Score: "+highscore;;
    displaySongs();
}

function incorrect(){
    document.querySelector("#result").innerHTML = "Incorrect!"; 
    document.querySelector("#game-over").style.display = "flex";
    document.querySelector("#final-score").innerHTML = "Final Score: "+points;
    document.querySelector("#high-score").innerHTML = "High Score: "+highscore;
    localStorage.setItem("highscore", highscore);
}