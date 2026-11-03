import { Player } from "./entity/player.js";
import { Enemy } from "./entity/enemy.js";
import { Camera } from "./camera.js";

//Camera follow player instance
export const cameraMan = new Camera(0, 0, 800, 600);

export const entityList = [
    new Player(50, 50, 50, 50, 100, Math.PI, 0, "./images/basechar.png"),
    new Enemy(50, 50, 50, 50, 100, Math.PI, 0, "./images/basechar.png")
];

// Add world-space rectangles here with x, y, width, and height.
export const visionBlockers = [];
