const startBtn = document.createElement("button");
startBtn.textContent = "Start Game";
startBtn.addEventListener("click", () => {
    if (state === "menu") {
        changeState("playing");
    }
});