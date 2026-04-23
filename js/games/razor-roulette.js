window.RazorRoulette = class RazorRoulette {
  constructor(canvasId, onGameOver) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.onGameOver = onGameOver;
    
    this.width = this.canvas.clientWidth || 400;
    this.height = this.canvas.clientHeight || 600;
    this.isRunning = false;
    this.score = 0;
    this.playsLeft = 3;
    
    this.wheelAngle = 0;
    this.ball = { active: false, angle: 0, distance: 0, velocity: 0 };
    this.state = 'idle'; // idle, spinning
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
      if (this.playsLeft <= 0) return;
      this.playsLeft--;
      document.getElementById('timer-display').innerText = `Rounds: ${this.playsLeft}`;
      
      this.state = 'spinning';
      this.ball = {
         active: true,
         angle: Math.random() * Math.PI * 2,
         distance: this.width * 0.45,
         velocity: 0.15 + Math.random() * 0.1 // Fast clockwise spin
      };
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
    this.playsLeft = 3;
    this.state = 'idle';

    document.getElementById('score-display').innerText = this.score;
    document.getElementById('timer-display').innerText = `Rounds: ${this.playsLeft}`;
    
    this.bindEvents();
    requestAnimationFrame((t) => this.loop(t));
  }

  endGame() {
    this.isRunning = false;
    this.onGameOver(this.score);
  }

  update() {
    // Wheel spins counter-clockwise slowly
    this.wheelAngle -= 0.02;

    if (this.state === 'spinning') {
        this.ball.angle += this.ball.velocity;
        this.ball.velocity *= 0.99; // Slow down
        this.ball.distance -= 0.3; // Fall toward center
        
        // Bouncing logic as it slows down
        if (this.ball.distance < this.width * 0.25) {
            // Hit the slots!
            this.ball.distance = this.width * 0.25;
            this.state = 'idle';
            this.calculatePrize();
        }
    }
  }

  calculatePrize() {
      // Ball settles. Determine relative angle to wheel to find slot.
      const relAngle = (this.ball.angle - this.wheelAngle) % (Math.PI * 2);
      const normalizedAngle = relAngle < 0 ? relAngle + (Math.PI * 2) : relAngle;
      
      // 12 slots for simplicity
      const sliceSize = (Math.PI * 2) / 12;
      const slotIndex = Math.floor(normalizedAngle / sliceSize);
      
      let points = 15;
      if (slotIndex === 0) { points = 100; if("vibrate" in navigator) navigator.vibrate([100,50,100]); } // Green / Skull
      else if (slotIndex % 2 === 0) { points = 25; if("vibrate" in navigator) navigator.vibrate(50); } // Red
      else { points = -10; if("vibrate" in navigator) navigator.vibrate(200); } // Black (Loss)
      
      this.score += points;
      if (this.score < 0) this.score = 0;
      document.getElementById('score-display').innerText = this.score;
      
      if (this.playsLeft <= 0) {
          setTimeout(() => this.endGame(), 1500);
      }
  }

  draw(timestamp) {
    this.ctx.fillStyle = '#111';
    this.ctx.fillRect(0,0,this.width,this.height);
    
    const cx = this.width / 2;
    const cy = this.height / 2;
    const outerRadius = this.width * 0.45;
    
    // Draw Wheel
    this.ctx.save();
    this.ctx.translate(cx, cy);
    this.ctx.rotate(this.wheelAngle);
    
    const slices = 12;
    for(let i=0; i<slices; i++) {
        const startAng = (i / slices) * Math.PI * 2;
        const endAng = ((i+1) / slices) * Math.PI * 2;
        
        if (i === 0) this.ctx.fillStyle = '#39FF14'; // Green zero
        else this.ctx.fillStyle = i % 2 === 0 ? '#FF0000' : '#222';
        
        this.ctx.beginPath();
        this.ctx.moveTo(0,0);
        this.ctx.arc(0, 0, outerRadius, startAng, endAng);
        this.ctx.fill();
        this.ctx.stroke();
    }
    
    // Center Hub (Chrome)
    this.ctx.fillStyle = '#888';
    this.ctx.beginPath(); this.ctx.arc(0,0, outerRadius * 0.2, 0, Math.PI*2); this.ctx.fill();
    this.ctx.restore();
    
    // Draw Ball
    if (this.state === 'spinning' || (this.state === 'idle' && this.playsLeft < 3)) {
        const bx = cx + Math.cos(this.ball.angle) * this.ball.distance;
        const by = cy + Math.sin(this.ball.angle) * this.ball.distance;
        this.ctx.fillStyle = '#eee';
        this.ctx.shadowBlur = 10; this.ctx.shadowColor = '#fff';
        this.ctx.beginPath(); this.ctx.arc(bx, by, 8, 0, Math.PI*2); this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }
    
    if(window.GameUtils && window.GameUtils.applyGrit) {
        window.GameUtils.applyGrit(this.ctx, this.width, this.height);
    }

    if (this.state === 'idle' && this.playsLeft > 0) {
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '40px "Permanent Marker"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText("TAP TO DROP BALL", this.width/2, this.height - 40);
    }
  }

  loop(timestamp) {
    if (!this.isRunning) return;
    this.update();
    this.draw(timestamp);
    requestAnimationFrame((t) => this.loop(t));
  }
};
