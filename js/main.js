const Economy = window.Economy;

let currentGame = null;

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

function updateUI() {
   if(!Economy.username) return;
   Economy.loadState();
   
   const title = document.getElementById('menu-username');
   title.innerText = Economy.username;
   title.setAttribute('data-text', Economy.username); // Update glitch attribute to stop flicker
   
   // Top bars
   document.getElementById('ticket-count').innerText = Economy.tickets;
   document.getElementById('player-level').innerText = Economy.level;
   document.getElementById('prize-ticket-count').innerText = Economy.tickets;
   
   // Profile Data
   document.getElementById('prof-ticket-count').innerText = Economy.tickets;
   document.getElementById('prof-lifetime-count').innerText = Economy.lifetimeTickets;
   
   const nextLvlReq = Economy.level * 100;
   if(Economy.level < 5) {
     document.getElementById('prof-next-lvl').innerText = nextLvlReq;
   } else {
     document.getElementById('prof-next-lvl').innerText = 'MAX';
   }
}

function initPrizeWall() {
   const list = document.getElementById('prize-list');
   list.innerHTML = '';
   Economy.prizes.forEach(p => {
      // Game Score Gated Display for extravagant items
      if(p.reqGame) {
         if (!Economy.gameScores || !Economy.gameScores[p.reqGame] || Economy.gameScores[p.reqGame] < p.reqScore) {
             return; // Hide until player beats the game
         }
      } else {
         // Hide regular items strictly above the player's level (Level Gated Display)
         if(p.lvl > Economy.level) return;
      }

      const div = document.createElement('div');
      const isUnlocked = Economy.unlockedPrizes.includes(p.id);
      
      div.className = `prize-item ${isUnlocked ? 'unlocked' : 'locked'}`;
      div.innerHTML = `
        <span class="prize-icon">${p.icon}</span>
        <h4>${p.name}</h4>
        <p>${isUnlocked ? 'OWNED' : p.cost + ' TIX'}</p>
      `;
      
      if (!isUnlocked) {
         div.onclick = () => {
            if (Economy.unlockPrize(p.id)) {
               updateUI();
               initPrizeWall();
            } else {
               if ("vibrate" in navigator) navigator.vibrate(100);
               div.style.borderColor = 'red';
               setTimeout(() => { div.style.borderColor = '#555'; }, 200);
            }
         };
         div.style.cursor = 'pointer';
      }
      list.appendChild(div);
   });
}

function initFlexRoom() {
   const list = document.getElementById('my-prizes-list');
   list.innerHTML = '';
   let count = 0;
   Economy.prizes.forEach(p => {
      if(Economy.unlockedPrizes.includes(p.id)) {
         count++;
         const div = document.createElement('div');
         div.className = `prize-item unlocked`;
         div.style.borderColor = 'var(--pink)';
         div.innerHTML = `
           <span class="prize-icon">${p.icon}</span>
           <h4>${p.name}</h4>
         `;
         list.appendChild(div);
      }
   });
   
   if(count === 0) {
      list.innerHTML = '<p class="handwritten" style="grid-column: span 2; font-size: 1.5rem; color:#888;">It looks so empty right now... Buy something.</p>';
   }
}

let pathGenerated = false;

function buildCandylandPath() {
   if (pathGenerated) return;
   const container = document.querySelector('.board-path-container');
   if(!container) return;

   const numSteps = 120;
   const trackHeight = 2000; // Must match CSS
   const stepClasses = ['step-pink', 'step-lime', 'step-cyan', 'step-check'];
   
   const GAME_ORDER = [
     'safety-pin-sniper', 'liner-layer', 'plushie-plunge', 'chain-linker',
     'vinyl-spin', 'skull-shuffle', 'peg-punk', 'vans-vault',
     'neon-slots', 'hypnotic-wheel', 'devils-dice', 'razor-roulette', 'blackjack-brawl'
   ];
   const gameIndices = [5, 12, 22, 32, 42, 52, 60, 68, 78, 88, 98, 108, 116];

   // Generate the geometric path
   for(let i=0; i<numSteps; i++) {
       // Proceed from bottom (trackHeight) to top (0)
       const y = trackHeight - (i * (trackHeight / numSteps)) - 80; 
       
       // Sine wave for X traversal
       const progress = i / numSteps; // 0.0 to 1.0
       // Weave back and forth across 50% midpoint 
       const xPercent = 50 + Math.sin(progress * Math.PI * 4.5) * 35;
       
       const stepDiv = document.createElement('div');
       stepDiv.className = `candyland-step ${stepClasses[i % stepClasses.length]}`;
       stepDiv.style.top = `${y}px`;
       stepDiv.style.left = `${xPercent}%`;
       stepDiv.style.transform = `translate(-50%, -50%) rotate(${Math.random()*20 - 10}deg)`;
       stepDiv.dataset.index = i;

       container.appendChild(stepDiv);
       
       // Pin Game Nodes to specific steps
       const gIdx = gameIndices.indexOf(i);
       if(gIdx !== -1) {
           const gameId = GAME_ORDER[gIdx];
           const btn = document.querySelector(`.play-btn[data-game="${gameId}"]`);
           if(btn) {
               const node = btn.parentElement;
               node.style.top = `${y}px`;
               node.style.left = `${xPercent}%`;
           }
       }
   }
   pathGenerated = true;
}

document.addEventListener('DOMContentLoaded', () => {
   // Login Handler
   document.getElementById('btn-login').onclick = () => {
      const uname = document.getElementById('username-input').value;
      if(Economy.login(uname)) {
         updateUI();
         showScreen('menu-screen');
      } else {
         const input = document.getElementById('username-input');
         input.style.borderColor = 'red';
         setTimeout(() => { input.style.borderColor = 'var(--pink)'; }, 300);
      }
   };

   // Menu Navigation
   document.getElementById('btn-play').onclick = () => {
      buildCandylandPath();
      
      const GAME_ORDER = [
        'safety-pin-sniper', 'liner-layer', 'plushie-plunge', 'chain-linker',
        'vinyl-spin', 'skull-shuffle', 'peg-punk', 'vans-vault',
        'neon-slots', 'hypnotic-wheel', 'devils-dice', 'razor-roulette', 'blackjack-brawl'
      ];
      
      let isUnlocked = true; // Game 1 is always unlocked
      let highestUnlockedGame = 0;
      
      GAME_ORDER.forEach((id, index) => {
         const btn = document.querySelector(`.play-btn[data-game="${id}"]`);
         if(btn) {
            const node = btn.parentElement;
            if(isUnlocked) {
               node.classList.remove('locked-node');
               btn.disabled = false;
               highestUnlockedGame = index;
               
               // All games unlocked by default
               // if(!Economy.gameScores || !Economy.gameScores[id] || Economy.gameScores[id] < 100) {
               //    isUnlocked = false; 
               // }
            } else {
               node.classList.add('locked-node');
               btn.disabled = true;
            }
         }
      });
      
      // Update path step grey-out locking
      const gameIndices = [5, 12, 22, 32, 42, 52, 60, 68, 78, 88, 98, 108, 116];
      const maxUnlockStep = 999; 
      
      document.querySelectorAll('.candyland-step').forEach(step => {
         const idx = parseInt(step.dataset.index);
         if(idx > maxUnlockStep) step.classList.add('locked-step');
         else step.classList.remove('locked-step');
      });

      showScreen('midway-screen');
   };
   
   document.getElementById('btn-prizes').onclick = () => {
      initPrizeWall();
      showScreen('prize-screen');
   };
   
   document.getElementById('btn-profile').onclick = () => {
      initFlexRoom();
      showScreen('profile-screen');
   };
   
   document.querySelectorAll('.back-btn').forEach(btn => {
      btn.onclick = () => {
         showScreen('menu-screen');
         updateUI();
      };
   });
   
   // Game Launchers
   document.querySelectorAll('.play-btn').forEach(btn => {
      btn.onclick = (e) => {
         const gameId = e.target.getAttribute('data-game');
         showScreen('game-screen');
         document.getElementById('game-over-overlay').classList.add('hidden');
         document.getElementById('game-intro-overlay').classList.remove('hidden');
         
         const titleEl = document.getElementById('current-game-title');
         const descEl = document.getElementById('intro-desc');
         
         // Set title/desc based on game
         if(gameId === 'safety-pin-sniper') {
           titleEl.innerText = "Safety Pin Sniper";
           descEl.innerText = "Flick UP from the bottom to pop neon bubbles.";
         } else if (gameId === 'liner-layer') {
           titleEl.innerText = "Liner Layer";
           descEl.innerText = "Trace the green glowing lines with your thumb before they fade!";
         } else if (gameId === 'plushie-plunge') {
           titleEl.innerText = "Plushie Plunge";
           descEl.innerText = "Hold LEFT or RIGHT to move the claw. Tap MIDDLE to drop and hunt for Triple-Point Gold plushies!";
         } else if (gameId === 'chain-linker') {
           titleEl.innerText = "Chain Linker";
           descEl.innerText = "Tap the falling rings exactly when they cross the pink target line.";
         } else if (gameId === 'vinyl-spin') {
           titleEl.innerText = "Vinyl Spin";
           descEl.innerText = "Swipe left or right through the center of the record to match the rhythm!";
         } else if (gameId === 'skull-shuffle') {
           titleEl.innerText = "Skull Shuffle";
           descEl.innerText = "Watch the cups closely. Tap the one hiding the green eyeball when they stop!";
         } else if (gameId === 'peg-punk') {
           titleEl.innerText = "Peg Punk";
           descEl.innerText = "Tap the top of the board to drop a skull. Aim for the massive gold payout slots at the bottom!";
         } else if (gameId === 'vans-vault') {
           titleEl.innerText = "Vans Vault";
           descEl.innerText = "Tap to spin, tap to stop. Match 2 or 3 subculture icons to win big tickets!";
         } else if (gameId === 'neon-slots') {
           titleEl.innerText = "Neon Slots";
           descEl.innerText = "Tap to hit the slots. Match 3 symbols to win big.";
         } else if (gameId === 'hypnotic-wheel') {
           titleEl.innerText = "Hypnotic Wheel";
           descEl.innerText = "Tap to spin the massive wheel of fortune!";
         } else if (gameId === 'devils-dice') {
           titleEl.innerText = "Devil's Dice";
           descEl.innerText = "Tap to roll the dice. 7 or 11 wins big!";
         } else if (gameId === 'razor-roulette') {
           titleEl.innerText = "Razor Roulette";
           descEl.innerText = "Tap to drop the ball in the spinning chamber.";
         } else if (gameId === 'blackjack-brawl') {
           titleEl.innerText = "Blackjack Brawl";
           descEl.innerText = "Hit or Stand to get closer to 21 than the dealer.";
         }

         document.getElementById('btn-start-game').onclick = () => {
            document.getElementById('game-intro-overlay').classList.add('hidden');
            
            const onGameOver = (score) => {
               // Game Over Logic
               const earned = Math.floor(score / 5);
               Economy.addTickets(earned);
               Economy.updateGameScore(gameId, score);
               Economy.checkLevelUp();
               
               document.getElementById('earned-tickets').innerText = earned;
               document.getElementById('game-over-overlay').classList.remove('hidden');
            };

            // Instantiate correct class
            if(gameId === 'safety-pin-sniper') currentGame = new window.SafetyPinSniper('game-canvas', onGameOver);
            else if(gameId === 'liner-layer') currentGame = new window.LinerLayer('game-canvas', onGameOver);
            else if(gameId === 'plushie-plunge') currentGame = new window.PlushiePlunge('game-canvas', onGameOver);
            else if(gameId === 'chain-linker') currentGame = new window.ChainLinker('game-canvas', onGameOver);
            else if(gameId === 'vinyl-spin') currentGame = new window.VinylSpin('game-canvas', onGameOver);
            else if(gameId === 'skull-shuffle') currentGame = new window.SkullShuffle('game-canvas', onGameOver);
            else if(gameId === 'peg-punk') currentGame = new window.PegPunk('game-canvas', onGameOver);
            else if(gameId === 'vans-vault') currentGame = new window.VansVault('game-canvas', onGameOver);
            else if(gameId === 'neon-slots') currentGame = new window.NeonSlots('game-canvas', onGameOver);
            else if(gameId === 'hypnotic-wheel') currentGame = new window.HypnoticWheel('game-canvas', onGameOver);
            else if(gameId === 'devils-dice') currentGame = new window.DevilsDice('game-canvas', onGameOver);
            else if(gameId === 'razor-roulette') currentGame = new window.RazorRoulette('game-canvas', onGameOver);
            else if(gameId === 'blackjack-brawl') currentGame = new window.BlackjackBrawl('game-canvas', onGameOver);

            if(currentGame) currentGame.start();
         };
      };
   });
   
   document.getElementById('btn-exit-game').onclick = () => {
      showScreen('menu-screen');
      updateUI();
      if(currentGame) {
         if(currentGame.unbindEvents) currentGame.unbindEvents();
         currentGame = null;
      }
   };
});

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(registration => {
      console.log('SW registered with scope:', registration.scope);
    }).catch(err => {
      console.error('SW registration failed:', err);
    });
  });
}
