import { SuperClass } from "./superclass";

export class Npc extends SuperClass {
    constructor() {
        super(x, y, width, height)
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}