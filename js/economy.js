window.Economy = {
  username: null,
  tickets: 0,
  lifetimeTickets: 0,
  level: 1,
  gameScores: {},
  unlockedPrizes: [],
  prizes: [
    // Level 1: Starter Scene (10 items)
    { id: '1_1', lvl: 1, name: 'Striped Knee Highs', cost: 10, type: 'wearable', icon: '🧦' },
    { id: '1_2', lvl: 1, name: 'Jelly Bracelets', cost: 10, type: 'wearable', icon: '⭕' },
    { id: '1_3', lvl: 1, name: 'Checkered Belt', cost: 15, type: 'wearable', icon: '🏁' },
    { id: '1_4', lvl: 1, name: 'Band Poster', cost: 15, type: 'decor', icon: '🖼️' },
    { id: '1_5', lvl: 1, name: 'Broken Heart Pin', cost: 20, type: 'badge', icon: '💔' },
    { id: '1_6', lvl: 1, name: 'Kohl Eyeliner', cost: 25, type: 'wearable', icon: '👁️‍🗨️' },
    { id: '1_7', lvl: 1, name: 'Fingerless Gloves', cost: 25, type: 'wearable', icon: '🧤' },
    { id: '1_8', lvl: 1, name: 'Skull Keychain', cost: 30, type: 'decor', icon: '💀' },
    { id: '1_9', lvl: 1, name: 'Monster Energy Can', cost: 40, type: 'decor', icon: '🔋' },
    { id: '1_10', lvl: 1, name: 'RawrXD Badge', cost: 50, type: 'badge', icon: '🦖' },
    // Level 2: Mall Goth (10 items)
    { id: '2_1', lvl: 2, name: 'Bullet Belt', cost: 60, type: 'wearable', icon: '⛓️' },
    { id: '2_2', lvl: 2, name: 'Bleeding Heart Decal', cost: 60, type: 'decor', icon: '🩸' },
    { id: '2_3', lvl: 2, name: 'Gloomy Bear Plush', cost: 70, type: 'decor', icon: '🧸' },
    { id: '2_4', lvl: 2, name: 'Lip Ring', cost: 70, type: 'wearable', icon: '👄' },
    { id: '2_5', lvl: 2, name: 'Tripp Pants', cost: 80, type: 'wearable', icon: '👖' },
    { id: '2_6', lvl: 2, name: 'Bat Wings Bag', cost: 80, type: 'wearable', icon: '🦇' },
    { id: '2_7', lvl: 2, name: 'Invader Zim Poster', cost: 90, type: 'decor', icon: '👽' },
    { id: '2_8', lvl: 2, name: 'Safety Pin Choker', cost: 90, type: 'wearable', icon: '📎' },
    { id: '2_9', lvl: 2, name: 'Vampire Fangs', cost: 100, type: 'wearable', icon: '🧛' },
    { id: '2_10', lvl: 2, name: 'MCR Survivor Badge', cost: 150, type: 'badge', icon: '🖤' },
    // Level 3: Show Goer (10 items)
    { id: '3_1', lvl: 3, name: 'Neon Brass Knuckles', cost: 120, type: 'wearable', icon: '👊' },
    { id: '3_2', lvl: 3, name: 'Blood-Spattered Vans', cost: 120, type: 'wearable', icon: '👟' },
    { id: '3_3', lvl: 3, name: 'Setlist Scrap', cost: 130, type: 'decor', icon: '📄' },
    { id: '3_4', lvl: 3, name: 'Shattered CD', cost: 130, type: 'decor', icon: '💿' },
    { id: '3_5', lvl: 3, name: 'Snakebites Piercing', cost: 140, type: 'wearable', icon: '🐍' },
    { id: '3_6', lvl: 3, name: 'Camo Mini Skirt', cost: 140, type: 'wearable', icon: '👗' },
    { id: '3_7', lvl: 3, name: 'X Marks Hands', cost: 150, type: 'wearable', icon: '✖️' },
    { id: '3_8', lvl: 3, name: 'Guitar Pick Necklace', cost: 150, type: 'wearable', icon: '🎸' },
    { id: '3_9', lvl: 3, name: 'Mic Stand Prop', cost: 160, type: 'decor', icon: '🎤' },
    { id: '3_10', lvl: 3, name: 'Pit Boss Badge', cost: 200, type: 'badge', icon: '🦾' },
    // Level 4: MySpace Famous (10 items)
    { id: '4_1', lvl: 4, name: 'Raccoon Tail Hair', cost: 200, type: 'wearable', icon: '🦝' },
    { id: '4_2', lvl: 4, name: 'Pixelated Crown', cost: 200, type: 'wearable', icon: '👑' },
    { id: '4_3', lvl: 4, name: 'Broken Mirror', cost: 210, type: 'decor', icon: '🪞' },
    { id: '4_4', lvl: 4, name: 'Digital Camera', cost: 210, type: 'decor', icon: '📷' },
    { id: '4_5', lvl: 4, name: 'Shutter Shades', cost: 220, type: 'wearable', icon: '😎' },
    { id: '4_6', lvl: 4, name: 'Leopard Print Hoodie', cost: 230, type: 'wearable', icon: '🐆' },
    { id: '4_7', lvl: 4, name: 'Webcam Filter', cost: 240, type: 'decor', icon: '💻' },
    { id: '4_8', lvl: 4, name: 'Hello Kitty Necklace', cost: 250, type: 'wearable', icon: '🐱' },
    { id: '4_9', lvl: 4, name: 'PC4PC Badge', cost: 300, type: 'badge', icon: '🔄' },
    { id: '4_10', lvl: 4, name: 'Top 8 Survivor', cost: 350, type: 'badge', icon: '🎱' },
    // Level 5: The Grail Tier (10 items)
    { id: '5_1', lvl: 5, name: 'Animated Glitch Halo', cost: 400, type: 'wearable', icon: '✨' },
    { id: '5_2', lvl: 5, name: 'Floating Skull Pet', cost: 400, type: 'decor', icon: '☠️' },
    { id: '5_3', lvl: 5, name: 'Bleeding Eyes Contacts', cost: 420, type: 'wearable', icon: '🩸' },
    { id: '5_4', lvl: 5, name: 'Neon Plasma Guitar', cost: 450, type: 'decor', icon: '🎸' },
    { id: '5_5', lvl: 5, name: 'Skeletal Wings', cost: 500, type: 'wearable', icon: '🪽' },
    { id: '5_6', lvl: 5, name: 'Void Aura', cost: 500, type: 'wearable', icon: '🕳️' },
    { id: '5_7', lvl: 5, name: 'Cursed Boombox', cost: 550, type: 'decor', icon: '📻' },
    { id: '5_8', lvl: 5, name: 'Ghost of the Midway', cost: 600, type: 'decor', icon: '👻' },
    { id: '5_9', lvl: 5, name: 'Scene Queen Crown', cost: 700, type: 'wearable', icon: '👑' },
    { id: '5_10', lvl: 5, name: '100% RawrXD Badge', cost: 1000, type: 'badge', icon: '🏆' }
  ],

  login(username) {
    if(!username || username.trim() === '') return false;
    this.username = username.trim();
    this.loadState();
    return true;
  },

  addTickets(amount) {
    if(!this.username) return;
    this.tickets += amount;
    this.lifetimeTickets += amount;
    this.checkLevelUp();
    this.saveState();
  },

  spendTickets(amount) {
    if(!this.username) return false;
    if (this.tickets >= amount) {
      this.tickets -= amount;
      this.saveState();
      return true;
    }
    return false;
  },

  checkLevelUp() {
    // They must score 100 tickets to complete a level. So Level = Floor(Lifetime / 100) + 1
    const newLevel = Math.floor(this.lifetimeTickets / 100) + 1;
    if (newLevel > this.level && newLevel <= 5) {
      this.level = newLevel;
    }
  },

  unlockPrize(id) {
    if(!this.username) return false;
    const p = this.prizes.find(p => p.id === id);
    if (!p) return false;
    if (this.unlockedPrizes.includes(id)) return false;
    if (p.lvl > this.level) return false; // Hard block if level check fails magically
    
    if (this.spendTickets(p.cost)) {
      this.unlockedPrizes.push(id);
      this.saveState();
      return true;
    }
    return false;
  },

  updateGameScore(gameId, score) {
    if(!this.username) return;
    if(!this.gameScores) this.gameScores = {};
    if(!this.gameScores[gameId] || score > this.gameScores[gameId]) {
       this.gameScores[gameId] = score;
       this.saveState();
    }
  },

  saveState() {
    if(!this.username) return;
    const key = 'rawr-state-' + this.username;
    localStorage.setItem(key, JSON.stringify({
      tickets: this.tickets,
      lifetimeTickets: this.lifetimeTickets,
      level: this.level,
      gameScores: this.gameScores,
      unlockedPrizes: this.unlockedPrizes
    }));
  },

  loadState() {
    if(!this.username) return;
    const key = 'rawr-state-' + this.username;
    const s = localStorage.getItem(key);
    if (s) {
      const p = JSON.parse(s);
      this.tickets = p.tickets || 0;
      this.lifetimeTickets = p.lifetimeTickets || p.tickets || 0;
      this.level = p.level || 1;
      this.gameScores = p.gameScores || {};
      this.unlockedPrizes = p.unlockedPrizes || [];
    } else {
      // New user default
      this.tickets = 0;
      this.lifetimeTickets = 0;
      this.level = 1;
      this.gameScores = {};
      this.unlockedPrizes = [];
    }
    this.checkLevelUp(); // Sync level against lifetime
  }
};
