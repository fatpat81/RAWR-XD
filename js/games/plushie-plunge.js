window.PlushiePlunge = class PlushiePlunge {
  constructor(canvasId, onGameOver) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.onGameOver = onGameOver;
    
    this.width = this.canvas.clientWidth || 400;
    this.height = this.canvas.clientHeight || 600;
    
    this.isRunning = false;
    this.score = 0;
    this.timeLeft = 45;
    
    this.claw = { x: this.width/2, y: 50, swinging: false, dropping: false, retrieving: false, movingLeft: false, movingRight: false };
    
    // Real plushies sitting at the bottom
    this.plushies = [];

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
    if (!this.isRunning || this.claw.dropping || this.claw.retrieving) return;
    
    const pt = e.touches ? e.touches[0] : e;
    const rect = this.canvas.getBoundingClientRect();
    const x = pt.clientX - rect.left;
    
    if (x < this.width * 0.35) {
       this.claw.movingLeft = true;
    } else if (x > this.width * 0.65) {
       this.claw.movingRight = true;
    } else {
       // Middle section -> Drop!
       this.claw.movingLeft = false;
       this.claw.movingRight = false;
       this.claw.dropping = true;
       if ("vibrate" in navigator) navigator.vibrate(20);
    }
  }

  handleTouchEnd(e) {
    e.preventDefault();
    this.claw.movingLeft = false;
    this.claw.movingRight = false;
  }

  start() {
    this.width = this.canvas.clientWidth || 400;
    this.height = this.canvas.clientHeight || 600;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.isRunning = true;
    this.score = 0;
    this.timeLeft = 45;
    
    this.claw = { x: this.width/2, y: 50, swinging: false, dropping: false, retrieving: false, movingLeft: false, movingRight: false };
    
    this.plushies = [];
    const goldIndices = new Set();
    while(goldIndices.size < 3) {
       goldIndices.add(Math.floor(Math.random() * 25));
    }

    for(let i=0; i<25; i++) {
       const px = 40 + (this.width/25)*i + (Math.sin(i*7)*30);
       const py = this.height - 60 + (Math.cos(i*3)*40);
       this.plushies.push({
          x: px,
          y: py,
          baseY: py,
          colorIndex: i % 4,
          typeIndex: i % 3,
          isGold: goldIndices.has(i),
          active: true,
          grabbed: false
       });
    }

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
    if(!this.claw.dropping && !this.claw.retrieving) {
       // User controlled manual movement
       let speed = 5 + (this.score * 0.01);
       if(this.claw.movingLeft) this.claw.x -= speed;
       if(this.claw.movingRight) this.claw.x += speed;
       
       if(this.claw.x < 30) this.claw.x = 30;
       if(this.claw.x > this.width - 30) this.claw.x = this.width - 30;
    } 
    else if(this.claw.dropping) {
       this.claw.y += 4; // Massively reduced drop speed
       if(this.claw.y >= this.height - 60) {
          this.claw.dropping = false;
          this.claw.retrieving = true;
          // Check collision with targets
          let hit = false;
          for(let p of this.plushies) {
             if(p.active && !p.grabbed && Math.abs(p.x - this.claw.x) < 40) {
                hit = true;
                p.grabbed = true;
                if ("vibrate" in navigator) navigator.vibrate(50);
                break;
             }
          }
          if(!hit) {
             this.score = Math.max(0, this.score - 5);
             if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);
             document.getElementById('score-display').innerText = this.score;
          }
       }
    } 
    else if(this.claw.retrieving) {
       this.claw.y -= 3; // Massively reduced retrieve speed
       
       // Move grabbed plushies with the claw
       for(let p of this.plushies) {
          if(p.grabbed) {
             p.x = this.claw.x;
             p.y = this.claw.y + 40; // hang below claw
          }
       }

       if(this.claw.y <= 50) {
          this.claw.y = 50;
          this.claw.retrieving = false;
          this.claw.swinging = true;
          
          // Deposit the plushie
          for(let p of this.plushies) {
             if(p.grabbed) {
                p.grabbed = false;
                p.active = false;
                // Score Logic (Triple value for gold!)
                const points = p.isGold ? 45 : 15;
                this.score += points;
                document.getElementById('score-display').innerText = this.score;
                
                // Respawn random toy back down later
                setTimeout(() => { p.active = true; p.y = p.baseY; }, 3000);
             }
          }
       }
    }
  }

  draw(timestamp) {
    window.GameUtils.drawClawMachine(this.ctx, this.width, this.height, timestamp);
    
    // Draw the actual plushies
    for(let p of this.plushies) {
       if(p.active) {
          window.GameUtils.drawPlushie(this.ctx, p.x, p.y, p.colorIndex, p.typeIndex, p.isGold);
       }
    }
    
    // Draw Touch Zones overlay if not animated
    if(!this.claw.dropping && !this.claw.retrieving) {
       this.ctx.fillStyle = 'rgba(255, 0, 255, 0.4)';
       this.ctx.font = 'bold 30px Arial';
       this.ctx.textAlign = 'center';
       // Arrows
       this.ctx.fillText("◀ HOLD", this.width * 0.18, this.height - 80);
       this.ctx.fillText("HOLD ▶", this.width * 0.82, this.height - 80);
       this.ctx.fillStyle = 'rgba(57, 255, 20, 0.6)';
       this.ctx.fillText("↓ TAP DROP ↓", this.width * 0.5, this.height - 30);
    }

    // Draw Claw Arm
    this.ctx.strokeStyle = '#888';
    this.ctx.lineWidth = 10;
    this.ctx.beginPath();
    this.ctx.moveTo(this.claw.x, 0);
    this.ctx.lineTo(this.claw.x, this.claw.y);
    this.ctx.stroke();
    
    // Draw Claw Grabbers
    this.ctx.strokeStyle = '#FF00FF';
    this.ctx.lineWidth = 5;
    this.ctx.beginPath();
    // left prong
    this.ctx.moveTo(this.claw.x, this.claw.y);
    this.ctx.lineTo(this.claw.x - 30, this.claw.y + 30);
    this.ctx.lineTo(this.claw.x - 10, this.claw.y + 50);
    // right prong
    this.ctx.moveTo(this.claw.x, this.claw.y);
    this.ctx.lineTo(this.claw.x + 30, this.claw.y + 30);
    this.ctx.lineTo(this.claw.x + 10, this.claw.y + 50);
    this.ctx.stroke();
  }

  loop(timestamp) {
    if (!this.isRunning) return;
    this.update();
    this.draw(timestamp);
    requestAnimationFrame((t) => this.loop(t));
  }
};
