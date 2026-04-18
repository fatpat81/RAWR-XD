window.VinylSpin = class VinylSpin {
  constructor(canvasId, onGameOver) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.onGameOver = onGameOver;
    
    this.width = this.canvas.clientWidth || 400;
    this.height = this.canvas.clientHeight || 600;
    
    this.isRunning = false;
    this.score = 0;
    this.timeLeft = 45;
    
    this.spinAngle = 0;
    this.currentPrompt = null; // 'LEFT' or 'RIGHT'
    this.promptFrames = 0;
    
    this.touchStartX = 0;

    this.bindEvents();
  }

  bindEvents() {
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.canvas.addEventListener('touchstart', this.handleTouchStart, {passive: false});
    this.canvas.addEventListener('touchend', this.handleTouchEnd, {passive: false});
    this.canvas.addEventListener('mousedown', this.handleTouchStart);
    this.canvas.addEventListener('mouseup', this.handleTouchEnd);
  }

  unbindEvents() {
    this.canvas.removeEventListener('touchstart', this.handleTouchStart);
    this.canvas.removeEventListener('touchend', this.handleTouchEnd);
    this.canvas.removeEventListener('mousedown', this.handleTouchStart);
    this.canvas.removeEventListener('mouseup', this.handleTouchEnd);
  }

  handleTouchStart(e) {
    e.preventDefault();
    if (!this.isRunning) return;
    const pt = e.touches ? e.touches[0] : e;
    this.touchStartX = pt.clientX;
  }

  handleTouchEnd(e) {
    e.preventDefault();
    if (!this.isRunning || !this.currentPrompt) return;
    const pt = e.changedTouches ? e.changedTouches[0] : e;
    const dx = pt.clientX - this.touchStartX;
    
    if(Math.abs(dx) > 30) {
       const dir = dx > 0 ? 'RIGHT' : 'LEFT';
       if(dir === this.currentPrompt) {
          this.score += 10;
          this.currentPrompt = null; // Correct
          this.spinAngle += (dir === 'RIGHT' ? 1 : -1); 
          if ("vibrate" in navigator) navigator.vibrate(20);
       } else {
          this.score = Math.max(0, this.score - 5);
          if ("vibrate" in navigator) navigator.vibrate([50, 50, 50]);
       }
       document.getElementById('score-display').innerText = this.score;
    }
  }

  start() {
    this.width = this.canvas.clientWidth || 400;
    this.height = this.canvas.clientHeight || 600;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.isRunning = true;
    this.score = 0;
    this.timeLeft = 45;
    this.currentPrompt = 'LEFT';
    this.promptFrames = 100;

    document.getElementById('score-display').innerText = this.score;
    document.getElementById('timer-display').innerText = this.timeLeft;

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      document.getElementById('timer-display').innerText = this.timeLeft;
      if (this.timeLeft <= 0) this.endGame();
    }, 1000);
    
    requestAnimationFrame((t) => this.loop(t));
  }

  endGame() {
    this.isRunning = false;
    clearInterval(this.timerInterval);
    this.onGameOver(this.score);
  }

  update() {
    this.spinAngle += 0.015; // constant idle spin (0.02 * 0.75)
    
    if(!this.currentPrompt) {
       this.promptFrames--;
       if(this.promptFrames <= 0) {
          this.currentPrompt = Math.random() > 0.5 ? 'LEFT' : 'RIGHT';
          this.promptFrames = Math.max(30, 80 - (this.score / 2)); // Gets faster
       }
    } else {
       this.promptFrames--;
       if(this.promptFrames <= 0) {
          // Missed it
          this.score = Math.max(0, this.score - 5);
          document.getElementById('score-display').innerText = this.score;
          this.currentPrompt = null;
          this.promptFrames = 40;
          if ("vibrate" in navigator) navigator.vibrate([100]);
       }
    }
  }

  draw(timestamp) {
    window.GameUtils.drawHypnoticWheel(this.ctx, this.width, this.height, timestamp);
    
    const cx = this.width / 2;
    const cy = this.height / 2;
    const radius = Math.min(this.width, this.height) * 0.4;

    this.ctx.save();
    this.ctx.translate(cx, cy);
    this.ctx.rotate(this.spinAngle);
    
    // Draw Record Base
    this.ctx.fillStyle = '#111';
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius, 0, Math.PI*2);
    this.ctx.fill();
    this.ctx.lineWidth = 4;
    this.ctx.strokeStyle = '#333';
    this.ctx.stroke();

    // Vinyl Grooves (jagged)
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#222';
    for(let r = radius * 0.3; r < radius * 0.9; r+= 10) {
       this.ctx.beginPath();
       for(let a = 0; a < Math.PI*2; a+=0.5) {
          const jr = r + (Math.random()*4-2); // jagged groove
          this.ctx.lineTo(Math.cos(a)*jr, Math.sin(a)*jr);
       }
       this.ctx.closePath();
       this.ctx.stroke();
    }

    // Label
    this.ctx.fillStyle = '#FF00FF';
    this.ctx.beginPath();
    this.ctx.arc(0, 0, radius * 0.25, 0, Math.PI*2);
    this.ctx.fill();

    // Scratch marks
    this.ctx.strokeStyle = '#555';
    this.ctx.beginPath();
    this.ctx.moveTo(-radius*0.8, -radius*0.5);
    this.ctx.lineTo(-radius*0.2, -radius*0.1);
    this.ctx.stroke();
    this.ctx.restore();

    // Draw Prompts
    if(this.currentPrompt) {
       this.ctx.fillStyle = '#39FF14';
       this.ctx.font = 'bold 40px "Permanent Marker", sans-serif';
       this.ctx.textAlign = 'center';
       this.ctx.shadowBlur = 10;
       this.ctx.shadowColor = '#39FF14';
       
       const text = this.currentPrompt === 'LEFT' ? '<<< SWIPE LEFT' : 'SWIPE RIGHT >>>';
       // Glitch jitter
       const jitterX = Math.random() * 6 - 3;
       const jitterY = Math.random() * 6 - 3;
       
       this.ctx.fillText(text, cx + jitterX, cy + radius + 60 + jitterY);
       this.ctx.shadowBlur = 0;
       
       // Timer bar for prompt
       this.ctx.fillStyle = '#FF00FF';
       this.ctx.fillRect(cx - 100, cy + radius + 80, 200 * (this.promptFrames / 80), 10);
    }
  }

  loop(timestamp) {
    if (!this.isRunning) return;
    this.update();
    this.draw(timestamp);
    requestAnimationFrame((t) => this.loop(t));
  }
};
