import {typeColors, statColors} from "./colors.js"
let previousStats = null;

export default function generateTeam(array){
    let teamStats = [
        {name: "hp", stat: 0},
        {name: "attack", stat:0},
        {name: "defense", stat:0},
        {name: "special-attack", stat:0},
        {name: "special-defense", stat:0},
        {name: "speed", stat:0}
    ]
    let teamTypes = new Set;
    document.querySelector("#team").innerHTML = "";
    for(const pokemon of array){
        const teamPkmn = document.createElement("div");
        teamPkmn.setAttribute("class", "teamPkmn");
        const sprite = document.createElement("img");
        sprite.setAttribute("src", pokemon.shiny ? pokemon.sprites.front_shiny : pokemon.sprites.front_default);
        const name = document.createElement("p");
        name.innerHTML = pokemon.name;
        const deleteBtn = document.createElement("p");
        deleteBtn.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
        deleteBtn.addEventListener("click", () => {
            if(confirm("Are you sure you want to delete " + pokemon.name + " from your team?"))
            array.splice(array.indexOf(pokemon), 1);
            localStorage.setItem("team", JSON.stringify(array));
            generateTeam(array);
        })
        teamPkmn.appendChild(deleteBtn);
        teamPkmn.appendChild(sprite);
        teamPkmn.appendChild(name);
        teamPkmn.style.border = `2px solid ${typeColors[pokemon.types[0].type.name]}`;
        document.querySelector("#team").appendChild(teamPkmn);

        for(let i = 0; i < pokemon.stats.length; i++){
            teamStats[i].stat += pokemon.stats[i].base_stat;
        }

        for(const type of pokemon.types){
            teamTypes.add(type.type.name);
        }
    }

    //animated teamstats
    document.querySelector("#teamStats").innerHTML = "";
    const canvas = document.createElement("canvas");
    canvas.width = 600;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");

    const animateStats = () => {
        let progress = 0;
        const speed = 3;

        const initialStats = previousStats || teamStats.map(stat => ({ stat: 0 }))

        const drawFrame = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            progress += speed;
            let y = 0;
            for (let i = 0; i < teamStats.length; i++) {
                const startValue = initialStats[i].stat;
                const endValue = teamStats[i].stat;
                const widthValue = startValue + (endValue - startValue) * (progress/100);
                const width = (widthValue / 255) * 100;

                ctx.fillStyle = statColors[teamStats[i].name] 
                ctx.fillRect(200, y, width, 20);
                ctx.fillStyle = "black";
                ctx.textBaseline = "middle";
                ctx.font = "10px Pokemon";
                ctx.textAlign = "end";
                ctx.fillText("total " + teamStats[i].name, 195, y + 10);
                ctx.textAlign = "start";
                ctx.font = "8px Pokemon";
                ctx.fillText(teamStats[i].stat, 205, y +10);
                y += 30;
            }

            if (progress < 100) requestAnimationFrame(drawFrame);
        };

        requestAnimationFrame(drawFrame);
        previousStats = teamStats;
    };

    animateStats();
    const teamStatsDiv = document.querySelector("#teamStats");
    const teamh1 = document.createElement("h1");
    teamh1.innerHTML = "Team Stats"
    teamStatsDiv.appendChild(teamh1);
    teamStatsDiv.appendChild(canvas);

    const typesDiv = document.createElement("div");
    typesDiv.setAttribute("id", "teamTypes");
    for(const type of teamTypes){
        const typeDiv = document.createElement("div");
        typeDiv.setAttribute("class", "type");
        const typeP = document.createElement("p");
        typeP.innerHTML = type;
        typeDiv.appendChild(typeP);
        typeDiv.style.backgroundColor = typeColors[type];
        typesDiv.appendChild(typeDiv);
    }
    teamStatsDiv.appendChild(typesDiv);
}