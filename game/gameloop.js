import { Canvas, ctx } from "./canvas.js";
import { Player } from "./entity/player.js";
import { Enemy } from "./entity/enemy.js";
import { Camera } from "./camera.js";
import { entityList, cameraMan, visionBlockers } from "./objlist.js";
import { InputHandler } from "./entity/InputHandler.js";

let state = "menu";

function changeState(newState) {
    state = newState;
}

const input = new InputHandler(document.querySelector("canvas"));
const player = entityList.find(entity => entity instanceof Player);
if (!player) {
    throw new Error("The entity list must contain a player.");
}

function resizeCanvas() {
    Canvas.width = window.innerWidth;
    Canvas.height = window.innerHeight;
    cameraMan.width = Canvas.width;
    cameraMan.height = Canvas.height;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);


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
        if (document.fullscreenEnabled && !document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(error => {
                console.error("Could not enter fullscreen mode:", error);
            });
        }
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

function update(dt) {
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
        if (document.body.contains(resumeBtn)) {
            resumeBtn.remove();
        }
        if (document.body.contains(menuOverlay)) {
            menuOverlay.remove();
        }


        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        
        cameraMan.follow(player);

        for (const entity of entityList) {
            if (entity === player) {
                entity.update(input, cameraMan);
            } else {
                entity.update(dt);
            }
        }

        for (const entity of entityList) {
            entity.detectCollision(entityList);
        }

        const blockers = [
            ...visionBlockers,
            ...entityList.filter(entity => entity.blocksVision)
        ];

        // Draw characters
        entityList.forEach(e => {
            e.draw(ctx, cameraMan);
        });

        player.vissionCone(ctx, cameraMan, player.angle, blockers, entityList);
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
let previousTime = 0;
function gameLoop(time) {
    const dt = previousTime === 0 ? 0 : Math.min((time - previousTime) / 1000, 0.05);
    previousTime = time;
    update(dt);
    requestAnimationFrame(gameLoop);
}

// Starta loopen
gameLoop();
