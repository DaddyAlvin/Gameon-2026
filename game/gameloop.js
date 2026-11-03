import { Canvas, ctx } from "./canvas.js";
import { Player } from "./entity/player.js";
import { Enemy } from "./entity/enemy.js";
import { Camera } from "./camera.js";
import { entityList, cameraMan } from "./objlist.js";
import { InputHandler } from "./entity/InputHandler.js";

let state = "menu";

function changeState(newState) {
    state = newState;
}

const input = new InputHandler(document.querySelector("canvas"));

const startBtn = document.createElement("button");
startBtn.style.backgroundImage = "./images/start.png";
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

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        let player = entityList[0];
        cameraMan.follow(player);

        // Draw characters
        entityList.forEach(e => {
            e.update(input);
            e.detectCollision(entityList); 
            e.draw(ctx, cameraMan);
        });
    }
    else if (state === "gameover") {
        // Här kan du ha logik för game over-skärmen om det behövs
    }
    else if (state === "paused") {
        // Här kan du ha logik för paus-skärmen om det behövs
    }
}

// Själva gameloopen som körs t.ex. 60 gånger per sekund eller via requestAnimationFrame
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

// Starta loopen
gameLoop();
