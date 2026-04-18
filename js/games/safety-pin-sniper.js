window.SafetyPinSniper = class SafetyPinSniper {
  constructor(canvasId, onGameOver) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.onGameOver = onGameOver;
    
    // Set internal resolution
    this.width = this.canvas.clientWidth || 400;
    this.height = this.canvas.clientHeight || 600;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.isRunning = false;
    this.score = 0;
    this.timeLeft = 45; // Updated to 45s per plan
    this.lastTime = 0;
    
    this.bubbles = [];
    this.pin = { x: this.width/2, y: this.height - 80, radius: 10, isFlicked: false, vx: 0, vy: 0 };

    this.touchStartX = 0;
    this.touchStartY = 0;
    
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
    e.preventDefault(); // Stop scrolling
    if (!this.isRunning || this.pin.isFlicked) return;
    const pt = e.touches ? e.touches[0] : e;
    this.touchStartX = pt.clientX;
    this.touchStartY = pt.clientY;
  }

  handleTouchEnd(e) {
    e.preventDefault();
    if (!this.isRunning || this.pin.isFlicked || this.touchStartY === 0) return;
    const pt = e.changedTouches ? e.changedTouches[0] : e;
    const dy = pt.clientY - this.touchStartY;
    const dx = pt.clientX - this.touchStartX;
    
    // Swipe up detection (flick) - negative dy is UP
    if (dy < -10) {
       this.pin.isFlicked = true;
       // Limit velocity
       this.pin.vy = Math.max(dy * 0.1, -25);
       this.pin.vx = dx * 0.05;
       if ("vibrate" in navigator) navigator.vibrate(50);
    }
    this.touchStartY = 0;
  }

  start() {
    this.width = this.canvas.clientWidth || 400;
    this.height = this.canvas.clientHeight || 600;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.isRunning = true;
    this.score = 0;
    this.timeLeft = 45;
    this.bubbles = [];
    this.resetPin();
    document.getElementById('score-display').innerText = this.score;
    document.getElementById('timer-display').innerText = this.timeLeft;

    this.lastTime = performance.now();
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

  resetPin() {
    this.pin.x = this.width / 2;
    this.pin.y = this.height - 80;
    this.pin.isFlicked = false;
    this.pin.vx = 0;
    this.pin.vy = 0;
  }

  spawnBubble() {
    if (Math.random() < 0.04) {
       this.bubbles.push({
         x: Math.random() * (this.width - 40) + 20,
         y: -40,
         radius: 20 + Math.random() * 15,
         vy: (2 + Math.random() * 4) * 0.75,
         color: Math.random() > 0.5 ? '#FF00FF' : '#39FF14',
         popped: false,
         popFrames: 0
       });
    }
  }

  update(dt) {
    this.spawnBubble();
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      let b = this.bubbles[i];
      if (b.popped) {
         b.popFrames++;
         if (b.popFrames > 15) this.bubbles.splice(i, 1);
         continue;
      }
      b.y += b.vy;
      if (b.y > this.height + 50) this.bubbles.splice(i, 1);
    }

    if (this.pin.isFlicked) {
      this.pin.x += this.pin.vx;
      this.pin.y += this.pin.vy;
      for (let b of this.bubbles) {
        if (!b.popped) {
           const dx = this.pin.x - b.x;
           const dy = this.pin.y - b.y;
           const dist = Math.sqrt(dx*dx + dy*dy);
           if (dist < b.radius + this.pin.radius) {
              b.popped = true;
              this.score += 5;
              document.getElementById('score-display').innerText = this.score;
              this.resetPin();
              if ("vibrate" in navigator) navigator.vibrate([20, 30, 20]);
              break;
           }
        }
      }
      if (this.pin.y < -50 || this.pin.x < -50 || this.pin.x > this.width + 50) this.resetPin();
    }
  }

  draw(timestamp) {
    // Inject the Extravagant Grimdark Carnival Background from Utils
    window.GameUtils.drawCreepyClownBoard(this.ctx, this.width, this.height, timestamp);
    
    // Draw Bubbles (Vector hand-drawn style)
    this.ctx.lineWidth = 3;
    for (let b of this.bubbles) {
      if (b.popped) {
         this.ctx.strokeStyle = '#fff';
         this.ctx.beginPath();
         this.ctx.arc(b.x, b.y, b.radius + b.popFrames*2, 0, Math.PI*2);
         this.ctx.stroke();
      } else {
         this.ctx.strokeStyle = b.color;
         this.ctx.fillStyle = b.color === '#FF00FF' ? 'rgba(255,0,255,0.1)' : 'rgba(57,255,20,0.1)';
         
         // Jagged circle logic
         this.ctx.beginPath();
         let segments = 10;
         for (let i = 0; i <= segments; i++) {
            let angle = (i / segments) * Math.PI * 2;
            let r = b.radius + (Math.random()*4 - 2);
            let px = b.x + Math.cos(angle)*r;
            let py = b.y + Math.sin(angle)*r;
            if (i === 0) this.ctx.moveTo(px, py);
            else this.ctx.lineTo(px, py);
         }
         this.ctx.closePath();
         this.ctx.fill();
         this.ctx.stroke();
         
         // Inner X (band logo placeholder)
         this.ctx.beginPath();
         this.ctx.moveTo(b.x - 6, b.y - 6); this.ctx.lineTo(b.x + 6, b.y + 6);
         this.ctx.moveTo(b.x + 6, b.y - 6); this.ctx.lineTo(b.x - 6, b.y + 6);
         this.ctx.stroke();
      }
    }

    // Draw Pin Sprite Layer
    this.ctx.strokeStyle = '#aaaaaa';
    this.ctx.lineWidth = 4;
    this.ctx.beginPath();
    this.ctx.moveTo(this.pin.x, this.pin.y);
    this.ctx.lineTo(this.pin.x, this.pin.y + 40);
    this.ctx.stroke();
    
    this.ctx.fillStyle = '#222';
    this.ctx.strokeStyle = '#39FF14'; 
    this.ctx.beginPath();
    this.ctx.arc(this.pin.x, this.pin.y + 45, 6, 0, Math.PI*2);
    this.ctx.fill();
    this.ctx.stroke();
    
    this.ctx.fillStyle = '#eee';
    this.ctx.beginPath();
    this.ctx.moveTo(this.pin.x, this.pin.y);
    this.ctx.lineTo(this.pin.x - 3, this.pin.y + 10);
    this.ctx.lineTo(this.pin.x + 3, this.pin.y + 10);
    this.ctx.closePath();
    this.ctx.fill();
  }

  loop(timestamp) {
    if (!this.isRunning) return;
    const dt = timestamp - this.lastTime;
    this.lastTime = timestamp;
    
    this.update(dt);
    this.draw(timestamp);
    
    requestAnimationFrame((t) => this.loop(t));
  }
};
