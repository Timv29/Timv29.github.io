import {typeColors, statColors} from "./colors.js";
import {adjustColor} from "./colorChange.js";
import generateTeam from "./team.js";
import generateEvolution from "./evolution.js";

let previousStats = null;
let team = [];

function capitalize(string) {
    return String(string).charAt(0).toUpperCase() + String(string).slice(1);
}

if(localStorage.getItem("team") !== null){
    team = JSON.parse(localStorage.getItem("team"));
}

export default function generateInfo(data, regions, lang){
    fetch("./files/lang.json", {method: "GET"})
        .then(response => response.json())
        .then(jsonData => {
            const info = document.querySelector(".info");
            info.innerHTML = "";
            document.querySelector("#moves").innerHTML = ""

            //sprite normal or shiny
            const sprite = document.createElement("img");
            sprite.setAttribute("id", "sprite");
            if(data.shiny){
                sprite.setAttribute("src", data.sprites.front_shiny)
                setTimeout(() => {
                    console.log("A shiny Pokémon has appeared!")
                }, 2000);
            }
            else{
                sprite.setAttribute("src", data.sprites.front_default);
            }
            const name = document.createElement("h1");
            const infoHeader = document.createElement("div");
            infoHeader.setAttribute("id", "infoHeader");
            const size = document.createElement("p");
            let height;
            let weight;
            let intro;
            let startingMoves;
            let statNames;
            let addToTeam;
            
            for(const translation of jsonData){
                if(translation.name === lang){
                    height = translation.height;
                    weight = translation.weight;
                    intro = translation.intro;
                    startingMoves = translation.moves;
                    statNames = translation.stats;     
                    addToTeam = translation.team;           
                }
            }
            size.innerHTML = `${height}: ${data.height / 10}m - ${weight}: ${data.weight / 10}kg`;
            document.querySelector("#startingMoves").innerHTML = startingMoves;
            //description
            const desc = document.createElement("p");
            const region = document.createElement("p");
            const evolutionDiv = document.createElement("div");
            evolutionDiv.setAttribute("id", "evolutions");
            fetch(data.species.url, {method: "GET", cache: "default"})
                .then(response => response.json())
                .then(speciesData => {
                    for(const entry of speciesData.names){
                        if(entry.language.name === lang){
                            name.innerHTML = entry.name;
                        }
                    }
                    for(const entry of speciesData.flavor_text_entries){
                        if(entry.language.name === lang){
                            desc.innerHTML = entry.flavor_text;

                            break;
                        }
                    }
                    if(speciesData.is_legendary === true || speciesData.is_mythical === true){
                        name.innerHTML += "★"
                    }

                    region.innerHTML = `${intro} ${capitalize(regions.get(speciesData.generation.name))}`

                    //evolutions
                    generateEvolution(speciesData, evolutionDiv, regions, lang);
                });

            const typesDiv = document.createElement("div");
            typesDiv.setAttribute("id", "types");
            //types
            for(const type of data.types){
                const typeDiv = document.createElement("div");
                typeDiv.setAttribute("class", "type");
                const typeP = document.createElement("p");
                fetch(`https://pokeapi.co/api/v2/type/${type.type.name}`, {method: "GET", cache: "force-cache"})
                    .then(response => response.json())
                    .then(typeData => {
                        for(const type of typeData.names){
                            if(type.language.name === lang){
                                typeP.innerHTML = type.name;
                            }
                        }
                    })
                typeDiv.appendChild(typeP);
                typeDiv.style.backgroundColor = typeColors[type.type.name];
                typesDiv.appendChild(typeDiv);
            }
            //stats canvas
            const canvas = document.createElement("canvas");
            canvas.width = 400;
            canvas.height = 200;
            const ctx = canvas.getContext("2d");

            const animateStats = () => {
                let progress = 0;
                const speed = 3;

                const initialStats = previousStats || data.stats.map(stat => ({ base_stat: 0 }));

                const drawFrame = () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    progress += speed;
                    let y = 0;
                    for (let i = 0; i < data.stats.length; i++) {
                        const startValue = initialStats[i].base_stat;
                        const endValue = data.stats[i].base_stat;
                        const widthValue = startValue + (endValue - startValue) * (progress/100);
                        const width = (widthValue / 255) * 400;

                        ctx.fillStyle = statColors[data.stats[i].stat.name];
                        ctx.fillRect(140, y, width, 20);
                        ctx.fillStyle = "black";
                        ctx.textBaseline = "middle";
                        ctx.font = "10px Pokemon";
                        ctx.textAlign = "end";
                        ctx.fillText(statNames[data.stats[i].stat.name], 135, y + 10);
                        ctx.textAlign = "start";
                        ctx.font = "8px Pokemon";
                        ctx.fillText(data.stats[i].base_stat, 145, y +10);
                        y += 30;
                    }

                    if (progress < 100) requestAnimationFrame(drawFrame);
                };

                requestAnimationFrame(drawFrame);
                previousStats = data.stats;
            };

            animateStats();
            //background colours
            if(data.types.length === 1){
                infoHeader.style.backgroundColor = typeColors[data.types[0].type.name];
            }
            else if(data.types.length > 1){
                infoHeader.style.backgroundImage = `linear-gradient(to right, ${typeColors[data.types[0].type.name]}, ${typeColors[data.types[1].type.name]})`;
            }
            document.querySelector(".main").style.backgroundColor = adjustColor(typeColors[data.types[0].type.name], 10)
            document.querySelector("#team").style.backgroundColor = adjustColor(typeColors[data.types[0].type.name], -10)
            infoHeader.appendChild(name);
            infoHeader.appendChild(sprite);
            infoHeader.appendChild(canvas);
            info.appendChild(infoHeader);
            info.appendChild(typesDiv);
            info.appendChild(size);
            info.appendChild(desc);
            info.appendChild(region);
            info.appendChild(evolutionDiv);
            for(const move of data.moves){
                if(move.version_group_details[0].level_learned_at <= 1 && move.version_group_details[0].move_learn_method.name === "level-up"){
                    const moveDiv = document.createElement("div");
                    moveDiv.setAttribute("class", "move");
                    const moveName = document.createElement("p");
                    moveName.innerHTML = move.move.name;
                    moveDiv.appendChild(moveName);
                    document.querySelector("#moves").appendChild(moveDiv);
                }
            }

            //team
            document.querySelector("#teamButton").innerHTML = "";
            const addBtn = document.createElement("button");
            addBtn.innerHTML = addToTeam;
            document.querySelector("#teamButton").appendChild(addBtn);
            if(team !== []){
                generateTeam(team, lang, regions);
            }
            addBtn.addEventListener("click", () => {
                if(team.length < 6){
                    const pokeCopy = structuredClone(data);
                    pokeCopy.name = prompt("What do you want to name your Pokémon?", name.innerHTML);
                    if(pokeCopy.name !== null && pokeCopy.name !== ""){
                        team.push(pokeCopy);
                        location.href = "#";
                        location.href = "#teamButton";
                    }
                }
                else{
                    alert("Team already has 6 Pokémon");
                }
                localStorage.setItem("team", JSON.stringify(team));
                generateTeam(team, lang, regions);
            })

        })
    
}