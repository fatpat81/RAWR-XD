window.VansVault = class VansVault {
  constructor(canvasId, onGameOver) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.onGameOver = onGameOver;
    
    this.width = this.canvas.clientWidth || 400;
    this.height = this.canvas.clientHeight || 600;
    
    this.isRunning = false;
    this.score = 0;
    this.timeLeft = 45;
    
    this.symbols = ['🧷', '💀', '💔', '⭐', '🛹', '🎤'];
    const padding = (this.width - 80) / 3;
    this.reels = [
        { x: 40 + padding/2, yOffset: 0, speed: 0, stopped: true, icon: 0 },
        { x: 40 + padding*1.5, yOffset: 0, speed: 0, stopped: true, icon: 1 },
        { x: 40 + padding*2.5, yOffset: 0, speed: 0, stopped: true, icon: 2 }
    ];
    this.state = 'idle'; // idle, spinning, resolving
    this.message = "TAP TO SPIN";

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
    
    if (this.state === 'idle') {
       this.startSpin();
    } else if (this.state === 'spinning') {
       // Stop the next available reel
       for(let r of this.reels) {
          if(!r.stopped) {
             r.stopped = true;
             // Snap to nearest icon index
             let index = Math.round(r.yOffset / 100);
             r.yOffset = index * 100;
             r.icon = (Math.abs(index) % this.symbols.length);
             if ("vibrate" in navigator) navigator.vibrate(20);
             
             // Check if all stopped
             if(this.reels.every(reel => reel.stopped)) {
                 this.resolveSpin();
             }
             break;
          }
       }
    }
  }

  startSpin() {
     this.state = 'spinning';
     this.message = "TAP TO STOP";
     for(let i=0; i<3; i++) {
         this.reels[i].stopped = false;
         // Slow enough to see the blur, but fast enough to be somewhat chance based
         this.reels[i].speed = 15 + (Math.random() * 5) + (i*2); 
     }
  }

  resolveSpin() {
     this.state = 'resolving';
     const counts = {};
     for(let r of this.reels) {
         counts[r.icon] = (counts[r.icon] || 0) + 1;
     }
     
     const maxMatch = Math.max(...Object.values(counts));
     if(maxMatch === 3) {
         this.score += 50;
         this.message = "JACKPOT! +50";
         if ("vibrate" in navigator) navigator.vibrate([100, 50, 100, 50, 200]);
     } else if(maxMatch === 2) {
         this.score += 15;
         this.message = "MATCH 2! +15";
         if ("vibrate" in navigator) navigator.vibrate([50, 50, 50]);
     } else {
         this.score = Math.max(0, this.score - 5);
         this.message = "NO LUCK. -5";
         if ("vibrate" in navigator) navigator.vibrate(100);
     }
     document.getElementById('score-display').innerText = this.score;

     setTimeout(() => {
         if (this.isRunning) {
             this.state = 'idle';
             this.message = "TAP TO SPIN";
         }
     }, 1500);
  }

  start() {
    this.width = this.canvas.clientWidth || 400;
    this.height = this.canvas.clientHeight || 600;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.isRunning = true;
    this.score = 0;
    this.timeLeft = 45;
    
    const padding = (this.width - 80) / 3;
    this.reels[0].x = 40 + padding/2;
    this.reels[1].x = 40 + padding*1.5;
    this.reels[2].x = 40 + padding*2.5;

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
    if(this.state === 'spinning') {
        for(let r of this.reels) {
            if(!r.stopped) {
                r.yOffset += r.speed;
            }
        }
    }
  }

  draw(timestamp) {
    window.GameUtils.drawSlotMachine(this.ctx, this.width, this.height, timestamp);
    
    const midY = this.height / 2;
    // Draw Reels Content
    // We clip to the reel housing area
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.rect(40, this.height/3 - 20, this.width-80, this.height/3 + 40);
    this.ctx.clip();

    this.ctx.font = '60px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    for(let i=0; i<3; i++) {
        let r = this.reels[i];
        // Draw the current symbol, and the ones above and below it conceptually wrapping
        let baseIndex = Math.round(r.yOffset / 100);
        let pixelOffset = r.yOffset % 100;

        for(let y = -2; y <= 2; y++) {
            let symbolIndex = Math.abs((baseIndex + y) % this.symbols.length);
            let drawY = midY + (y * 100) + pixelOffset;
            
            // Motion blur if spinning fast
            if(!r.stopped && r.speed > 10) {
               this.ctx.fillStyle = 'rgba(255,255,255,0.4)';
               this.ctx.fillText(this.symbols[symbolIndex], r.x, drawY - r.speed);
               this.ctx.fillText(this.symbols[symbolIndex], r.x, drawY + r.speed);
               this.ctx.fillStyle = 'white';
            } else {
               this.ctx.fillStyle = (this.state === 'resolving' && r.stopped) ? '#39FF14' : 'white';
            }
            this.ctx.fillText(this.symbols[symbolIndex], r.x, drawY);
        }
    }
    this.ctx.restore();

    // The glowing win-line
    this.ctx.strokeStyle = '#FF00FF';
    this.ctx.lineWidth = 4;
    this.ctx.shadowBlur = 15;
    this.ctx.shadowColor = '#FF00FF';
    this.ctx.beginPath(); this.ctx.moveTo(35, midY); this.ctx.lineTo(this.width-35, midY); this.ctx.stroke();
    this.ctx.shadowBlur = 0;

    // Draw the UI Message overlay
    if(this.message) {
        this.ctx.fillStyle = (this.state === 'resolving' && this.score > 0) ? '#39FF14' : '#FF00FF';
        this.ctx.font = 'bold 30px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.message, this.width/2, this.height - 80);
    }
  }

  loop(timestamp) {
    if (!this.isRunning) return;
    this.update();
    this.draw(timestamp);
    requestAnimationFrame((t) => this.loop(t));
  }
};
