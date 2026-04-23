window.GameUtils = {
  applyGrit(ctx, width, height) {
    // Heavy antique film grain / dirt
    ctx.fillStyle = 'rgba(150, 130, 100, 0.05)';
    for(let i=0; i<400; i++) {
       const px = Math.random() * width;
       const py = Math.random() * height;
       const s = Math.random() * 2 + 1;
       ctx.fillRect(px, py, s, s);
    }
    // Burned edge vignette
    const grd = ctx.createRadialGradient(width/2, height/2, height*0.4, width/2, height/2, height*0.9);
    grd.addColorStop(0, "transparent");
    grd.addColorStop(1, "rgba(20, 10, 0, 0.8)"); // dirty brown/black shadow
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);

    // Occasional vector neon glitch
    if (Math.random() < 0.05) {
       ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,0,255,0.1)' : 'rgba(57,255,20,0.1)';
       ctx.fillRect(0, Math.random()*height, width, Math.random()*3);
    }
  },

  drawCreepyClownBoard(ctx, width, height, time) {
    // 1. Realistic Antique Wood Planks
    ctx.fillStyle = '#3a2415'; // Base brown
    ctx.fillRect(0, 0, width, height);
    
    ctx.lineWidth = 1;
    for(let x=0; x<width; x+=45) {
       // Plank shading (Left highlight, Right shadow)
       ctx.fillStyle = 'rgba(0,0,0,0.4)';
       ctx.fillRect(x+40, 0, 5, height);
       ctx.fillStyle = 'rgba(255,255,255,0.05)';
       ctx.fillRect(x, 0, 5, height);
       
       // Wood grain
       ctx.strokeStyle = '#22150c';
       ctx.beginPath();
       ctx.moveTo(x + 20, 0);
       for(let y=0; y<height; y+=20) {
          ctx.lineTo(x + 20 + (Math.sin(y*0.1)*5), y);
       }
       ctx.stroke();
    }
    
    // 2. The Clown Shield Plaque
    const cx = width / 2;
    const cy = height * 0.45;
    
    // Plaque Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.beginPath();
    ctx.arc(cx+5, cy+5, 160, 0, Math.PI*2);
    ctx.fill();

    // Plaque Base
    ctx.fillStyle = '#5c3a21'; // lighter wood
    ctx.beginPath();
    ctx.arc(cx, cy, 160, 0, Math.PI*2);
    ctx.fill();
    ctx.lineWidth = 12;
    ctx.strokeStyle = '#2d180b';
    ctx.stroke();

    // 3. Realistic Creepy Clown Face
    ctx.fillStyle = '#f0dbb6'; // Aged cream paint
    ctx.beginPath();
    ctx.arc(cx, cy, 140, 0, Math.PI*2);
    ctx.fill();

    // Red/Pink Neon hair
    ctx.fillStyle = '#c914 c9'; // aggressive neon scene pink
    ctx.beginPath();
    ctx.arc(cx - 130, cy - 80, 70, 0, Math.PI*2);
    ctx.arc(cx + 130, cy - 80, 70, 0, Math.PI*2);
    ctx.fill();

    // Wide open mouth for bubbles (deep void)
    ctx.fillStyle = '#0a0505';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 60, 100, 70, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.lineWidth = 15;
    ctx.strokeStyle = '#851a1a'; // painted red lips
    ctx.stroke();

    // Detailed Antique Wooden Teeth
    ctx.fillStyle = '#d6b783';
    ctx.fillRect(cx - 70, cy + 5, 30, 45); // Left tooth
    ctx.fillRect(cx - 30, cy - 5, 25, 40); // Broken middle tooth
    ctx.fillRect(cx + 30, cy + 10, 35, 50); // Right tooth
    
    // Eyes and Nose
    ctx.fillStyle = '#c21515'; // clown nose
    ctx.beginPath(); ctx.arc(cx, cy - 20, 25, 0, Math.PI*2); ctx.fill();
    
    // Symmetrical terrifying eyes
    ctx.fillStyle = '#0a0505';
    ctx.beginPath(); ctx.moveTo(cx-30, cy-50); ctx.lineTo(cx-70, cy-30); ctx.lineTo(cx-30, cy-10); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx+30, cy-50); ctx.lineTo(cx+70, cy-30); ctx.lineTo(cx+30, cy-10); ctx.fill();

    // 4. Overhanging Bunting & Bulbs
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, width, 60); // Header bar
    
    // Carnival Bunting Flags
    for(let x=0; x<width; x+=60) {
       ctx.fillStyle = x % 120 === 0 ? '#8c1c13' : '#FF00FF'; // Red and Neon Pink flags
       ctx.beginPath();
       ctx.moveTo(x, 60);
       ctx.lineTo(x+30, 140);
       ctx.lineTo(x+60, 60);
       ctx.fill();
    }

    // Bulb lights on awning
    for(let x=30; x<=width; x+=60) {
       const flicker = (Math.sin(time / 150 + x) > 0) ? '#39FF14' : '#1a400c'; // Neon Green
       ctx.fillStyle = flicker;
       ctx.shadowBlur = flicker === '#39FF14' ? 20 : 0;
       ctx.shadowColor = '#39FF14';
       ctx.beginPath();
       ctx.arc(x, 45, 18, 0, Math.PI*2);
       ctx.fill();
       ctx.shadowBlur = 0; // reset
       // Bulb base
       ctx.fillStyle = '#555';
       ctx.fillRect(x-10, 25, 20, 10);
    }

    this.applyGrit(ctx, width, height);
  },

  drawCarnivalSunburst(ctx, width, height, time) {
    // Dirty cream poster base
    ctx.fillStyle = '#e8dec5';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(time / 8000); // very slow creeping spin

    // Realistic distressed red and neon pink sunburst rays
    const numRays = 24;
    for(let i=0; i<numRays; i++) {
       const angle1 = (i / numRays) * Math.PI * 2;
       const angle2 = ((i + 0.5) / numRays) * Math.PI * 2;
       
       // Alternate distressed red and toxic pink
       ctx.fillStyle = i % 2 === 0 ? '#a32a22' : 'rgba(255, 0, 255, 0.4)'; 
       ctx.beginPath();
       ctx.moveTo(0, 0);
       ctx.lineTo(Math.cos(angle1)*1200, Math.sin(angle1)*1200);
       ctx.lineTo(Math.cos(angle2)*1200, Math.sin(angle2)*1200);
       ctx.closePath();
       ctx.fill();
    }
    ctx.restore();

    // Elaborate Baroque Vector Corners
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.arc(50, 50, 80, 0, Math.PI/2); ctx.stroke();
    ctx.beginPath();
    ctx.arc(width-50, 50, 80, Math.PI/2, Math.PI); ctx.stroke();
    
    // Scattered Neon Stars
    ctx.fillStyle = '#39FF14';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#39FF14';
    for(let i=0; i<12; i++) {
       const px = Math.sin(i)*width*0.4 + cx;
       const py = Math.cos(i)*height*0.4 + cy;
       // Quick 4-point star
       ctx.beginPath();
       ctx.moveTo(px, py-20); ctx.lineTo(px+5, py-5); ctx.lineTo(px+20, py); ctx.lineTo(px+5, py+5);
       ctx.lineTo(px, py+20); ctx.lineTo(px-5, py+5); ctx.lineTo(px-20, py); ctx.lineTo(px-5, py-5);
       ctx.fill();
    }
    ctx.shadowBlur = 0;

    this.applyGrit(ctx, width, height);
  },

  drawClawMachine(ctx, width, height, time) {
    // Interior 3D Cabinet
    ctx.fillStyle = '#1a1a1a'; // Deep back wall
    ctx.fillRect(0, 0, width, height);
    
    // Cabinet side walls (perspective lines)
    ctx.fillStyle = '#0f0f0f';
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(40,40); ctx.lineTo(40, height); ctx.lineTo(0, height); ctx.fill();
    ctx.beginPath(); ctx.moveTo(width,0); ctx.lineTo(width-40,40); ctx.lineTo(width-40, height); ctx.lineTo(width, height); ctx.fill();

    // Mirrored diamond plate / grid in back
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2;
    for(let y=40; y<height; y+=60) { ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(width-40, y); ctx.stroke(); }
    for(let x=40; x<width-40; x+=60) { ctx.beginPath(); ctx.moveTo(x, 40); ctx.lineTo(x, height); ctx.stroke(); }

    // Overhead toxic scene glow (Neon Green fading down)
    const grd = ctx.createLinearGradient(0,40,0, height/1.5);
    grd.addColorStop(0, 'rgba(57, 255, 20, 0.4)'); // Strong green
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.fillRect(40,40, width-80, height);

    // Plushies are now rendered dynamically by the plushie-plunge game loop

    this.applyGrit(ctx, width, height);
  },

  drawRingTossBooth(ctx, width, height, time) {
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, width, height);

    // Very Ornate Wooden Carousel / Ring Toss Sign Background
    const signY = 120;
    ctx.fillStyle = '#d4af37'; // Antique Gold
    
    // Draw complex scrolling baroque backboard
    ctx.beginPath();
    ctx.moveTo(20, signY);
    ctx.quadraticCurveTo(width/4, signY-80, width/2, signY-100);
    ctx.quadraticCurveTo(width*0.75, signY-80, width-20, signY);
    ctx.lineTo(width-40, signY+180);
    ctx.quadraticCurveTo(width/2, signY+240, 40, signY+180);
    ctx.closePath();
    ctx.fill();
    
    // Inner red velvet panel on sign
    ctx.fillStyle = '#8c1c13';
    ctx.beginPath();
    ctx.moveTo(40, signY+10);
    ctx.quadraticCurveTo(width/4, signY-60, width/2, signY-80);
    ctx.quadraticCurveTo(width*0.75, signY-60, width-40, signY+10);
    ctx.lineTo(width-60, signY+160);
    ctx.quadraticCurveTo(width/2, signY+210, 60, signY+160);
    ctx.closePath();
    ctx.fill();

    // Glowing bottles in the background on stepped shelves
    for(let row=0; row<3; row++) {
       const yLine = 320 + (row * 60);
       
       // Wooden shelf
       ctx.fillStyle = '#3a2415';
       ctx.fillRect(0, yLine, width, 15);
       ctx.fillStyle = '#111';
       ctx.fillRect(0, yLine+15, width, 5);

       for(let x=40 + (row*20); x<=width-40; x+=70) {
          // Glass Bottle
          ctx.fillStyle = '#39FF14'; // Toxic scene green
          ctx.globalAlpha = 0.6;
          
          ctx.beginPath();
          ctx.moveTo(x-15, yLine);
          ctx.lineTo(x-15, yLine-50);
          // Curved neck
          ctx.bezierCurveTo(x-15, yLine-70, x-6, yLine-80, x-6, yLine-100);
          ctx.lineTo(x+6, yLine-100);
          ctx.bezierCurveTo(x+6, yLine-80, x+15, yLine-70, x+15, yLine-50);
          ctx.lineTo(x+15, yLine);
          ctx.fill();
          
          ctx.globalAlpha = 1.0;
          
          // Bottle Label (Pink/Black striped)
          ctx.fillStyle = '#FF00FF';
          ctx.fillRect(x-14, yLine-40, 28, 15);
       }
    }

    // Red Drape Table / Foreground
    ctx.fillStyle = '#550000';
    ctx.fillRect(0, height - 120, width, 120);
    // Drape folds
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    for(let x=0; x<width; x+=40) {
       ctx.beginPath();
       ctx.ellipse(x+20, height-120, 20, 120, 0, 0, Math.PI);
       ctx.fill();
    }

    this.applyGrit(ctx, width, height);
  },

  drawHypnoticWheel(ctx, width, height, time) {
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = Math.min(width, height) * 0.7; // Exceeds canvas to look huge
    
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(time / 2500);

    // Realistic 3D Wheel Base
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath(); ctx.arc(0, 0, maxRadius, 0, Math.PI*2); ctx.fill();

    // Hypnotic Alternating Spiral (Pink and Slime Green slices instead of lines)
    const slices = 20;
    for(let i=0; i<slices; i++) {
       const startAngle = (i/slices) * Math.PI*2;
       const endAngle = ((i+1)/slices) * Math.PI*2;
       
       ctx.fillStyle = i % 2 === 0 ? '#FF00FF' : '#111111';
       ctx.beginPath();
       ctx.moveTo(0,0);
       // Curving the slice to make it a spiral
       for(let r=0; r<=maxRadius; r+=20) {
          const twist = r * 0.005;
          ctx.lineTo(r * Math.cos(startAngle + twist), r * Math.sin(startAngle + twist));
       }
       for(let r=maxRadius; r>=0; r-=20) {
          const twist = r * 0.005;
          ctx.lineTo(r * Math.cos(endAngle + twist), r * Math.sin(endAngle + twist));
       }
       ctx.closePath();
       ctx.fill();
    }

    // Carnival Wheel Pegs (Brass)
    for(let i=0; i<30; i++) {
       const angle = (i/30) * Math.PI*2;
       const px = Math.cos(angle) * (maxRadius - 15);
       const py = Math.sin(angle) * (maxRadius - 15);
       
       ctx.fillStyle = '#d4af37'; // Gold/Brass
       ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI*2); ctx.fill();
       
       // Peg Shadow
       ctx.fillStyle = 'rgba(0,0,0,0.8)';
       ctx.beginPath(); ctx.arc(px-4, py+4, 8, 0, Math.PI*2); ctx.fill();
    }
    
    ctx.restore();

    // Heavy Vignette / Wheel Housing Shadow
    const grd = ctx.createRadialGradient(cx, cy, height*0.1, cx, cy, height*0.6);
    grd.addColorStop(0, "transparent");
    grd.addColorStop(1, "rgba(5,5,5,0.95)");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);

    this.applyGrit(ctx, width, height);
  },

  drawMysticTable(ctx, width, height, time) {
    // Deep purple velvet table
    ctx.fillStyle = '#2a0a2a';
    ctx.fillRect(0, 0, width, height);
    
    // Velvet folds
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    for(let x=0; x<width; x+=60) {
       ctx.beginPath(); ctx.ellipse(x+30, height/2, 30, height, 0, 0, Math.PI); ctx.fill();
    }

    // Antique gold mystical circles
    const cx = width / 2;
    const cy = height * 0.4;
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(cx, cy, 180, 0, Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 170, 0, Math.PI*2); ctx.stroke();
    // Astrological markings
    for(let i=0; i<12; i++) {
       const ang = i * (Math.PI/6);
       ctx.beginPath(); ctx.moveTo(cx + Math.cos(ang)*170, cy + Math.sin(ang)*170); ctx.lineTo(cx + Math.cos(ang)*180, cy + Math.sin(ang)*180); ctx.stroke();
    }

    // Overgrown heavy creepy roots framing the table
    ctx.lineWidth = 15;
    ctx.strokeStyle = '#1a1005';
    // Left roots
    ctx.beginPath(); ctx.moveTo(0,0); ctx.bezierCurveTo(40, height/3, 10, height*0.6, 50, height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(20,0); ctx.bezierCurveTo(60, height/2, 30, height*0.8, 0, height); ctx.stroke();
    // Right roots
    ctx.beginPath(); ctx.moveTo(width,0); ctx.bezierCurveTo(width-40, height/3, width-10, height*0.6, width-50, height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(width-20,0); ctx.bezierCurveTo(width-60, height/2, width-30, height*0.8, width, height); ctx.stroke();

    // Top glowing crystal ball
    ctx.fillStyle = '#111';
    ctx.beginPath(); ctx.ellipse(cx, 80, 60, 20, 0, 0, Math.PI*2); ctx.fill();
    
    const pulse = Math.abs(Math.sin(time/500));
    const ballGrd = ctx.createRadialGradient(cx, 40, 5, cx, 40, 45);
    ballGrd.addColorStop(0, `rgba(57, 255, 20, ${0.8 + (pulse*0.2)})`); // Toxic Green core
    ballGrd.addColorStop(1, 'rgba(0, 50, 0, 0.9)');
    ctx.fillStyle = ballGrd;
    ctx.shadowBlur = 30 + (pulse*20);
    ctx.shadowColor = '#39FF14';
    ctx.beginPath(); ctx.arc(cx, 40, 45, 0, Math.PI*2); ctx.fill();
    ctx.shadowBlur = 0;

    this.applyGrit(ctx, width, height);
  },

  drawPlinkoBoard(ctx, width, height, time, pegs = []) {
    // Hard battered vertical wood
    ctx.fillStyle = '#4a2f1d';
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 1;
    for(let x=20; x<width; x+=35) {
       ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(x, 0, 4, height);
       ctx.fillStyle = 'rgba(255,255,255,0.05)'; ctx.fillRect(x-4, 0, 4, height);
    }
    
    // Scuffs and burns
    ctx.fillStyle = 'rgba(20,10,5,0.8)';
    for(let i=0; i<15; i++) {
        ctx.beginPath(); ctx.ellipse(Math.random()*width, Math.random()*height, Math.random()*15, Math.random()*5, Math.random()*Math.PI, 0, Math.PI*2); ctx.fill();
    }

    // Neon Pink Border Rails
    ctx.fillStyle = '#222';
    ctx.fillRect(0, 0, 20, height);
    ctx.fillRect(width-20, 0, 20, height);
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#FF00FF';
    ctx.fillStyle = '#FF00FF';
    ctx.fillRect(8, 0, 4, height);
    ctx.fillRect(width-12, 0, 4, height);
    ctx.shadowBlur = 0;

    // The brass pegs
    // We will draw fixed decorative pegs here, the game uses real physics pegs overlaid
    ctx.fillStyle = '#d4af37';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    if (pegs && pegs.length > 0) {
        for(let p of pegs) {
            let x = p.x; let y = p.y;
            ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI*2); ctx.fill(); ctx.stroke();
            ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.arc(x-2, y-2, 2, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = '#d4af37';
            ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.arc(x+2, y+2, 2, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = '#d4af37';
        }
    } else {
        for(let y=150; y<height-150; y+=80) {
            let offset = (y % 160 === 0) ? 0 : 40;
            for(let x=40+offset; x<width-30; x+=80) {
                ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI*2); ctx.fill(); ctx.stroke();
                ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.beginPath(); ctx.arc(x-2, y-2, 2, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = '#d4af37';
                ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.beginPath(); ctx.arc(x+2, y+2, 2, 0, Math.PI*2); ctx.fill(); ctx.fillStyle = '#d4af37';
            }
        }
    }

    this.applyGrit(ctx, width, height);
  },

  drawSlotMachine(ctx, width, height, time) {
    // Heavy mechanical darkness
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0,0, width, height);

    // Fluted Chrome side pillars
    const drawChrome = (x, w) => {
       const grd = ctx.createLinearGradient(x, 0, x+w, 0);
       grd.addColorStop(0, '#222'); grd.addColorStop(0.3, '#ddd'); grd.addColorStop(0.5, '#fff'); grd.addColorStop(0.7, '#888'); grd.addColorStop(1, '#222');
       ctx.fillStyle = grd;
       ctx.fillRect(x, 0, w, height);
       ctx.fillStyle = 'rgba(0,0,0,0.5)';
       for(let lx=x; lx<x+w; lx+=10) ctx.fillRect(lx, 0, 2, height);
    };
    drawChrome(0, 40);
    drawChrome(width-40, 40);

    // Reel Housing Background (Deep shadowed recess)
    const grd = ctx.createRadialGradient(width/2, height/2, 50, width/2, height/2, 250);
    grd.addColorStop(0, '#222');
    grd.addColorStop(1, '#050505');
    ctx.fillStyle = grd;
    ctx.fillRect(40, height/3 - 20, width-80, height/3 + 40);
    
    // Reel Dividers (Chrome)
    ctx.fillStyle = '#888';
    ctx.fillRect(width/3 - 5, height/3 - 20, 10, height/3 + 40);
    ctx.fillRect((width/3)*2 - 5, height/3 - 20, 10, height/3 + 40);

    // Marquee Header
    ctx.fillStyle = '#8c1c13'; // Crimson red marquee
    ctx.fillRect(40, 0, width-80, height/3 - 20);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(40, height/3 - 25, width-80, 5); // gold trim

    this.applyGrit(ctx, width, height);
  },

  drawPlushie(ctx, px, py, colorIndex, typeIndex, isGold) {
       if(typeIndex === undefined) typeIndex = colorIndex % 3;

       let basePaint;
       if(isGold) {
           basePaint = '#FFD700'; // Bright Gold
           ctx.shadowBlur = 15;
           ctx.shadowColor = '#FFFF00'; // Neon glowing yellow
       } else {
           const colors = ['#FF00FF', '#4a0e4e', '#111111', '#39FF14'];
           basePaint = colors[colorIndex % colors.length];
       }
       
       if (typeIndex === 0) {
           // 1. GLOOMY BEAR
           ctx.fillStyle = basePaint;
           ctx.beginPath();
           ctx.arc(px, py, 35, 0, Math.PI*2);
           ctx.fill();
           ctx.lineWidth = 4;
           ctx.strokeStyle = '#050505';
           ctx.stroke();

           // Ears
           ctx.beginPath(); ctx.arc(px-25, py-25, 15, 0, Math.PI*2); ctx.fill(); ctx.stroke();
           ctx.beginPath(); ctx.arc(px+25, py-25, 15, 0, Math.PI*2); ctx.fill(); ctx.stroke();

           // X Eyes
           ctx.strokeStyle = '#fff';
           ctx.lineWidth = 3;
           ctx.beginPath(); ctx.moveTo(px-15, py-5); ctx.lineTo(px-5, py+5); ctx.moveTo(px-5, py-5); ctx.lineTo(px-15, py+5); ctx.stroke();
           ctx.beginPath(); ctx.moveTo(px+5, py-5); ctx.lineTo(px+15, py+5); ctx.moveTo(px+15, py-5); ctx.lineTo(px+5, py+5); ctx.stroke();
       } 
       else if (typeIndex === 1) {
           // 2. INVADER ZIM ALIEN
           ctx.fillStyle = basePaint;
           ctx.beginPath();
           ctx.ellipse(px, py, 25, 35, 0, 0, Math.PI*2);
           ctx.fill();
           ctx.lineWidth = 3; ctx.strokeStyle = '#050505'; ctx.stroke();
           
           // Jagged Antennae
           ctx.beginPath(); ctx.moveTo(px-10, py-30); ctx.lineTo(px-25, py-50); ctx.stroke();
           ctx.beginPath(); ctx.moveTo(px+10, py-30); ctx.lineTo(px+25, py-50); ctx.stroke();

           // Massive Magenta Alien Eyes
           ctx.fillStyle = '#FF00FF';
           ctx.beginPath(); ctx.ellipse(px-12, py-2, 12, 18, -0.2, 0, Math.PI*2); ctx.fill(); ctx.stroke();
           ctx.beginPath(); ctx.ellipse(px+12, py-2, 12, 18, 0.2, 0, Math.PI*2); ctx.fill(); ctx.stroke();
       }
       else if (typeIndex === 2) {
           // 3. SKELANIMAL / JACK SKULL
           ctx.fillStyle = isGold ? basePaint : '#dcdcdc'; // Dirty Bone White or Gold
           ctx.beginPath(); ctx.arc(px, py, 30, 0, Math.PI*2); ctx.fill();
           ctx.lineWidth = 3; ctx.strokeStyle = '#050505'; ctx.stroke();

           // Deep Hollow Eye Sockets
           ctx.fillStyle = '#111';
           ctx.beginPath(); ctx.arc(px-12, py-5, 10, 0, Math.PI*2); ctx.fill();
           ctx.beginPath(); ctx.arc(px+12, py-5, 10, 0, Math.PI*2); ctx.fill();

           // Scene Stitched Mouth
           ctx.beginPath(); ctx.moveTo(px-15, py+16); ctx.lineTo(px+15, py+16); ctx.stroke();
           for(let nx=-10; nx<=10; nx+=5) {
               ctx.beginPath(); ctx.moveTo(px+nx, py+12); ctx.lineTo(px+nx, py+20); ctx.stroke();
           }
       }

       // Reset shadow to prevent bleeding
       ctx.shadowBlur = 0;
  }
};
