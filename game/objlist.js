import { Player } from "./entity/player.js";
import { Enemy } from "./entity/enemy.js";
import { Camera } from "./camera.js";

//Camera follow player instance
export const cameraMan = new Camera(0, 0, 800, 600);

export const entityList = [
    new Player(50, 50, 50, 50, 4, "./img/player.png"),
    new Enemy(50, 50, 50, 50, 4, "./img/enemy.png")

]
