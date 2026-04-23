window.NeonSlots = class NeonSlots {
  constructor(canvasId, onGameOver) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.onGameOver = onGameOver;
    
    this.width = this.canvas.clientWidth || 400;
    this.height = this.canvas.clientHeight || 600;
    this.isRunning = false;
    this.score = 0;
    this.spinsLeft = 5;
    
    this.symbols = ['🍒', '🔔', '7️⃣', '💎', '💀'];
    this.reels = [
      { yOffset: 0, speed: 0, symbolIndex: 0 },
      { yOffset: 0, speed: 0, symbolIndex: 0 },
      { yOffset: 0, speed: 0, symbolIndex: 0 }
    ];
    this.state = 'idle'; // idle, spinning, stopping
    this.stopIndex = 0;
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
      if (this.spinsLeft <= 0) {
        this.endGame();
        return;
      }
      this.spinsLeft--;
      document.getElementById('timer-display').innerText = `Spins: ${this.spinsLeft}`;
      
      this.state = 'spinning';
      this.reels.forEach(r => {
        r.speed = 30 + Math.random() * 10;
      });
      this.stopIndex = 0;
      if ("vibrate" in navigator) navigator.vibrate(50);
      
      setTimeout(() => {
          this.state = 'stopping';
      }, 1000);
    } 
    else if (this.state === 'stopping') {
      if (this.stopIndex < 3) {
        // Snap current reel to a symbol
        const r = this.reels[this.stopIndex];
        r.speed = 0;
        r.yOffset = 0;
        r.symbolIndex = Math.floor(Math.random() * this.symbols.length);
        this.stopIndex++;
        if ("vibrate" in navigator) navigator.vibrate(20);
        
        if (this.stopIndex >= 3) {
           this.checkWin();
           this.state = 'idle';
        }
      }
    }
  }

  checkWin() {
    const s1 = this.symbols[this.reels[0].symbolIndex];
    const s2 = this.symbols[this.reels[1].symbolIndex];
    const s3 = this.symbols[this.reels[2].symbolIndex];
    
    let payout = 0;
    if (s1 === s2 && s2 === s3) {
        payout = 50; // Jackpot
        if(s1 === '7️⃣') payout = 100;
        if(s1 === '💀') payout = -20; // Unlucky
    } else if (s1 === s2 || s2 === s3 || s1 === s3) {
        payout = 10; // Pair
    }
    
    this.score += payout;
    if(this.score < 0) this.score = 0;
    document.getElementById('score-display').innerText = this.score;
    
    if (payout > 0) {
      if ("vibrate" in navigator) navigator.vibrate([50, 50, 100]);
    } else {
      if ("vibrate" in navigator) navigator.vibrate(100);
    }

    if (this.spinsLeft <= 0) {
      setTimeout(() => this.endGame(), 1000);
    }
  }

  start() {
    this.width = this.canvas.clientWidth || 400;
    this.height = this.canvas.clientHeight || 600;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.isRunning = true;
    this.score = 0;
    this.spinsLeft = 5;
    this.state = 'idle';

    this.reels.forEach(r => {
        r.speed = 0; r.yOffset = 0; r.symbolIndex = Math.floor(Math.random() * this.symbols.length);
    });

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
    if (this.state === 'spinning' || this.state === 'stopping') {
      this.reels.forEach((r, i) => {
         if (r.speed > 0) {
            r.yOffset += r.speed;
            if (r.yOffset > 100) {
               r.yOffset = 0;
               r.symbolIndex = Math.floor(Math.random() * this.symbols.length);
            }
         }
      });
    }
  }

  draw(timestamp) {
    if (window.GameUtils && window.GameUtils.drawSlotMachine) {
        window.GameUtils.drawSlotMachine(this.ctx, this.width, this.height, timestamp);
    } else {
        this.ctx.fillStyle = '#111'; this.ctx.fillRect(0,0,this.width,this.height);
    }

    const reelWidth = (this.width - 80) / 3;
    const startX = 40;
    const centerY = this.height / 2;

    this.ctx.font = '60px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    for(let i=0; i<3; i++) {
        let r = this.reels[i];
        let rx = startX + (i * reelWidth) + (reelWidth/2);
        
        let sym = this.symbols[r.symbolIndex];
        
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.rect(startX + i*reelWidth, centerY - 100, reelWidth, 200);
        this.ctx.clip();
        
        if (r.speed > 0) {
           this.ctx.fillStyle = 'rgba(255,255,255,0.2)';
           this.ctx.fillText(sym, rx, centerY + r.yOffset - 100);
           this.ctx.fillStyle = '#fff';
           this.ctx.fillText(sym, rx, centerY + r.yOffset);
           this.ctx.fillStyle = 'rgba(255,255,255,0.2)';
           this.ctx.fillText(sym, rx, centerY + r.yOffset + 100);
        } else {
           this.ctx.fillStyle = '#fff';
           this.ctx.fillText(sym, rx, centerY);
        }
        this.ctx.restore();
    }
    
    if (this.state === 'idle' && this.spinsLeft > 0) {
        this.ctx.fillStyle = 'rgba(57, 255, 20, 0.8)';
        this.ctx.font = '30px "Permanent Marker"';
        this.ctx.fillText("TAP TO SPIN", this.width/2, this.height - 80);
    } else if (this.state === 'stopping') {
        this.ctx.fillStyle = 'rgba(255, 0, 255, 0.8)';
        this.ctx.font = '30px "Permanent Marker"';
        this.ctx.fillText("TAP TO STOP", this.width/2, this.height - 80);
    }
  }

  loop(timestamp) {
    if (!this.isRunning) return;
    this.update();
    this.draw(timestamp);
    requestAnimationFrame((t) => this.loop(t));
  }
};
