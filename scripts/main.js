import generateInfo from "./modules/pokeInfo.js"
import generateTeam from "./modules/team.js"

let team = []

if(localStorage.getItem("team") !== null){
    team = JSON.parse(localStorage.getItem("team"));
}

async function fetchPokemon(){
    //Aantal pokemon kleiner gemaakt om niet steeds de API te belasten, terugzetten naar 898
    for(let i=1;i<=30;i++){
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
    generateInfo(data);
    //team
    document.querySelector("#teamButton").innerHTML = "";
    const addBtn = document.createElement("button");
    addBtn.innerHTML = "Add to Team";
    document.querySelector("#teamButton").appendChild(addBtn);
    if(team !== []){
        generateTeam(team);
    }
    addBtn.addEventListener("click", () => {
        if(team.length < 6){
            const pokeCopy = structuredClone(data);
            pokeCopy.name = prompt("What do you want to name your Pokémon?", pokeCopy.name);
            team.push(pokeCopy)
        }
        else{
            alert("Team already has 6 Pokémon");
        }
        localStorage.setItem("team", JSON.stringify(team));
        generateTeam(team);
    })

}


fetchPokemon();
