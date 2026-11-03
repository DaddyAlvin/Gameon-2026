class Player {
  constructor(x, y, speed = 4) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.angle = 0;
  }

  update(input) {
    //aim angle
    const dirX = input.mouse.x - this.x;
    const dirY = input.mouse.y - this.y;
    this.angle = Math.atan2(dirY, dirX);

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