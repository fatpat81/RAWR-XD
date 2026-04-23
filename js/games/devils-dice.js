window.DevilsDice = class DevilsDice {
  constructor(canvasId, onGameOver) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.onGameOver = onGameOver;
    
    this.width = this.canvas.clientWidth || 400;
    this.height = this.canvas.clientHeight || 600;
    this.isRunning = false;
    this.score = 0;
    this.rollsLeft = 5;
    
    this.state = 'idle'; // idle, rolling
    this.dice1 = 1;
    this.dice2 = 1;
    this.rollAnim = 0;
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
      if (this.rollsLeft <= 0) return;
      this.rollsLeft--;
      document.getElementById('timer-display').innerText = `Rolls: ${this.rollsLeft}`;
      
      this.state = 'rolling';
      this.rollAnim = 30; // frames of rolling
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
    this.rollsLeft = 5;
    this.state = 'idle';

    document.getElementById('score-display').innerText = this.score;
    document.getElementById('timer-display').innerText = `Rolls: ${this.rollsLeft}`;
    
    this.bindEvents();
    requestAnimationFrame((t) => this.loop(t));
  }

  endGame() {
    this.isRunning = false;
    this.onGameOver(this.score);
  }

  update() {
    if (this.state === 'rolling') {
        this.rollAnim--;
        this.dice1 = Math.floor(Math.random() * 6) + 1;
        this.dice2 = Math.floor(Math.random() * 6) + 1;
        
        if (this.rollAnim <= 0) {
            this.state = 'idle';
            this.calculatePrize();
        }
    }
  }

  calculatePrize() {
      const sum = this.dice1 + this.dice2;
      let points = sum;
      
      if (sum === 7 || sum === 11) {
          points = 40; // Lucky winner
          if ("vibrate" in navigator) navigator.vibrate([100, 50, 100]);
      } else if (sum === 2 || sum === 12) {
          points = -10; // Snake eyes / boxcars
          if ("vibrate" in navigator) navigator.vibrate(200);
      } else if (this.dice1 === this.dice2) {
          points = 20; // Doubles
          if ("vibrate" in navigator) navigator.vibrate([50, 50]);
      } else {
          if ("vibrate" in navigator) navigator.vibrate(20);
      }
      
      this.score += points;
      if (this.score < 0) this.score = 0;
      document.getElementById('score-display').innerText = this.score;
      
      if (this.rollsLeft <= 0) {
          setTimeout(() => this.endGame(), 1500);
      }
  }

  drawDice(x, y, val, time) {
      this.ctx.fillStyle = '#111';
      this.ctx.strokeStyle = '#FF00FF';
      this.ctx.lineWidth = 4;
      
      // Jitter for roll effect
      let jx = 0; let jy = 0;
      if (this.state === 'rolling') {
          jx = Math.random() * 10 - 5;
          jy = Math.random() * 10 - 5;
      }
      
      this.ctx.save();
      this.ctx.translate(x + jx, y + jy);
      if (this.state === 'rolling') this.ctx.rotate(Math.random() * Math.PI);
      
      this.ctx.beginPath();
      this.ctx.rect(-50, -50, 100, 100);
      this.ctx.fill();
      this.ctx.stroke();
      
      this.ctx.fillStyle = '#39FF14'; // Toxic pip color
      const drawPip = (px, py) => {
          this.ctx.beginPath(); this.ctx.arc(px, py, 8, 0, Math.PI*2); this.ctx.fill();
      };
      
      if (val === 1 || val === 3 || val === 5) drawPip(0, 0); // center
      if (val >= 2) { drawPip(-25, -25); drawPip(25, 25); }
      if (val >= 4) { drawPip(25, -25); drawPip(-25, 25); }
      if (val === 6) { drawPip(-25, 0); drawPip(25, 0); }
      
      this.ctx.restore();
  }

  draw(timestamp) {
    this.ctx.fillStyle = '#3a0d0d'; // Deep red velvet table
    this.ctx.fillRect(0,0,this.width,this.height);
    if(window.GameUtils && window.GameUtils.applyGrit) {
        window.GameUtils.applyGrit(this.ctx, this.width, this.height);
    }
    
    // Dice
    this.drawDice(this.width/2 - 60, this.height/2 - 60, this.dice1, timestamp);
    this.drawDice(this.width/2 + 60, this.height/2 + 40, this.dice2, timestamp);

    if (this.state === 'idle' && this.rollsLeft > 0) {
        this.ctx.fillStyle = '#FF00FF';
        this.ctx.font = '40px "Permanent Marker"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText("TAP TO ROLL", this.width/2, this.height - 80);
    }
  }

  loop(timestamp) {
    if (!this.isRunning) return;
    this.update();
    this.draw(timestamp);
    requestAnimationFrame((t) => this.loop(t));
  }
};
