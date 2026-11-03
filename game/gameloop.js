console.log("script laddat")

let state = "menu";

function changeState(newState) {
    state = newState;
}


changeState("playing");
console.log(state); // Borde skriva ut "playing" i konsolen

// Skapa din meny-knapp en gång
const startBtn = document.createElement("button");
startBtn.style.backgroundImage = "url('start.png')";
startBtn.style.position = "absolute";
startBtn.style.top = "50%";
startBtn.style.left = "50%";
startBtn.style.transform = "translate(-50%, -50%)";

startBtn.addEventListener("click", () => {
    if (state === "menu") {
        changeState("playing");
    }
});

function update() {
    if (state === "menu") {
        // Kontrollera om knappen inte redan ligger på sidan och lägger till den
        if (!document.body.contains(startBtn)) {
            document.body.appendChild(startBtn);
        }
        
        // Här kan du ha logik för menyn om det behövs
    } 
    else if (state === "playing") {
        // Om spelet har startat såta bort menyknappen från skärmen
        if (document.body.contains(startBtn)) {
            startBtn.remove();
        }

        // Här körs själva spelets logik (t.ex. flytta gubbar, rita ut spelplanen etc.)
        console.log("Spelet har börjat!");
    }
}

// Själva gameloopen som körs t.ex. 60 gånger per sekund eller via requestAnimationFrame
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

// Starta loopen
gameLoop();










































































//working gameloop for player testing replace maybe idk
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const input = new InputHandler(canvas);
const player = new Player(400, 300); // Start centered

function render() {
  player.update(input);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.draw(ctx);

  requestAnimationFrame(render);
}

render();
