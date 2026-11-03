export class Camera {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    follow(Player) {
        this.x = Player.x - this.width / 2 + Player.width / 2;
        this.y = Player.y - this.height / 2 + Player.height / 2;
    }
}