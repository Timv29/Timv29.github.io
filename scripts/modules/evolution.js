import generateInfo from "./pokeInfo.js";

export default function generateEvolution(speciesData, targetDiv, regions){

    fetch(speciesData.evolution_chain.url)
    .then(response => response.json())
    .then(evoData => {
        console.log(evoData.chain);
        function displayChain(data, div){
            const species = document.createElement("div");
            species.setAttribute("class", "evolution")
            const divider = document.createElement("img");
            const name = document.createElement("p");
            name.innerHTML = data.species.name;
            const method = document.createElement("p");
            if(data.evolution_details.length === 1){
                if(data.evolution_details[0].trigger.name === "level-up"){
                    switch(true){
                        case data.evolution_details[0].min_affection !== null:
                            method.innerHTML = `affection ${ data.evolution_details[0].min_affection}`;
                            break;
                        case data.evolution_details[0].min_beauty !== null:
                            method.innerHTML = `beauty ${ data.evolution_details[0].min_beauty}`;
                            break;
                        case data.evolution_details[0].min_happiness !== null:
                            method.innerHTML = `happiness ${ data.evolution_details[0].min_happiness}`;
                            break;
                        case data.evolution_details[0].min_level !== null:
                            method.innerHTML = `level ${ data.evolution_details[0].min_level}`;
                            break;
                        default:
                            method.innerHTML = 'other';
                    }
                }
                else if(data.evolution_details[0].trigger.name === "use-item"){
                    method.innerHTML = data.evolution_details[0].item.name;
                }
                else if(data.evolution_details[0].trigger.name === "trade"){
                    if(data.evolution_details[0].held_item !== null){
                        method.innerHTML = `trade holding ${data.evolution_details[0].held_item.name}`
                    }
                    else if(data.evolution_details[0].trade_species !== null){
                        method.innerHTML = `trade for ${data.evolution_details[0].trade_species.name}`;
                    }
                    else{
                        method.innerHTML = 'trade';
                    }
                }
                else{
                    method.innerHTML = 'other';
                }
            }
            else if(data.evolution_details.length > 1){
                method.innerHTML = "game dependent"
            }
            species.appendChild(name);
            species.appendChild(method);
            switch(true){
                case data.evolves_to.length > 1:
                    divider.setAttribute("src", "images/split.png");
                    break;
                case data.evolves_to.length === 1:
                default:
                    divider.setAttribute("src", "images/right-arrow.png");
                    break;
            }
            if(data.species.name === speciesData.name){
                species.style.backgroundColor = "rgb(152, 255, 220)";
            }
            else{
                species.style.cursor = "pointer";
                species.addEventListener("click", () => {
                    fetch(`https://pokeapi.co/api/v2/pokemon/${data.species.name}/`)
                        .then(response => response.json())
                        .then(data => {
                            generateInfo(data, regions);
                        })
                })
            }
            div.appendChild(species);
            targetDiv.appendChild(div);
            if(data.evolves_to.length > 0){
                targetDiv.appendChild(divider);
                const evoSpeciesDiv = document.createElement("div");
                evoSpeciesDiv.setAttribute("class", "evolutionStage");
                for(const evolution of data.evolves_to){
                    displayChain(evolution, evoSpeciesDiv);
                }
            }
        }

        const evoSpeciesDiv = document.createElement("div");
        evoSpeciesDiv.setAttribute("class", "evolutionStage")
        displayChain(evoData.chain, evoSpeciesDiv);
    })
}