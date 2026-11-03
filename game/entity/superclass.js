export class SuperClass {
    constructor(range, fov, direction, img) {
        this.range = range;
        this.fov = fov;
        this.direction = direction;

        this.img = new Image();
        this.img.src = imgsrc;

        this.img.onload = () => {

            this.width = this.img.naturalWidth;
            this.height = this.img.naturalHeight;
        };
    }

    vissionCone() {
        
    }
}