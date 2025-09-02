const radio = document.querySelector("#custom");

document.querySelector(".radios").addEventListener('click', () => {
    if(!radio.checked){
        document.querySelector(".custom-playlist").style.transform = "scaleY(0)";
    }
    else{
        document.querySelector(".custom-playlist").style.transform = "scaleY(1)";
    }
})