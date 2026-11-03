import { SuperClass } from "./superclass.js";

export class Player extends SuperClass {
  constructor(x, y, width, height, range, fov, direction, img, speed = 4) {
    super(x, y, width, height, range, fov, direction, img);
    this.speed = speed;
    this.angle = 0;

    // player sizes for box or circle collision
    this.radius = 15;
    this.width = 30;
    this.height = 30;
// --- Animation Assets & State ---
    this.imgIdle = new Image();
    this.imgIdle.src = './images/basechar.png';

    this.imgLeftFoot = new Image();
    this.imgLeftFoot.src = './images/basechar_leftfeet.png';

    this.imgRightFoot = new Image();
    this.imgRightFoot.src = './images/basechar_rightfeet.png';

    this.frameTimer = 0;
    this.frameInterval = 12; // Frames to hold each step (lower = faster feet)
    this.walkStep = 0;       // 0: idle, 1: left foot, 2: right foot

  }

  // returns box size for walls or tile checks
  getBounds() {
    return {
      x: this.x - this.width / 2,
      y: this.y - this.height / 2,
      width: this.width,
      height: this.height,
      radius: this.radius
    };
  }

  // general check for circle or rectangle so team can just use it
  intersects(other) {
    // if other has radius its circle vs circle
    if (other.radius !== undefined) {
      const dx = this.x - other.x;
      const dy = this.y - other.y;
      const r = this.radius + other.radius;
      return (dx * dx + dy * dy) < (r * r);
    }

    // if other has w and h its circle vs rect (walls or doors)
    if (other.width !== undefined && other.height !== undefined) {
      const closestX = Math.max(other.x, Math.min(this.x, other.x + other.width));
      const closestY = Math.max(other.y, Math.min(this.y, other.y + other.height));

      const dx = this.x - closestX;
      const dy = this.y - closestY;
      return (dx * dx + dy * dy) < (this.radius * this.radius);
    }

    return false;
  }

  // detectCollision
  detectCollision(entityList) {
    entityList.forEach(other => {
      if (other === this) return;

      if (this.intersects(other)) {
        // Simple circle vs circle / box push-back resolution
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const distance = Math.hypot(dx, dy);
        const minDist = this.radius + (other.radius || 15);

        if (distance < minDist && distance > 0) {
          // Calculate how much they are overlapping
          const overlap = minDist - distance;
          
          // Push player away from the other entity along the collision angle
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * overlap;
          this.y += Math.sin(angle) * overlap;
        }
      }
    });
  }

  update(input) {
    // aim angle
    const dirX = input.mouse.x - this.x;
    const dirY = input.mouse.y - this.y;
    this.angle = Math.atan2(dirY, dirX);
    this.direction = this.angle; // sync superclass dir

    // movement
    const { x, y } = input.getAxis();
    let vx = 0;
    let vy = 0;

    let isMoving = (x !== 0 || y !== 0);

    if (isMoving) {
      if (x !== 0 && y !== 0) {
        const invLen = 1 / Math.SQRT2; 
        vx = x * invLen * this.speed;
        vy = y * invLen * this.speed;
      } else {
        vx = x * this.speed;
        vy = y * this.speed;
      }

      // Update animation timer for footsteps while moving
      this.frameTimer++;
      if (this.frameTimer >= this.frameInterval) {
        this.walkStep = (this.walkStep === 1) ? 2 : 1;
        this.frameTimer = 0;
      }
    } else {
      // Reset when standing still
      this.walkStep = 0;
      this.frameTimer = 0;
    }

    this.x += vx;
    this.y += vy;
  }

draw(ctx, camera = null) {
    ctx.save();
    ctx.translate(this.x - (camera?.x ?? 0), this.y - (camera?.y ?? 0));

    // Keep rotation matching your sprite
    ctx.rotate(this.angle + Math.PI / 2 + Math.PI); // Rotate to face the mouse, adjusted for sprite orientation

    // Laser shoots 180 deg opposite (forward from head instead of out the back)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 0, 0, 0.4)'; 
    ctx.lineWidth = 1;
    ctx.setLineDash([6, 4]);                     
    ctx.moveTo(0, 15);     // front tip of the head
    ctx.lineTo(0, 800);    // project forward
    ctx.stroke();
    ctx.setLineDash([]);                     

    // Select image based on footstep
    let activeImage;
    if (this.walkStep === 1) {
      activeImage = this.imgLeftFoot;
    } else if (this.walkStep === 2) {
      activeImage = this.imgRightFoot;
    } else {
      activeImage = this.imgIdle;
    }

    // Draw sprite centered
    ctx.drawImage(activeImage, -32, -32, 64, 64);

    ctx.restore();
  }
}