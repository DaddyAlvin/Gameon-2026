console.log("script laddat")

let state = "menu";

function changeState(newState) {
    state = newState;
}


changeState("playing");
console.log(state); // Borde skriva ut "playing" i konsolen