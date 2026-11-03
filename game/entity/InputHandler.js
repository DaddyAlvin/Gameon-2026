export class InputHandler {
  constructor(canvas) {
    //last key tracking
    this.isA = false;
    this.isD = false;
    this.isW = false;
    this.isS = false;
    this.lastH = 0;
    this.lastV = 0;
    this.mouse = { x: 0, y: 0 };

    //this.is(key) is tracking last key this.last(v/h) is tracking last direction pressed for both vertical and horizontal
    window.addEventListener('keydown', (e) => {
        console.log('KEY PRESSED:', e.code);
      if (e.code === 'KeyA') { this.isA = true; this.lastH = -1; }
      if (e.code === 'KeyD') { this.isD = true; this.lastH = 1; }
      if (e.code === 'KeyW') { this.isW = true; this.lastV = -1; }
      if (e.code === 'KeyS') { this.isS = true; this.lastV = 1; }
    });
//cancel if let go
    window.addEventListener('keyup', (e) => {
      if (e.code === 'KeyA') this.isA = false;
      if (e.code === 'KeyD') this.isD = false;
      if (e.code === 'KeyW') this.isW = false;
      if (e.code === 'KeyS') this.isS = false;
    });

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      // screen space to canvas space conversion
      this.mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
      this.mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
    });
  }

  //decides which key in Vertical and Horizontal direction is pressed last
  getAxis() {
  
    let x = 0;
    if (this.isA && this.isD) x = this.lastH;
    else if (this.isA) x = -1;
    else if (this.isD) x = 1;

    let y = 0;
    if (this.isW && this.isS) y = this.lastV;
    else if (this.isW) y = -1;
    else if (this.isS) y = 1;

    return { x, y };
  }
}