const canvas = document.getElementById('htmlCanvas');
const ctx = canvas.getContext('2d');

function gameLoop() {

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);