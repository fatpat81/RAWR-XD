window.HypnoticWheel = class HypnoticWheel {
  constructor(canvasId, onGameOver) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.onGameOver = onGameOver;
    
    this.width = this.canvas.clientWidth || 400;
    this.height = this.canvas.clientHeight || 600;
    this.isRunning = false;
    this.score = 0;
    this.spinsLeft = 3;
    
    this.angle = 0;
    this.velocity = 0;
    this.state = 'idle'; // idle, spinning, done
  }

  bindEvents() {
    this.handleTouch = this.handleTouch.bind(this);
    this.canvas.addEventListener('touchstart', this.handleTouch, {passive: false});
    this.canvas.addEventListener('mousedown', this.handleTouch);
  }

  unbindEvents() {
    this.canvas.removeEventListener('touchstart', this.handleTouch);
    this.canvas.removeEventListener('mousedown', this.handleTouch);
  }

  handleTouch(e) {
    e.preventDefault();
    if (!this.isRunning) return;

    if (this.state === 'idle') {
      if (this.spinsLeft <= 0) return;
      this.spinsLeft--;
      document.getElementById('timer-display').innerText = `Spins: ${this.spinsLeft}`;
      
      this.state = 'spinning';
      this.velocity = 0.5 + Math.random() * 0.3; // Random initial speed
      if ("vibrate" in navigator) navigator.vibrate(50);
    }
  }

  start() {
    this.width = this.canvas.clientWidth || 400;
    this.height = this.canvas.clientHeight || 600;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.isRunning = true;
    this.score = 0;
    this.spinsLeft = 3;
    this.angle = 0;
    this.velocity = 0;
    this.state = 'idle';

    document.getElementById('score-display').innerText = this.score;
    document.getElementById('timer-display').innerText = `Spins: ${this.spinsLeft}`;
    
    this.bindEvents();
    requestAnimationFrame((t) => this.loop(t));
  }

  endGame() {
    this.isRunning = false;
    this.onGameOver(this.score);
  }

  update() {
    if (this.state === 'spinning') {
        this.velocity *= 0.985; // Friction
        this.angle += this.velocity;
        
        // Peg click sound/vibration
        const pegModulo = (this.angle / (Math.PI * 2 / 20)) % 1;
        if (pegModulo < 0.1 && this.velocity > 0.05) {
            if ("vibrate" in navigator) navigator.vibrate(10);
        }

        if (this.velocity < 0.002) {
            this.velocity = 0;
            this.state = 'idle';
            this.calculatePrize();
        }
    }
  }

  calculatePrize() {
      // 20 slices, alternating colors. Let's assign random points based on slice.
      const normalizedAngle = this.angle % (Math.PI * 2);
      const sliceSize = (Math.PI * 2) / 20;
      
      // The pointer is at the top (-PI/2)
      // Angle measures clockwise rotation.
      const pointerAngle = (Math.PI * 1.5 + normalizedAngle) % (Math.PI * 2);
      const sliceIndex = Math.floor(pointerAngle / sliceSize);
      
      let points = 5;
      if (sliceIndex % 5 === 0) points = 50; // Jackpot slice
      else if (sliceIndex % 2 === 0) points = 10;
      else if (sliceIndex % 7 === 0) points = -10; // Unlucky
      
      this.score += points;
      if (this.score < 0) this.score = 0;
      document.getElementById('score-display').innerText = this.score;
      
      if (points > 0) {
         if ("vibrate" in navigator) navigator.vibrate([30, 50, 100]);
      } else {
         if ("vibrate" in navigator) navigator.vibrate(150);
      }
      
      if (this.spinsLeft <= 0) {
          setTimeout(() => this.endGame(), 1500);
      }
  }

  draw(timestamp) {
    if (window.GameUtils && window.GameUtils.drawHypnoticWheel) {
        // drawHypnoticWheel takes time to rotate by default. We want manual control.
        // Will simulate by passing this.angle * 2500 (since it divides by 2500)
        window.GameUtils.drawHypnoticWheel(this.ctx, this.width, this.height, this.angle * 2500);
    } else {
        this.ctx.fillStyle = '#050505'; this.ctx.fillRect(0,0,this.width,this.height);
    }
    
    // Draw Pointer at Top Center
    this.ctx.fillStyle = '#FF0000';
    this.ctx.beginPath();
    this.ctx.moveTo(this.width/2 - 20, 20);
    this.ctx.lineTo(this.width/2 + 20, 20);
    this.ctx.lineTo(this.width/2, 60);
    this.ctx.fill();

    if (this.state === 'idle' && this.spinsLeft > 0) {
        this.ctx.fillStyle = 'rgba(57, 255, 20, 0.9)';
        this.ctx.font = '40px "Permanent Marker"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText("TAP TO SPIN", this.width/2, this.height - 60);
    }
  }

  loop(timestamp) {
    if (!this.isRunning) return;
    this.update();
    this.draw(timestamp);
    requestAnimationFrame((t) => this.loop(t));
  }
};
