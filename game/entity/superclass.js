export class SuperClass {
    constructor(x, y, width, height, range, fov, direction, img) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.range = range;
        this.fov = fov;
        this.direction = direction;

        this.img = new Image();
        this.img.src = img;

        this.img.onload = () => {

            this.width = this.img.naturalWidth;
            this.height = this.img.naturalHeight;
        };
    }

    vissionCone() {

    }
}