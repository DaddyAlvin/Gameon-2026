console.log("script laddat")

let state = "menu";

function changeState(newState) {
    state = newState;
}


changeState("playing");
console.log(state); // Borde skriva ut "playing" i konsolen
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
