window.PegPunk = class PegPunk {
  constructor(canvasId, onGameOver) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.onGameOver = onGameOver;
    
    this.width = this.canvas.clientWidth || 400;
    this.height = this.canvas.clientHeight || 600;
    
    this.isRunning = false;
    this.score = 0;
    this.timeLeft = 45;
    
    this.pegs = [];
    for(let y=150; y<this.height-150; y+=80) {
        let offset = (y % 160 === 0) ? 0 : 40;
        for(let x=40+offset; x<this.width-30; x+=80) {
            this.pegs.push({x: x, y: y, r: 8});
        }
    }

    this.slots = [
        {x: 0, w: this.width*0.2, val: -5, col: '#FF0000'},
        {x: this.width*0.2, w: this.width*0.2, val: 10, col: '#39FF14'},
        {x: this.width*0.4, w: this.width*0.2, val: 30, col: '#FFD700'},
        {x: this.width*0.6, w: this.width*0.2, val: 10, col: '#39FF14'},
        {x: this.width*0.8, w: this.width*0.2, val: -5, col: '#FF0000'},
    ];
    
    this.skulls = [];
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
    
    if(this.skulls.length >= 3) return; // limit active drops

    const pt = e.touches ? e.touches[0] : e;
    const rect = this.canvas.getBoundingClientRect();
    let x = pt.clientX - rect.left;
    
    // Clamp to valid drop zone
    if(x < 20) x = 20;
    if(x > this.width-20) x = this.width-20;

    this.skulls.push({
       x: x,
       y: 50,
       vx: (Math.random() - 0.5) * 2,
       vy: 0,
       r: 12
    });
    if ("vibrate" in navigator) navigator.vibrate(20);
  }

  start() {
    this.width = this.canvas.clientWidth || 400;
    this.height = this.canvas.clientHeight || 600;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.isRunning = true;
    this.score = 0;
    this.timeLeft = 45;
    this.skulls = [];

    // Recalculate layout
    this.pegs = [];
    for(let y=150; y<this.height-150; y+=80) {
        let offset = (y % 160 === 0) ? 0 : 40;
        for(let x=40+offset; x<this.width-30; x+=80) {
            this.pegs.push({x: x, y: y, r: 8});
        }
    }
    this.slots = [
        {x: 0, w: this.width*0.2, val: -5, col: '#FF0000', txtX: this.width*0.1},
        {x: this.width*0.2, w: this.width*0.2, val: 10, col: '#39FF14', txtX: this.width*0.3},
        {x: this.width*0.4, w: this.width*0.2, val: 30, col: '#FFD700', txtX: this.width*0.5},
        {x: this.width*0.6, w: this.width*0.2, val: 10, col: '#39FF14', txtX: this.width*0.7},
        {x: this.width*0.8, w: this.width*0.2, val: -5, col: '#FF0000', txtX: this.width*0.9},
    ];

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
    // Slower physics to feel deliberate
    const gravity = 0.2;
    const bounceX = 0.6;
    const bounceY = 0.5;

    for (let i = this.skulls.length - 1; i >= 0; i--) {
        let s = this.skulls[i];
        
        s.vy += gravity;
        s.x += s.vx;
        s.y += s.vy;

        // Walls
        if(s.x < s.r + 20) { s.x = s.r + 20; s.vx *= -bounceX; }
        if(s.x > this.width - s.r - 20) { s.x = this.width - s.r - 20; s.vx *= -bounceX; }

        // Peg collision
        for(let p of this.pegs) {
            let dx = s.x - p.x;
            let dy = s.y - p.y;
            let dist = Math.sqrt(dx*dx + dy*dy);
            if(dist < s.r + p.r) {
               // Resolve overlap
               const overlap = (s.r + p.r) - dist;
               s.x += (dx/dist) * overlap;
               s.y += (dy/dist) * overlap;
               // Bounce
               s.vx = (dx/dist) * (Math.abs(s.vx) + 1.5) * bounceX;
               s.vy = (dy/dist) * (Math.abs(s.vy) + 1) * bounceY;
               if ("vibrate" in navigator) navigator.vibrate(10);
            }
        }

        // Slot scoring
        if(s.y > this.height - 40) {
            for(let slot of this.slots) {
                if(s.x > slot.x && s.x < slot.x + slot.w) {
                    this.score += slot.val;
                    if(slot.val > 0) {
                        if ("vibrate" in navigator) navigator.vibrate([30, 30, 30]);
                    } else {
                        if ("vibrate" in navigator) navigator.vibrate(100);
                    }
                    document.getElementById('score-display').innerText = this.score;
                    break;
                }
            }
            this.skulls.splice(i, 1);
        }
    }
  }

  draw(timestamp) {
    window.GameUtils.drawPlinkoBoard(this.ctx, this.width, this.height, timestamp);
    
    // Draw slots at bottom
    for(let s of this.slots) {
       this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
       this.ctx.strokeStyle = s.col;
       this.ctx.lineWidth = 4;
       this.ctx.beginPath(); this.ctx.rect(s.x, this.height-60, s.w, 60); this.ctx.fill(); this.ctx.stroke();
       
       this.ctx.fillStyle = s.col;
       this.ctx.font = '20px Arial'; this.ctx.textAlign = 'center';
       this.ctx.fillText((s.val > 0 ? '+':'') + s.val, s.txtX, this.height - 25);
    }

    // Draw skulls
    for(let s of this.skulls) {
       this.ctx.fillStyle = '#eee';
       this.ctx.beginPath(); this.ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); this.ctx.fill();
       // Eyes
       this.ctx.fillStyle = '#000';
       this.ctx.beginPath(); this.ctx.arc(s.x-4, s.y-2, 3, 0, Math.PI*2); this.ctx.fill();
       this.ctx.beginPath(); this.ctx.arc(s.x+4, s.y-2, 3, 0, Math.PI*2); this.ctx.fill();
       // Neon trail effect
       this.ctx.shadowBlur = 10; this.ctx.shadowColor = '#FF00FF';
       this.ctx.strokeStyle = '#FF00FF';
       this.ctx.lineWidth = 2;
       this.ctx.beginPath(); this.ctx.arc(s.x, s.y, s.r+2, 0, Math.PI*2); this.ctx.stroke();
       this.ctx.shadowBlur = 0;
    }

    if(this.skulls.length === 0) {
       this.ctx.fillStyle = 'rgba(255, 0, 255, 0.6)';
       this.ctx.font = '30px Arial'; this.ctx.textAlign = 'center';
       this.ctx.fillText("TAP TOP TO DROP", this.width/2, 80);
    }
  }

  loop(timestamp) {
    if (!this.isRunning) return;
    this.update();
    this.draw(timestamp);
    requestAnimationFrame((t) => this.loop(t));
  }
};
