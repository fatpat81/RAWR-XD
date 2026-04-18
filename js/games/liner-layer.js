window.LinerLayer = class LinerLayer {
  constructor(canvasId, onGameOver) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.onGameOver = onGameOver;
    
    this.width = this.canvas.clientWidth || 400;
    this.height = this.canvas.clientHeight || 600;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.isRunning = false;
    this.score = 0;
    this.timeLeft = 45;
    this.lastTime = 0;
    
    this.currentLine = [];
    this.playerTrace = [];
    this.lineTimer = 0;
    this.isTracing = false;

    this.bindEvents();
  }

  bindEvents() {
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    
    this.canvas.addEventListener('touchstart', this.handleTouchStart, {passive: false});
    this.canvas.addEventListener('touchmove', this.handleTouchMove, {passive: false});
    this.canvas.addEventListener('touchend', this.handleTouchEnd, {passive: false});
    this.canvas.addEventListener('mousedown', this.handleTouchStart);
    this.canvas.addEventListener('mousemove', this.handleTouchMove);
    this.canvas.addEventListener('mouseup', this.handleTouchEnd);
  }

  unbindEvents() {
    this.canvas.removeEventListener('touchstart', this.handleTouchStart);
    this.canvas.removeEventListener('touchmove', this.handleTouchMove);
    this.canvas.removeEventListener('touchend', this.handleTouchEnd);
    this.canvas.removeEventListener('mousedown', this.handleTouchStart);
    this.canvas.removeEventListener('mousemove', this.handleTouchMove);
    this.canvas.removeEventListener('mouseup', this.handleTouchEnd);
  }

  handleTouchStart(e) { e.preventDefault(); this.isTracing = true; this.handleTouchMove(e); }
  handleTouchEnd(e) { e.preventDefault(); this.isTracing = false; }
  
  handleTouchMove(e) {
    e.preventDefault();
    if (!this.isRunning || !this.isTracing) return;
    const pt = e.touches ? e.touches[0] : e;
    const rect = this.canvas.getBoundingClientRect();
    const x = pt.clientX - rect.left;
    const y = pt.clientY - rect.top;
    
    // Check if within bounds of any current line point
    for(let i=0; i<this.currentLine.length; i++) {
       const p = this.currentLine[i];
       if(!p.traced) {
          const dx = p.x - x;
          const dy = p.y - y;
          if(Math.sqrt(dx*dx + dy*dy) < 30) {
             p.traced = true;
             this.score += 1; // 1 point per node
             document.getElementById('score-display').innerText = this.score;
             if ("vibrate" in navigator) navigator.vibrate(10);
          }
       }
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
    document.getElementById('score-display').innerText = this.score;
    document.getElementById('timer-display').innerText = this.timeLeft;

    this.lastTime = performance.now();
    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      document.getElementById('timer-display').innerText = this.timeLeft;
      if (this.timeLeft <= 0) this.endGame();
    }, 1000);
    
    this.generateLine();
    requestAnimationFrame((t) => this.loop(t));
  }

  endGame() {
    this.isRunning = false;
    clearInterval(this.timerInterval);
    this.onGameOver(this.score);
  }

  generateLine() {
    this.currentLine = [];
    const points = 10 + Math.random()*15;
    let startX = 50 + Math.random()*(this.width-100);
    let startY = 50;
    
    for(let i=0; i<points; i++) {
       this.currentLine.push({
          x: startX + (Math.random()*80 - 40),
          y: startY + (i * (this.height/points)),
          traced: false
       });
    }
    this.lineTimer = 200; // frames until next line
  }

  update() {
    this.lineTimer--;
    if(this.lineTimer <= 0) {
       this.generateLine();
    }
  }

  draw(timestamp) {
    window.GameUtils.drawCarnivalSunburst(this.ctx, this.width, this.height, timestamp);
    
    // Draw the Line path
    if(this.currentLine.length > 0) {
       this.ctx.lineWidth = 15;
       this.ctx.lineCap = "round";
       this.ctx.lineJoin = "round";
       
       this.ctx.beginPath();
       this.ctx.moveTo(this.currentLine[0].x, this.currentLine[0].y);
       for(let i=1; i<this.currentLine.length; i++) {
          // Jitter the line slightly
          const px = this.currentLine[i].x + (Math.random()*4-2);
          const py = this.currentLine[i].y;
          this.ctx.lineTo(px, py);
       }
       
       // Neon effect
       this.ctx.strokeStyle = "rgba(57, 255, 20, 0.5)"; // Green neon
       this.ctx.shadowBlur = 20;
       this.ctx.shadowColor = "#39FF14";
       this.ctx.stroke();
       
       // Draw core
       this.ctx.lineWidth = 5;
       this.ctx.strokeStyle = "#fff";
       this.ctx.stroke();
       this.ctx.shadowBlur = 0; // reset
       
       // Draw traced indicators
       for(let p of this.currentLine) {
          if(p.traced) {
             this.ctx.fillStyle = '#FF00FF';
             this.ctx.beginPath();
             this.ctx.arc(p.x, p.y, 10 + Math.random()*5, 0, Math.PI*2);
             this.ctx.fill();
          }
       }
    }
  }

  loop(timestamp) {
    if (!this.isRunning) return;
    this.lastTime = timestamp;
    this.update();
    this.draw(timestamp);
    requestAnimationFrame((t) => this.loop(t));
  }
};
