window.ChainLinker = class ChainLinker {
  constructor(canvasId, onGameOver) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.onGameOver = onGameOver;
    
    this.width = this.canvas.clientWidth || 400;
    this.height = this.canvas.clientHeight || 600;
    
    this.isRunning = false;
    this.score = 0;
    this.timeLeft = 45;
    
    this.rings = [];
    this.linkZoneY = this.height - 150;
    
    this.bindEvents();
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
    const pt = e.touches ? e.touches[0] : e;
    const rect = this.canvas.getBoundingClientRect();
    const x = pt.clientX - rect.left;
    const y = pt.clientY - rect.top;

    // Check if any ring is intersecting the zone AND the touch bounds
    let hit = false;
    for(let i = this.rings.length-1; i >= 0; i--) {
       let r = this.rings[i];
       
       const inZone = Math.abs(r.y - this.linkZoneY) < 50;
       const touchedRingX = Math.abs(x - r.x) < 50;
       const touchedRingY = Math.abs(y - r.y) < 50;

       if(inZone && touchedRingX && touchedRingY) {
          hit = true;
          this.score += 5;
          document.getElementById('score-display').innerText = this.score;
          r.linked = true;
          if ("vibrate" in navigator) navigator.vibrate(30);
          break; // only link one at a time
       }
    }
    
    if(!hit) {
      this.score = Math.max(0, this.score - 2);
      document.getElementById('score-display').innerText = this.score;
      if ("vibrate" in navigator) navigator.vibrate([20, 20, 20]);
    }
  }

  start() {
    this.width = this.canvas.clientWidth || 400;
    this.height = this.canvas.clientHeight || 600;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.linkZoneY = this.height - 150;

    this.isRunning = true;
    this.score = 0;
    this.timeLeft = 45;
    this.rings = [];

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

  spawnRing() {
    if(Math.random() < 0.05 + (this.score*0.001)) {
       this.rings.push({
         x: 80 + Math.random() * (this.width - 160),
         y: -50,
         speed: (((5 + (Math.random()*4) + (this.score*0.05)) * 0.75) * 0.75) * 0.7, // Triply reduced speed (down another 30%)
         linked: false
       });
    }
  }

  update() {
    this.spawnRing();
    for (let i = this.rings.length - 1; i >= 0; i--) {
      let r = this.rings[i];
      if(r.linked) {
         r.y += 20; // shoot off quickly when linked
      } else {
         r.y += r.speed;
      }
      
      if (r.y > this.height + 100) {
          this.rings.splice(i, 1);
      }
    }
  }

  draw(timestamp) {
    window.GameUtils.drawRingTossBooth(this.ctx, this.width, this.height, timestamp);
    
    // Draw Link Zone (Neon Pink Line)
    this.ctx.strokeStyle = '#FF00FF';
    this.ctx.lineWidth = 10;
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = '#FF00FF';
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.linkZoneY);
    this.ctx.lineTo(this.width, this.linkZoneY);
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;

    // Draw Rings
    this.ctx.lineWidth = 8;
    for(let r of this.rings) {
       this.ctx.strokeStyle = r.linked ? '#39FF14' : '#aaaaaa';
       this.ctx.beginPath();
       // "Hand drawn" ring
       this.ctx.ellipse(r.x, r.y, 40, 20, 0, 0, Math.PI*2);
       this.ctx.stroke();
       
       // Inner chain detail
       this.ctx.beginPath();
       this.ctx.ellipse(r.x, r.y, 30, 10, 0, 0, Math.PI*2);
       this.ctx.stroke();
    }
  }

  loop(timestamp) {
    if (!this.isRunning) return;
    this.update();
    this.draw(timestamp);
    requestAnimationFrame((t) => this.loop(t));
  }
};
