import {Song} from "./Song.js";

export class Playlist{
    #songs;

    constructor(songs = []){
        this.#songs = songs;
    }

    get songs(){
        return this.#songs;
    }

    addSong(song){
        this.#songs.push(song);
    }

    randomSong(){
        const i = Math.floor(Math.random() * this.#songs.length);
        return this.#songs[i];
    }

    addFromJson(array){
        for(const object of array){
            this.addSong(new Song(object.name, object.artists, object.popularity, object.img, object.date))
        }
    }
}