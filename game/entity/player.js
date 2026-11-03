import { SuperClass } from "./superclass";

export class Player extends SuperClass {
  constructor(x, y, speed = 4) {
    //need super first before this or error happens
    super(800, Math.PI / 4, 0, "");

    this.x = x;
    this.y = y;
    this.speed = speed;
    this.angle = 0;

    //player sizes for box or circle collision
    this.radius = 15;
    this.width = 30;
    this.height = 30;
  }

  //returns box size for walls or tile checks
  getBounds() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height,
      radius: this.radius
    };
  }

  //general check for circle or rectangle so team can just use it
  intersects(other) {
    //if other has radius its circle vs circle
    if (other.radius !== undefined) {
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      const r = this.radius + other.radius;z
      return (dx * dx + dy * dy) < (r * r);
    }

    //if other has w and h its circle vs rect (walls or doors)
    if (other.width !== undefined && other.height !== undefined) {
      const closestX = Math.max(other.x, Math.min(this.x, other.x + other.width));
      const closestY = Math.max(other.y, Math.min(this.y, other.y + other.height));

      const dx = this.x - closestX;
      const dy = this.y - closestY;
      return (dx * dx + dy * dy) < (this.radius * this.radius);
    }

    return false;
  }

  update(input) {
    //aim angle
    const dirX = input.mouse.x - this.x;
    const dirY = input.mouse.y - this.y;
    this.angle = Math.atan2(dirY, dirX);
    this.direction = this.angle; //sync superclass dir

    //movement
    const { x, y } = input.getAxis();
    let vx = 0;
    let vy = 0;

    if (x !== 0 && y !== 0) {
      const invLen = 1 / Math.SQRT2; 
      vx = x * invLen * this.speed;
      vy = y * invLen * this.speed;
    } else {
      vx = x * this.speed;
      vy = y * this.speed;
    }

    this.x += vx;
    this.y += vy;
  }

  //placeholder laser guide line for aiming switch for custom design later
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.4)'; 
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);                  
    ctx.moveTo(0, 0);
    ctx.lineTo(800, 0);                        
    ctx.stroke();
    ctx.setLineDash([]);                      

    ctx.fillStyle = 'blue';
    ctx.fillRect(-15, -15, 30, 30);

    ctx.fillStyle = 'red';
    ctx.fillRect(15, -4, 18, 8);

    ctx.restore();
  }
}