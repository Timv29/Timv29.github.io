import generateInfo from "./modules/pokeInfo.js"


const regions = new Map;
fetch("https://pokeapi.co/api/v2/generation", {method: "GET"})
    .then(response => response.json())
    .then(data => {
        for(const region of data.results){
            fetch(region.url, {method:"GET"})
                .then(response => response.json())
                .then(genData => {
                    regions.set(region.name, genData.main_region.name);
                })
        }
    })


async function fetchPokemon(){
    //Aantal pokemon kleiner gemaakt om niet steeds de API te belasten, terugzetten naar 898
    for(let i=1;i<=151;i++){
        try{
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`, {
                method: "GET",
                cache: 'force-cache'
            });
            const data = await response.json();
            const pokeDiv = document.createElement("div");
            const pokeId = document.createElement("p");
            let id = data.id;
            if(data.id < 100){
                id = "0" + id;
                if(data.id < 10){
                    id = "0" + id;
                }
            }
            pokeId.innerHTML = "#" + id;
            const sprite = document.createElement("img");
            sprite.setAttribute("src", data.sprites.front_default);
            pokeDiv.appendChild(sprite);
            pokeDiv.appendChild(pokeId);
            pokeDiv.addEventListener("click", () => {
                showPkmn(data);
            })
            document.querySelector("nav").appendChild(pokeDiv);
            if(i === 1){
                showPkmn(data);
            }
        }
        catch (err){
            console.error(err);
        }
    }
}

function showPkmn(data){
    //random shiny chance
    const rand = Math.floor(Math.random() * 10) + 1;
    data.shiny = rand === 6 ? true : false;
    //generate description
    generateInfo(data, regions);
}

fetchPokemon();