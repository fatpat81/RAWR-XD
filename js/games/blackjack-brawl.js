window.BlackjackBrawl = class BlackjackBrawl {
  constructor(canvasId, onGameOver) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.onGameOver = onGameOver;
    
    this.width = this.canvas.clientWidth || 400;
    this.height = this.canvas.clientHeight || 600;
    this.isRunning = false;
    this.score = 0;
    this.handsLeft = 3;
    
    this.deck = [];
    this.playerHand = [];
    this.dealerHand = [];
    this.state = 'idle'; // idle, playerTurn, dealerTurn, result
    this.message = "TAP TO DEAL";
  }

  buildDeck() {
     this.deck = [];
     const suits = ['♠️', '♥️', '♣️', '♦️'];
     const values = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
     for(let s of suits) {
         for(let v of values) {
             let weight = parseInt(v);
             if (v==='J' || v==='Q' || v==='K') weight = 10;
             if (v==='A') weight = 11;
             this.deck.push({suit: s, val: v, weight: weight});
         }
     }
     // Shuffle
     for(let i=this.deck.length-1; i>0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
     }
  }

  getScore(hand) {
      let sum = 0;
      let aces = 0;
      for(let c of hand) {
          sum += c.weight;
          if(c.val === 'A') aces++;
      }
      while(sum > 21 && aces > 0) {
          sum -= 10;
          aces--;
      }
      return sum;
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
      if (this.handsLeft <= 0) return;
      this.handsLeft--;
      document.getElementById('timer-display').innerText = `Hands: ${this.handsLeft}`;
      
      this.buildDeck();
      this.playerHand = [this.deck.pop(), this.deck.pop()];
      this.dealerHand = [this.deck.pop(), this.deck.pop()];
      
      this.state = 'playerTurn';
      this.message = "HIT (LEFT) or STAND (RIGHT)";
      if ("vibrate" in navigator) navigator.vibrate(50);
      
      if(this.getScore(this.playerHand) === 21) {
          this.state = 'result';
          this.resolveHand();
      }
      return;
    }

    if (this.state === 'playerTurn') {
      const pt = e.touches ? e.touches[0] : e;
      const rect = this.canvas.getBoundingClientRect();
      let x = pt.clientX - rect.left;
      
      if (x < this.width/2) {
          // HIT
          this.playerHand.push(this.deck.pop());
          if("vibrate" in navigator) navigator.vibrate(20);
          if (this.getScore(this.playerHand) > 21) {
              this.state = 'result';
              this.resolveHand();
          }
      } else {
          // STAND
          if("vibrate" in navigator) navigator.vibrate(50);
          this.state = 'dealerTurn';
      }
    }

    if (this.state === 'result') {
        // Tap to continue
        if (this.handsLeft <= 0) {
            this.endGame();
        } else {
            this.state = 'idle';
            this.playerHand = [];
            this.dealerHand = [];
            this.message = "TAP TO DEAL";
        }
    }
  }

  resolveHand() {
      const pScore = this.getScore(this.playerHand);
      const dScore = this.getScore(this.dealerHand);
      
      let pts = 0;
      if (pScore > 21) {
          this.message = "BUST! -10 PTS";
          pts = -10;
          if("vibrate" in navigator) navigator.vibrate(200);
      } else if (dScore > 21 || pScore > dScore) {
          this.message = "YOU WIN! +30 PTS";
          if (pScore===21 && this.playerHand.length===2) { this.message="BLACKJACK! +50 PTS"; pts=50; }
          else pts = 30;
          if("vibrate" in navigator) navigator.vibrate([50,50,100]);
      } else if (pScore === dScore) {
          this.message = "DEALER PUSH. +0 PTS";
          pts = 0;
      } else {
          this.message = "DEALER WINS! -10 PTS";
          pts = -10;
          if("vibrate" in navigator) navigator.vibrate(200);
      }
      
      this.score += pts;
      if (this.score < 0) this.score = 0;
      document.getElementById('score-display').innerText = this.score;
  }

  start() {
    this.width = this.canvas.clientWidth || 400;
    this.height = this.canvas.clientHeight || 600;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.isRunning = true;
    this.score = 0;
    this.handsLeft = 3;
    this.state = 'idle';
    this.message = "TAP TO DEAL";
    this.playerHand = [];
    this.dealerHand = [];

    document.getElementById('score-display').innerText = this.score;
    document.getElementById('timer-display').innerText = `Hands: ${this.handsLeft}`;
    
    this.bindEvents();
    requestAnimationFrame((t) => this.loop(t));
  }

  endGame() {
    this.isRunning = false;
    this.onGameOver(this.score);
  }

  update() {
      if(this.state === 'dealerTurn') {
          if (this.getScore(this.dealerHand) < 17) {
              this.dealerHand.push(this.deck.pop());
          } else {
              this.state = 'result';
              this.resolveHand();
          }
      }
  }

  drawCard(c, x, y, faceDown) {
      this.ctx.fillStyle = '#fff';
      this.ctx.strokeStyle = '#222';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath(); this.ctx.rect(x, y, 60, 90); this.ctx.fill(); this.ctx.stroke();
      
      if (faceDown) {
          this.ctx.fillStyle = '#FF00FF';
          this.ctx.fillRect(x+5, y+5, 50, 80);
          this.ctx.fillStyle = '#111';
          this.ctx.font = '20px Arial';
          this.ctx.fillText("XX", x+30, y+45);
          return;
      }
      this.ctx.fillStyle = (c.suit==='♥️'||c.suit==='♦️') ? '#FF0000' : '#111';
      this.ctx.font = '20px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(c.val, x+20, y+25);
      this.ctx.font = '30px Arial';
      this.ctx.fillText(c.suit, x+30, y+60);
  }

  draw(timestamp) {
    this.ctx.fillStyle = '#0a3a1d'; // dark casino felt
    this.ctx.fillRect(0,0,this.width,this.height);
    if(window.GameUtils && window.GameUtils.applyGrit) {
        window.GameUtils.applyGrit(this.ctx, this.width, this.height);
    }
    
    if (this.playerHand.length > 0) {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '24px "Permanent Marker"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText("DEALER", this.width/2, 50);
        
        let dx = this.width/2 - (this.dealerHand.length * 35) + 5;
        for(let i=0; i<this.dealerHand.length; i++) {
           let hide = (i===0 && this.state==='playerTurn');
           this.drawCard(this.dealerHand[i], dx + (i*40), 70, hide);
        }

        this.ctx.fillStyle = '#fff';
        this.ctx.fillText(`YOU (${this.getScore(this.playerHand)})`, this.width/2, this.height - 180);
        
        let px = this.width/2 - (this.playerHand.length * 35) + 5;
        for(let i=0; i<this.playerHand.length; i++) {
           this.drawCard(this.playerHand[i], px + (i*40), this.height - 150, false);
        }
    }

    if(this.state === 'playerTurn') {
        this.ctx.fillStyle = 'rgba(255, 0, 255, 0.4)';
        this.ctx.fillRect(0, this.height/2 - 20, this.width/2, 50);
        this.ctx.fillStyle = 'rgba(57, 255, 20, 0.4)';
        this.ctx.fillRect(this.width/2, this.height/2 - 20, this.width/2, 50);
        
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px "Permanent Marker"';
        this.ctx.fillText("HIT", this.width/4, this.height/2 + 10);
        this.ctx.fillText("STAND", this.width*0.75, this.height/2 + 10);
    } else {
        this.ctx.fillStyle = '#FF00FF';
        this.ctx.font = '26px "Permanent Marker"';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(this.message, this.width/2, this.height/2 + 10);
    }
  }

  loop(timestamp) {
    if (!this.isRunning) return;
    this.update();
    this.draw(timestamp);
    requestAnimationFrame((t) => this.loop(t));
  }
};
