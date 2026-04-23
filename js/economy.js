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
    { id: '5_10', lvl: 5, name: '100% RawrXD Badge', cost: 1000, type: 'badge', icon: '🏆' },
    
    // Extravagant Game-Specific Prizes (Unlocked at 100+ points on the respective game)
    { id: '6_1', lvl: 99, reqGame: 'safety-pin-sniper', reqScore: 100, name: 'Gold Safety Pin', cost: 1000, type: 'wearable', icon: '🧷' },
    { id: '6_2', lvl: 99, reqGame: 'safety-pin-sniper', reqScore: 100, name: 'Sniper Scope Glasses', cost: 1200, type: 'wearable', icon: '🕶️' },
    { id: '6_3', lvl: 99, reqGame: 'safety-pin-sniper', reqScore: 100, name: 'Neon Balloon Animal', cost: 1500, type: 'decor', icon: '🎈' },
    { id: '6_4', lvl: 99, reqGame: 'safety-pin-sniper', reqScore: 100, name: 'Platinum Pin Badge', cost: 2000, type: 'badge', icon: '🏅' },
    { id: '6_5', lvl: 99, reqGame: 'safety-pin-sniper', reqScore: 100, name: 'Sniper\'s Trophy', cost: 3000, type: 'decor', icon: '🏆' },

    { id: '7_1', lvl: 99, reqGame: 'liner-layer', reqScore: 100, name: 'Glow Stick Crown', cost: 1000, type: 'wearable', icon: '👑' },
    { id: '7_2', lvl: 99, reqGame: 'liner-layer', reqScore: 100, name: 'Neon Eyeliner Paint', cost: 1200, type: 'wearable', icon: '🖌️' },
    { id: '7_3', lvl: 99, reqGame: 'liner-layer', reqScore: 100, name: 'Raver Glow Gloves', cost: 1500, type: 'wearable', icon: '🧤' },
    { id: '7_4', lvl: 99, reqGame: 'liner-layer', reqScore: 100, name: 'Laser Pointer Ring', cost: 2000, type: 'wearable', icon: '💍' },
    { id: '7_5', lvl: 99, reqGame: 'liner-layer', reqScore: 100, name: 'Tracing Master Trophy', cost: 3000, type: 'decor', icon: '🏆' },

    { id: '8_1', lvl: 99, reqGame: 'plushie-plunge', reqScore: 100, name: 'Golden Gloomy Bear', cost: 1000, type: 'decor', icon: '🧸' },
    { id: '8_2', lvl: 99, reqGame: 'plushie-plunge', reqScore: 100, name: 'Giant Claw Prop', cost: 1200, type: 'decor', icon: '🪝' },
    { id: '8_3', lvl: 99, reqGame: 'plushie-plunge', reqScore: 100, name: 'Plushie Pile Bed', cost: 1500, type: 'decor', icon: '🛌' },
    { id: '8_4', lvl: 99, reqGame: 'plushie-plunge', reqScore: 100, name: 'Arcade Token Pendant', cost: 2000, type: 'wearable', icon: '🪙' },
    { id: '8_5', lvl: 99, reqGame: 'plushie-plunge', reqScore: 100, name: 'Claw Master Trophy', cost: 3000, type: 'decor', icon: '🏆' },

    { id: '9_1', lvl: 99, reqGame: 'chain-linker', reqScore: 100, name: 'Titanium Wallet Chain', cost: 1000, type: 'wearable', icon: '⛓️' },
    { id: '9_2', lvl: 99, reqGame: 'chain-linker', reqScore: 100, name: 'Padlock Necklace', cost: 1200, type: 'wearable', icon: '🔒' },
    { id: '9_3', lvl: 99, reqGame: 'chain-linker', reqScore: 100, name: 'Studded Dog Collar', cost: 1500, type: 'wearable', icon: '🦮' },
    { id: '9_4', lvl: 99, reqGame: 'chain-linker', reqScore: 100, name: 'Heavy Metal Keys', cost: 2000, type: 'decor', icon: '🗝️' },
    { id: '9_5', lvl: 99, reqGame: 'chain-linker', reqScore: 100, name: 'Chain Lord Trophy', cost: 3000, type: 'decor', icon: '🏆' },

    { id: '10_1', lvl: 99, reqGame: 'vinyl-spin', reqScore: 100, name: 'Solid Gold Record', cost: 1000, type: 'decor', icon: '📀' },
    { id: '10_2', lvl: 99, reqGame: 'vinyl-spin', reqScore: 100, name: 'Diamond Turntable', cost: 1200, type: 'decor', icon: '🎛️' },
    { id: '10_3', lvl: 99, reqGame: 'vinyl-spin', reqScore: 100, name: 'DJ Headphones', cost: 1500, type: 'wearable', icon: '🎧' },
    { id: '10_4', lvl: 99, reqGame: 'vinyl-spin', reqScore: 100, name: 'Rhythm Master Badge', cost: 2000, type: 'badge', icon: '🎵' },
    { id: '10_5', lvl: 99, reqGame: 'vinyl-spin', reqScore: 100, name: 'Maestro Trophy', cost: 3000, type: 'decor', icon: '🏆' },

    { id: '11_1', lvl: 99, reqGame: 'skull-shuffle', reqScore: 100, name: 'Diamond Skull Pet', cost: 1000, type: 'decor', icon: '💀' },
    { id: '11_2', lvl: 99, reqGame: 'skull-shuffle', reqScore: 100, name: 'Golden Cup Set', cost: 1200, type: 'decor', icon: '🏺' },
    { id: '11_3', lvl: 99, reqGame: 'skull-shuffle', reqScore: 100, name: 'Eyeball Ring', cost: 1500, type: 'wearable', icon: '👁️' },
    { id: '11_4', lvl: 99, reqGame: 'skull-shuffle', reqScore: 100, name: 'Magician\'s Top Hat', cost: 2000, type: 'wearable', icon: '🎩' },
    { id: '11_5', lvl: 99, reqGame: 'skull-shuffle', reqScore: 100, name: 'Illusionist Trophy', cost: 3000, type: 'decor', icon: '🏆' },

    { id: '12_1', lvl: 99, reqGame: 'peg-punk', reqScore: 100, name: 'Golden Skull Dropper', cost: 1000, type: 'decor', icon: '💀' },
    { id: '12_2', lvl: 99, reqGame: 'peg-punk', reqScore: 100, name: 'Ruby Peg Necklace', cost: 1200, type: 'wearable', icon: '📍' },
    { id: '12_3', lvl: 99, reqGame: 'peg-punk', reqScore: 100, name: 'Neon Bumpers', cost: 1500, type: 'decor', icon: '⭕' },
    { id: '12_4', lvl: 99, reqGame: 'peg-punk', reqScore: 100, name: 'Plinko Master Badge', cost: 2000, type: 'badge', icon: '🎯' },
    { id: '12_5', lvl: 99, reqGame: 'peg-punk', reqScore: 100, name: 'Bumper King Trophy', cost: 3000, type: 'decor', icon: '🏆' },

    { id: '13_1', lvl: 99, reqGame: 'vans-vault', reqScore: 100, name: 'Diamond Studded Vans', cost: 1000, type: 'wearable', icon: '👟' },
    { id: '13_2', lvl: 99, reqGame: 'vans-vault', reqScore: 100, name: 'Vault Key Pendant', cost: 1200, type: 'wearable', icon: '🗝️' },
    { id: '13_3', lvl: 99, reqGame: 'vans-vault', reqScore: 100, name: 'Platinum Skateboard', cost: 1500, type: 'decor', icon: '🛹' },
    { id: '13_4', lvl: 99, reqGame: 'vans-vault', reqScore: 100, name: 'Vans VIP Badge', cost: 2000, type: 'badge', icon: '🎫' },
    { id: '13_5', lvl: 99, reqGame: 'vans-vault', reqScore: 100, name: 'Vault Breaker Trophy', cost: 3000, type: 'decor', icon: '🏆' },

    { id: '14_1', lvl: 99, reqGame: 'neon-slots', reqScore: 100, name: 'Gold Slot Token', cost: 1000, type: 'decor', icon: '🪙' },
    { id: '14_2', lvl: 99, reqGame: 'neon-slots', reqScore: 100, name: 'Lucky Horseshoe Piercing', cost: 1200, type: 'wearable', icon: '🧲' },
    { id: '14_3', lvl: 99, reqGame: 'neon-slots', reqScore: 100, name: 'Cherry Bomb Earrings', cost: 1500, type: 'wearable', icon: '🍒' },
    { id: '14_4', lvl: 99, reqGame: 'neon-slots', reqScore: 100, name: 'Jackpot Crown', cost: 2000, type: 'wearable', icon: '👑' },
    { id: '14_5', lvl: 99, reqGame: 'neon-slots', reqScore: 100, name: 'High Roller Trophy', cost: 3000, type: 'decor', icon: '🏆' },

    { id: '15_1', lvl: 99, reqGame: 'hypnotic-wheel', reqScore: 100, name: 'Crystal Spinner', cost: 1000, type: 'decor', icon: '🔮' },
    { id: '15_2', lvl: 99, reqGame: 'hypnotic-wheel', reqScore: 100, name: 'Hypno-Spiral Eye Contacts', cost: 1200, type: 'wearable', icon: '🌀' },
    { id: '15_3', lvl: 99, reqGame: 'hypnotic-wheel', reqScore: 100, name: 'Fortune Teller Scarf', cost: 1500, type: 'wearable', icon: '🧣' },
    { id: '15_4', lvl: 99, reqGame: 'hypnotic-wheel', reqScore: 100, name: 'Wheel of Fate Badge', cost: 2000, type: 'badge', icon: '🎡' },
    { id: '15_5', lvl: 99, reqGame: 'hypnotic-wheel', reqScore: 100, name: 'Spinner Trophy', cost: 3000, type: 'decor', icon: '🏆' },

    { id: '16_1', lvl: 99, reqGame: 'devils-dice', reqScore: 100, name: 'Fuzzy Dice Mirror Hanger', cost: 1000, type: 'decor', icon: '🎲' },
    { id: '16_2', lvl: 99, reqGame: 'devils-dice', reqScore: 100, name: 'Flaming Number 7 Tattoo', cost: 1200, type: 'wearable', icon: '🔥' },
    { id: '16_3', lvl: 99, reqGame: 'devils-dice', reqScore: 100, name: 'Devil Horns Headband', cost: 1500, type: 'wearable', icon: '👿' },
    { id: '16_4', lvl: 99, reqGame: 'devils-dice', reqScore: 100, name: 'Snake Eyes Ring', cost: 2000, type: 'wearable', icon: '🐍' },
    { id: '16_5', lvl: 99, reqGame: 'devils-dice', reqScore: 100, name: 'Dice God Trophy', cost: 3000, type: 'decor', icon: '🏆' },

    { id: '17_1', lvl: 99, reqGame: 'razor-roulette', reqScore: 100, name: 'Razor Blade Necklace', cost: 1000, type: 'wearable', icon: '🪒' },
    { id: '17_2', lvl: 99, reqGame: 'razor-roulette', reqScore: 100, name: 'Black/Red Checkered Vest', cost: 1200, type: 'wearable', icon: '🦺' },
    { id: '17_3', lvl: 99, reqGame: 'razor-roulette', reqScore: 100, name: 'Gold Roulette Ball', cost: 1500, type: 'decor', icon: '🟡' },
    { id: '17_4', lvl: 99, reqGame: 'razor-roulette', reqScore: 100, name: 'Dealer Visor', cost: 2000, type: 'wearable', icon: '🧢' },
    { id: '17_5', lvl: 99, reqGame: 'razor-roulette', reqScore: 100, name: 'Roulette Shark Trophy', cost: 3000, type: 'decor', icon: '🏆' },

    { id: '18_1', lvl: 99, reqGame: 'blackjack-brawl', reqScore: 100, name: 'Spade Card Earrings', cost: 1000, type: 'wearable', icon: '♠️' },
    { id: '18_2', lvl: 99, reqGame: 'blackjack-brawl', reqScore: 100, name: 'Poker Chip Choker', cost: 1200, type: 'wearable', icon: '🃏' },
    { id: '18_3', lvl: 99, reqGame: 'blackjack-brawl', reqScore: 100, name: 'Golden Deck of Cards', cost: 1500, type: 'decor', icon: '🎴' },
    { id: '18_4', lvl: 99, reqGame: 'blackjack-brawl', reqScore: 100, name: 'Ace of Hearts Jacket', cost: 2000, type: 'wearable', icon: '🧥' },
    { id: '18_5', lvl: 99, reqGame: 'blackjack-brawl', reqScore: 100, name: 'Blackjack Card Trophy', cost: 3000, type: 'decor', icon: '🏆' }
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
