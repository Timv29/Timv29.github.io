export class Song{
    #name;
    #artists = [];
    #popularity;
    #img;
    #date;

    constructor(name, artists, popularity, img, date){
        this.#artists = artists;
        this.#name = name;
        this.#popularity = popularity;
        this.#img = img;
        this.#date = date;
    }

    get name(){
        return this.#name;
    }

    get artists(){
        return this.#artists;
    }

    get popularity(){
        return this.#popularity;
    }

    get img(){
        return this.#img;
    }

    get date(){
        return this.#date;
    }

    displaySong(element){
        document.querySelector(element+' .albumCover').setAttribute("src", this.#img);
        document.querySelector(element+ ' .title').innerHTML = this.#name;
        document.querySelector(element+ ' .artist').innerHTML = this.#artists.join(", ");
    }

    toJSON() {
        return {
            name: this.#name,
            artists: this.#artists,
            popularity: this.#popularity,
            img: this.#img,
            date: this.#date
        };
    }
}