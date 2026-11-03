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



document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        changeState("paused");
        console.log('Du tryckte på Escape!');

        
    }
    });

// Skapa din meny-knapp en gång
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

const resumeBtn = document.createElement("button");
resumeBtn.style.backgroundImage = "url('resume.png')";
resumeBtn.style.position = "absolute";
resumeBtn.style.top = "50%";
resumeBtn.style.left = "50%";
resumeBtn.style.transform = "translate(-50%, -50%)";
resumeBtn.addEventListener("click", () => {
    if (state === "paused") {
        changeState("playing");
    }
});


const menuOverlay = document.createElement("div");
menuOverlay.style.position = "fixed";
menuOverlay.style.top = "0";
menuOverlay.style.left = "0";
menuOverlay.style.width = "100vw";
menuOverlay.style.height = "100vh";
menuOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.6)";

function update() {
    if (state === "menu") {
        // Kontrollera om knappen inte redan ligger på sidan och lägger till den
        if (!document.body.contains(startBtn)) {
            document.body.appendChild(startBtn);
        }
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        }
        
        // Här kan du ha logik för menyn om det behövs
    } 
    else if (state === "playing") {
        // Om spelet har startat såta bort menyknappen från skärmen
        if (document.body.contains(startBtn)) {
            startBtn.remove();
        }
        if (document.body.contains(resumeBtn)) {
            resumeBtn.remove();
        }
        if (document.body.contains(menuOverlay)) {
            menuOverlay.remove();
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
        console.log("Spelet är pausat!");
        if (!document.body.contains(menuOverlay)) {
            document.body.appendChild(menuOverlay);
        }
        if (!document.body.contains(resumeBtn)) {
            document.body.appendChild(resumeBtn);
        }


    }
}

// Själva gameloopen som körs t.ex. 60 gånger per sekund eller via requestAnimationFrame
function gameLoop() {
    update();
    requestAnimationFrame(gameLoop);
}

// Starta loopen
gameLoop();
