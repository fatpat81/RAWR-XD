window.SkullShuffle = class SkullShuffle {
  constructor(canvasId, onGameOver) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.onGameOver = onGameOver;
    
    this.width = this.canvas.clientWidth || 400;
    this.height = this.canvas.clientHeight || 600;
    
    this.isRunning = false;
    this.score = 0;
    this.timeLeft = 45;
    
    this.resetRound();
    this.bindEvents();
  }

  resetRound() {
    this.gameState = 'idle'; // idle, revealing_start, shuffling, guessing, revealing_end
    this.timer = 0;
    this.shuffleCount = 0;
    this.maxShuffles = 8 + Math.floor(Math.random() * 6);
    this.swapProgress = 0;
    this.swapPair = [];
    this.cupLiftY = 80;
    
    const positions = [this.width*0.2, this.width*0.5, this.width*0.8];
    this.cups = [
        {id: 0, x: positions[0], startX: positions[0], targetX: positions[0], y: this.height*0.6, hasBall: false},
        {id: 1, x: positions[1], startX: positions[1], targetX: positions[1], y: this.height*0.6, hasBall: true},
        {id: 2, x: positions[2], startX: positions[2], targetX: positions[2], y: this.height*0.6, hasBall: false}
    ];
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
    
    if (this.gameState === 'idle') {
       this.gameState = 'revealing_start';
       this.timer = 0;
       if ("vibrate" in navigator) navigator.vibrate(20);
       return;
    }
    
    if (this.gameState === 'guessing') {
       const pt = e.touches ? e.touches[0] : e;
       const rect = this.canvas.getBoundingClientRect();
       const x = pt.clientX - rect.left;
       const y = pt.clientY - rect.top;
       
       let selected = null;
       for(let c of this.cups) {
          if(Math.abs(x - c.x) < 50 && Math.abs(y - c.y) < 60) {
             selected = c; break;
          }
       }
       if(selected) {
          this.gameState = 'revealing_end';
          this.timer = 0;
          this.guessedCup = selected;
          if(selected.hasBall) {
             this.score += 25;
             if ("vibrate" in navigator) navigator.vibrate([50, 50, 50]);
          } else {
             this.score = Math.max(0, this.score - 10);
             if ("vibrate" in navigator) navigator.vibrate(100);
          }
          document.getElementById('score-display').innerText = this.score;
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
    this.resetRound();

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

  startSwap() {
    let p1 = Math.floor(Math.random() * 3);
    let p2 = Math.floor(Math.random() * 3);
    while(p1 === p2) p2 = Math.floor(Math.random() * 3);
    
    this.swapPair = [this.cups[p1], this.cups[p2]];
    this.swapPair[0].startX = this.swapPair[0].x;
    this.swapPair[0].targetX = this.swapPair[1].x;
    this.swapPair[1].startX = this.swapPair[1].x;
    this.swapPair[1].targetX = this.swapPair[0].startX;
    
    this.swapProgress = 0;
    this.shuffleCount++;
  }

  update() {
    // Slower pacing applied here
    if (this.gameState === 'revealing_start') {
       this.timer++;
       if(this.cupLiftY > 0) this.cupLiftY -= 2;
       if(this.timer > 60) {
           this.gameState = 'shuffling';
           this.cupLiftY = 0;
       }
    } 
    else if (this.gameState === 'shuffling') {
       if(this.swapPair.length === 0) {
           this.startSwap();
       } else {
           this.swapProgress += 0.05; // -25% deliberate speed
           const ease = this.swapProgress < 0.5 ? 2 * this.swapProgress * this.swapProgress : -1 + (4 - 2 * this.swapProgress) * this.swapProgress;
           
           this.swapPair[0].x = this.swapPair[0].startX + (this.swapPair[0].targetX - this.swapPair[0].startX) * ease;
           this.swapPair[1].x = this.swapPair[1].startX + (this.swapPair[1].targetX - this.swapPair[1].startX) * ease;
           
           // arc the cups
           const arc = Math.sin(Math.PI * ease) * 40;
           this.swapPair[0].arcY = -arc;
           this.swapPair[1].arcY = arc;

           if(this.swapProgress >= 1) {
               this.swapPair[0].x = this.swapPair[0].targetX;
               this.swapPair[1].x = this.swapPair[1].targetX;
               this.swapPair[0].arcY = 0; this.swapPair[1].arcY = 0;
               this.swapPair = [];
               
               if(this.shuffleCount >= this.maxShuffles) {
                   this.gameState = 'guessing';
               }
           }
       }
    }
    else if (this.gameState === 'revealing_end') {
       this.timer++;
       if(this.cupLiftY < 80) this.cupLiftY += 2;
       if(this.timer > 100) {
           this.resetRound();
       }
    }
  }

  drawCup(c, yOffset) {
     this.ctx.fillStyle = '#b8860b'; // tarnished brass
     this.ctx.beginPath();
     this.ctx.moveTo(c.x - 30, c.y + yOffset);
     this.ctx.lineTo(c.x - 20, c.y - 50 + yOffset);
     this.ctx.lineTo(c.x + 20, c.y - 50 + yOffset);
     this.ctx.lineTo(c.x + 30, c.y + yOffset);
     this.ctx.fill();
     // Shading
     const grd = this.ctx.createLinearGradient(c.x-30, 0, c.x+30, 0);
     grd.addColorStop(0, 'rgba(0,0,0,0.5)');
     grd.addColorStop(0.5, 'rgba(255,255,255,0.4)');
     grd.addColorStop(1, 'rgba(0,0,0,0.8)');
     this.ctx.fillStyle = grd;
     this.ctx.fill();
     
     // Lip
     this.ctx.fillStyle = '#6b4d04';
     this.ctx.beginPath(); this.ctx.ellipse(c.x, c.y + yOffset, 30, 10, 0, 0, Math.PI*2); this.ctx.fill();
  }

  draw(timestamp) {
    window.GameUtils.drawMysticTable(this.ctx, this.width, this.height, timestamp);
    
    // Draw Ball
    const ballCup = this.cups.find(c => c.hasBall);
    if(ballCup && (this.gameState === 'idle' || this.gameState === 'revealing_start' || this.gameState === 'revealing_end')) {
       this.ctx.fillStyle = '#39FF14'; // Toxic green eye
       this.ctx.shadowBlur = 15; this.ctx.shadowColor = '#39FF14';
       this.ctx.beginPath(); this.ctx.arc(ballCup.x, ballCup.y - 15, 15, 0, Math.PI*2); this.ctx.fill();
       this.ctx.shadowBlur = 0;
       this.ctx.fillStyle = '#111';
       this.ctx.beginPath(); this.ctx.arc(ballCup.x, ballCup.y - 15, 5, 0, Math.PI*2); this.ctx.fill(); // Pupil
    }

    // Draw Cups
    // Sort by Y so they overlap nicely during arc shifts
    let sortedCups = [...this.cups].sort((a,b) => (a.y + (a.arcY||0)) - (b.y + (b.arcY||0)));
    for(let c of sortedCups) {
       let yOff = c.arcY || 0;
       if(this.gameState === 'revealing_start' || this.gameState === 'revealing_end' || this.gameState === 'idle') {
           yOff -= this.cupLiftY;
       }
       this.drawCup(c, yOff);
    }

    // UI Overlays
    if(this.gameState === 'idle') {
       this.ctx.fillStyle = 'rgba(255, 0, 255, 0.6)';
       this.ctx.font = '30px Arial'; this.ctx.textAlign = 'center';
       this.ctx.fillText("TAP TO START SHUFFLE", this.width/2, this.height*0.8);
    }
    else if (this.gameState === 'guessing') {
       this.ctx.fillStyle = 'rgba(57, 255, 20, 0.8)';
       this.ctx.font = 'bold 30px Arial'; this.ctx.textAlign = 'center';
       this.ctx.fillText("FIND THE EYE", this.width/2, this.height*0.8);
    }
  }

  loop(timestamp) {
    if (!this.isRunning) return;
    this.update();
    this.draw(timestamp);
    requestAnimationFrame((t) => this.loop(t));
  }
};
