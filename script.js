// ════ STATE ════
let currentScreen = 'loading';
let isDark = true;
let isMuted = false;
const music = document.getElementById('bgMusic');

// ════ AUTOPLAY MUSIC ════
window.addEventListener('load', () => {
  music.volume = 0.5;
  music.play().catch(() => {
    // autoplay blocked — play on first interaction
    document.addEventListener('click', () => { music.play(); }, { once: true });
    document.addEventListener('keydown', () => { music.play(); }, { once: true });
  });
});

// ════ MUTE ════
function toggleMute() {
  isMuted = !isMuted;
  music.muted = isMuted;
  document.getElementById('muteBtn').textContent = isMuted ? '🔇 UNMUTE' : '🔊 MUTE';
  document.querySelectorAll('.bar').forEach(b => b.classList.toggle('paused', isMuted));
}

// ════ THEME ════
function toggleTheme() {
  isDark = !isDark;
  document.body.classList.toggle('day-mode', !isDark);
  document.getElementById('themeBtn').textContent = isDark ? '☀️ DAY' : '🌙 NIGHT';
}

// ════ SCREEN NAV ════
function nextScreen(screen) {
  stopPageAnimations(currentScreen);
  document.getElementById(currentScreen).classList.remove('active');
  document.getElementById(screen).classList.add('active');
  currentScreen = screen;
  if (screen === 'start')     setTimeout(initGalaxy, 80);
  if (screen === 'countdown') { animateCountdown(); }
  if (screen === 'letter')    { typeMessage(); setTimeout(initSakura, 80); }
  if (screen === 'cake')      { setTimeout(startCakeCountdown, 400); }
  if (screen === 'jojoGame')  startSlot();
  if (screen === 'timeline')  setTimeout(initRipple, 80);
  if (screen === 'memories')  setTimeout(initDiamonds, 80);
  if (screen === 'bottle')    setTimeout(initBlackHole, 80);
  if (screen === 'zodiac')    setTimeout(initStandEye, 80);
  if (screen === 'standCard') { animateStandCard(); setTimeout(initEmbers, 80); }
  if (screen === 'photoscreen') { /* just show */ }
  if (screen === 'envelope')  setupEnvelope();
  if (screen === 'final')     { launchConfetti(); setTimeout(initHeart, 100); }
}

function stopPageAnimations(screen) {
  ['galaxyCanvas','lightningCanvas','rippleCanvas','bhCanvas','embersCanvas'].forEach(id => {
    const c = document.getElementById(id);
    if (c && c._animId) { cancelAnimationFrame(c._animId); }
  });
  ['sakura-layer','diamonds-layer','stand-eye','fw-canvas','cake-countdown-overlay'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
  // Remove floating HBD texts
  document.querySelectorAll('.hbd-float-text').forEach(el => el.remove());
  var cko = document.getElementById('cake-countdown-overlay'); if (cko) cko.remove();
}

// ════ FLOATING BG ORA/MUDA TEXT ════
const BG_WORDS = ['ORA','ORA','ORA','MUDA','MUDA','MUDA','ORA ORA ORA','MUDA MUDA MUDA','YARE YARE','WRYYYY','KONO GIORNO'];
const BG_COLORS = ['rgba(212,175,55,', 'rgba(199,125,255,', 'rgba(255,107,157,', 'rgba(0,212,216,', 'rgba(255,107,53,'];
function spawnBgText() {
  for (let i = 0; i < 22; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'bg-jojo-text';
      const word = BG_WORDS[Math.floor(Math.random()*BG_WORDS.length)];
      const col = BG_COLORS[Math.floor(Math.random()*BG_COLORS.length)];
      const op = (0.04 + Math.random()*0.06).toFixed(2);
      const sc = (0.7 + Math.random()*0.8).toFixed(2);
      const rot = ((Math.random()-0.5)*30).toFixed(1)+'deg';
      const dur = (18 + Math.random()*20).toFixed(1)+'s';
      const delay = (Math.random()*-15).toFixed(1)+'s';
      const fs = (12 + Math.random()*22).toFixed(0)+'px';
      el.textContent = word;
      el.style.cssText = `
        left:${Math.random()*95}%;
        font-size:${fs};
        color:${col}${op});
        --rot:${rot}; --sc:${sc}; --op:${op};
        animation-duration:${dur};
        animation-delay:${delay};
        letter-spacing:${(2+Math.random()*4).toFixed(0)}px;
      `;
      document.body.appendChild(el);
    }, i * 200);
  }
}
spawnBgText();
// respawn periodically
setInterval(spawnBgText, 40000);

// ════ STAR PARTICLES ════
function spawnStars() {
  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const s = document.createElement('div');
      s.className = 'star-particle';
      s.textContent = ['✦','✧','⭐','💫'][Math.floor(Math.random()*4)];
      s.style.left = Math.random()*100+'%';
      s.style.animationDuration = (8+Math.random()*12)+'s';
      s.style.animationDelay = (Math.random()*5)+'s';
      document.body.appendChild(s);
    }, i*300);
  }
}
spawnStars();

// ════ CINEMATIC ════
const cinemLines = [
  { text: '— A BIZARRE —', cls: 'purple', delay: 400 },
  { text: 'BIRTHDAY', cls: 'gold big', delay: 900 },
  { text: 'ADVENTURE', cls: 'gold big', delay: 1300 },
  { text: '✦ FOR SENA ✦', cls: 'purple', delay: 1900 },
];
let cinemDone = false;
function runCinematic() {
  const container = document.getElementById('cinemContent');
  cinemLines.forEach(({ text, cls, delay }) => {
    setTimeout(() => {
      if (cinemDone) return;
      const el = document.createElement('div');
      el.className = 'cinem-line ' + cls;
      el.textContent = text;
      el.style.animationDelay = '0s';
      container.appendChild(el);
    }, delay);
  });
  setTimeout(() => { if (cinemDone) return; const f = document.createElement('div'); f.className='cinem-flash'; document.getElementById('cinematic').appendChild(f); }, 2800);
  setTimeout(() => finishCinematic(), 3300);
}
function finishCinematic() {
  if (cinemDone) return;
  cinemDone = true;
  const cin = document.getElementById('cinematic');
  cin.classList.add('fade-out');
  setTimeout(() => { cin.style.display='none'; }, 1200);
  document.getElementById('loading').classList.add('active');
  currentScreen = 'loading';
  setTimeout(() => nextScreen('start'), 1500);
}
function skipCinematic() { finishCinematic(); }
runCinematic();

// ════ COUNTDOWN ════
// Birthday: 26 May 2005
function animateCountdown() {
  // Sena turns 21 on 26 May 2026 — show 21 years
  const lastBirthday = new Date('2026-06-26');
  const now = new Date();
  const sinceLastBD = now - lastBirthday;
  const years = 21;
  // Days and hours since her 21st birthday
  const daysAlive = Math.floor(sinceLastBD >= 0 ? sinceLastBD/(1000*60*60*24) : 0);
  const hoursAlive = Math.floor(sinceLastBD >= 0 ? (sinceLastBD%(1000*60*60*24))/(1000*60*60) : 0);
  animNum('years', years);
  animNum('days',  daysAlive);
  animNum('hours', hoursAlive);
}
function animNum(id, target) {
  let cur=0; const inc=Math.ceil(target/50);
  const iv=setInterval(()=>{ cur=Math.min(cur+inc,target); document.getElementById(id).textContent=cur; if(cur>=target)clearInterval(iv); },30);
}

// ════ LETTER ════
const letter=`Yare Yare Daze... you found it! 🌟\n\nSo instead of a boring "Happy Birthday" message, I went full JoJo.\n\nYou are someone who never gives up — like Giorno's dream, like Josuke's kindness, like Jonathan's honour. 💜Jotaro never admits what he feels. I'm trying not to be him. 💜\n\nEvery part of knowing you has been its own bizarre adventure.\n\nHope this made you smile, Sena.\n\nHappy Birthday — may your Stand grow ever stronger! 🌟`;
let charIdx=0;
function typeMessage() {
  const el=document.getElementById('typedText');
  el.innerHTML=''; charIdx=0;
  function type(){ if(charIdx<letter.length){ el.innerHTML+=letter[charIdx]==='\n'?'<br>':letter[charIdx]; charIdx++; setTimeout(type,35); } }
  type();
}

// ════ CANDLE ════
let candleBlown = false;
let cakeCountdownDone = false;

function injectCakeStyles() {
  if (document.getElementById('cake-count-style')) return;
  var st = document.createElement('style');
  st.id = 'cake-count-style';
  st.textContent = [
    '@keyframes cakeCountPop {',
    '  0%   { transform:scale(0.2) rotate(-10deg); opacity:0; }',
    '  55%  { transform:scale(1.15) rotate(3deg);  opacity:1; }',
    '  100% { transform:scale(1)    rotate(0deg);  opacity:0.95; }',
    '}',
    '@keyframes cakeCountFade {',
    '  0%   { opacity:0.95; transform:scale(1); }',
    '  100% { opacity:0;    transform:scale(1.3); }',
    '}',
    '@keyframes hbdDrift {',
    '  0%   { transform:translateY(0)     rotate(var(--hr)); opacity:0; }',
    '  8%   { opacity:var(--hop); }',
    '  88%  { opacity:var(--hop); }',
    '  100% { transform:translateY(-100vh) rotate(calc(var(--hr) + 15deg)); opacity:0; }',
    '}'
  ].join('\n');
  document.head.appendChild(st);
}

// Called automatically when cake screen opens — counts 3 2 1 then shows candle instruction
function startCakeCountdown() {
  injectCakeStyles();
  cakeCountdownDone = false;

  var overlay = document.createElement('div');
  overlay.id = 'cake-countdown-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;pointer-events:none;background:rgba(10,0,16,0.6);';
  document.body.appendChild(overlay);

  var count = 3;

  function showNum() {
    // Clear previous
    overlay.innerHTML = '';

    if (count <= 0) {
      // Show "MAKE A WISH!" text then fade overlay
      var wish = document.createElement('div');
      wish.textContent = 'MAKE A WISH!';
      wish.style.cssText = [
        'font-family:"Bebas Neue",cursive;',
        'font-size:clamp(36px,10vw,72px);',
        'background:linear-gradient(135deg,#D4AF37,#C77DFF,#FF6B9D);',
        '-webkit-background-clip:text;',
        '-webkit-text-fill-color:transparent;',
        'background-clip:text;',
        'letter-spacing:6px;',
        'animation:cakeCountPop 0.7s ease forwards;',
        'text-align:center;',
        'padding:0 20px;'
      ].join('');
      overlay.appendChild(wish);
      setTimeout(function() {
        overlay.style.transition = 'opacity 0.6s ease';
        overlay.style.opacity = '0';
        setTimeout(function() {
          overlay.remove();
          cakeCountdownDone = true;
        }, 700);
      }, 1200);
      return;
    }

    var num = document.createElement('div');
    num.textContent = count;
    num.style.cssText = [
      'font-family:"Bebas Neue",cursive;',
      'font-size:clamp(110px,30vw,220px);',
      'background:linear-gradient(135deg,#D4AF37,#C77DFF,#FF6B9D);',
      '-webkit-background-clip:text;',
      '-webkit-text-fill-color:transparent;',
      'background-clip:text;',
      'line-height:1;',
      'animation:cakeCountPop 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards;'
    ].join('');
    overlay.appendChild(num);

    // Fade out before next number
    setTimeout(function() {
      num.style.animation = 'cakeCountFade 0.25s ease forwards';
    }, 700);

    count--;
    setTimeout(showNum, 1000);
  }

  showNum();
}

// Called when user taps candle
function blowCandle() {
  if (candleBlown) return;
  candleBlown = true;

  // Blow the flame
  document.getElementById('flame').classList.add('blown');
  flashScreen();

  // Fireworks + slow HBD text
  startFireworksAndText();

  setTimeout(function() {
    document.getElementById('cakeNext').classList.remove('hidden');
  }, 2000);
}

function startFireworksAndText() {
  initFireworks();
  spawnHBDText();
}

// ── Slow floating "Happy Birthday to You" only ──
var HBD_LINES = [
  'Happy Birthday'
];
var HBD_COLORS_LIST = [
  [212,175,55],
  [199,125,255],
  [255,107,157],
  [245,208,96],
  [0,212,216]
];

function spawnHBDText() {
  injectCakeStyles();
  if (currentScreen !== 'cake') return; // only on cake page
  var total = 20;
  for (var i = 0; i < total; i++) {
    (function(idx) {
      setTimeout(function() {
        var el = document.createElement('div');
        el.className = 'hbd-float-text';

        // Always "Happy Birthday to You" lines only
        var line = HBD_LINES[idx % HBD_LINES.length];
        var col  = HBD_COLORS_LIST[Math.floor(Math.random() * HBD_COLORS_LIST.length)];
        var opacity = (0.25 + Math.random() * 0.35).toFixed(2);
        var rot  = ((Math.random() - 0.5) * 14).toFixed(1); // slight tilt only
        var dur  = (14 + Math.random() * 10).toFixed(1);    // slow — 14 to 24s
        var fs   = (16 + Math.random() * 18).toFixed(0);    // readable size
        var colorStr = 'rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',' + opacity + ')';

        el.textContent = line;
        el.style.position   = 'fixed';
        el.style.left       = (Math.random() * 80) + '%';
        el.style.top        = (60 + Math.random() * 50) + '%'; // start from lower half
        el.style.fontFamily = "'Playfair Display', serif";     // elegant italic font
        el.style.fontStyle  = 'italic';
        el.style.fontSize   = fs + 'px';
        el.style.color      = colorStr;
        el.style.letterSpacing = '2px';
        el.style.pointerEvents = 'none';
        el.style.zIndex     = '50';
        el.style.setProperty('--hr',  rot + 'deg');
        el.style.setProperty('--hop', opacity);
        el.style.animation  = 'hbdDrift ' + dur + 's linear forwards';
        el.style.animationDelay = (idx * 0.8).toFixed(1) + 's';
        el.style.whiteSpace = 'nowrap';
        el.style.textShadow = '0 0 20px rgba(' + col[0] + ',' + col[1] + ',' + col[2] + ',0.4)';
        document.body.appendChild(el);
        setTimeout(function() { if (el.parentNode) el.remove(); }, (parseFloat(dur) + parseFloat(idx * 0.8) + 2) * 1000);
      }, idx * 800); // staggered — one every 0.8s
    })(i);
  }
}

function flashScreen() {
  const f=document.createElement('div'); f.className='attack-flash';
  document.body.appendChild(f); setTimeout(()=>f.remove(),400);
}
function spawnOra(x,y,text) {
  const el=document.createElement('div'); el.className='ora-text';
  el.textContent=text||'ORA!'; el.style.left=(x-60)+'px'; el.style.top=(y-40)+'px';
  document.body.appendChild(el); setTimeout(()=>el.remove(),900);
}

// ════ STAND CARD ════
const STAND_STATS=[
  {label:'POWER',   val:'∞',  fill:'100%',color:'linear-gradient(90deg,#3A00FF,#C77DFF)'},
  {label:'SPEED',   val:'S+', fill:'95%', color:'linear-gradient(90deg,#D4AF37,#FF6B35)'},
  {label:'RANGE',   val:'∞',  fill:'100%',color:'linear-gradient(90deg,#3A00FF,#00D4D8)'},
  {label:'STAMINA', val:'A',  fill:'88%', color:'linear-gradient(90deg,#7B2FBE,#C77DFF)'},
  {label:'PRECISION',val:'S', fill:'90%', color:'linear-gradient(90deg,#D4AF37,#F5D060)'},
  {label:'POTENTIAL',val:'GOD',fill:'100%',color:'linear-gradient(90deg,#FF6B35,#D4AF37)'},
];
function animateStandCard() {
  const el=document.getElementById('scStats'); el.innerHTML='';
  STAND_STATS.forEach((s,i)=>{
    const row=document.createElement('div'); row.className='sc-stat-row';
    row.innerHTML=`<span class="sc-stat-label">${s.label}</span><div class="sc-stat-bar-bg"><div class="sc-stat-bar-fill" style="width:${s.fill};background:${s.color};animation-delay:${i*.15+.3}s;"></div></div><span class="sc-stat-val">${s.val}</span>`;
    el.appendChild(row);
  });
  const visual=document.getElementById('scVisual');
  for(let i=0;i<5;i++){
    setTimeout(()=>{
      const w=document.createElement('div'); w.className='sc-wormhole';
      const sz=10+Math.random()*30;
      w.style.cssText=`width:${sz}px;height:${sz}px;left:${10+Math.random()*80}%;top:${10+Math.random()*80}%;--tx:${(Math.random()-.5)*60}px;--ty:${(Math.random()-.5)*60}px;animation-duration:${2+Math.random()*2}s;animation-delay:${Math.random()}s;`;
      visual.appendChild(w);
    },i*400);
  }
}

// ════ ENVELOPE ════
// ✏️ REPLACE THIS with your message to Sena
const envelopeMessage=`Hey Sena! 🌟
Happy Birthday! You are one of the most amazing people I know.
You are positive,hardworking,sweet and a lil dumb to wwww.
But overall you are the most unique person i have ever met.
Every moment with you has been a bizarre adventure worth having. 💜
just drink in limit,you dont have to compete with zoro in drinking haha
and be healthy
Stay weird. Stay golden. Stay YOU. 💜`;
let envelopeOpened=false;
function setupEnvelope(){ envelopeOpened=false; }
function openEnvelope(){
  if(envelopeOpened)return; envelopeOpened=true;
  flashScreen(); launchConfetti();
  setTimeout(()=>{
    document.getElementById('envelopeView').classList.add('hidden');
    document.getElementById('letterView').classList.remove('hidden');
    const el=document.getElementById('envelopeLetter'); el.innerHTML=''; let i=0;
    function t(){ if(i<envelopeMessage.length){ el.innerHTML+=envelopeMessage[i]==='\n'?'<br>':envelopeMessage[i]; i++; setTimeout(t,30); } }
    t();
  },700);
}

// ════ SLOT MACHINE ════
const SLOT_SYMBOLS=['🌟','💜','✨','🕳️','⭐','🔮','💫','🎂','🌀','💎','🏆','🎉'];
const SLOT_WINS=[
  {match:['🌟','🌟','🌟'],msg:'「 THE STARS ALIGN! 」✨ You are destined for an incredible year!',type:'jackpot'},
  {match:['💎','💎','💎'],msg:'「 DIAMOND IS UNBREAKABLE! 」💎 Your resolve cannot be shaken!',type:'jackpot'},
  {match:['🏆','🏆','🏆'],msg:'「 GOLDEN EXPERIENCE! 」🏆 Victory is yours this year!',type:'jackpot'},
  {match:['🎂','🎂','🎂'],msg:'「 IT\'S YOUR DAY! 」🎂 The universe celebrates you!',type:'jackpot'},
  {match:null,msg:'「 FORTUNE SMILES... 」💜 Great things are coming your way!',type:'match2'},
  {match:null,msg:'「 THE VOID WHISPERS... 」🕳️ A mysterious blessing approaches!',type:'near'},
  {match:null,msg:'「 YARE YARE DAZE 」✦ Even Jotaro approves of your fate!',type:'miss'},
];
let spinsLeft=3,slotSpinning=false;
function startSlot(){
  spinsLeft=3; slotSpinning=false;
  document.getElementById('spinsLeft').textContent=3;
  document.getElementById('slotNext').classList.add('hidden');
  document.getElementById('slotMsg').textContent='「 Fate awaits... 」';
  document.getElementById('slotResult').className='slot-result';
  ['face0','face1','face2'].forEach(id=>{ document.getElementById(id).textContent=SLOT_SYMBOLS[Math.floor(Math.random()*SLOT_SYMBOLS.length)]; });
}
function spinSlot(){
  if(slotSpinning||spinsLeft<=0)return;
  slotSpinning=true; spinsLeft--;
  document.getElementById('spinsLeft').textContent=spinsLeft;
  const results=[0,1,2].map(()=>SLOT_SYMBOLS[Math.floor(Math.random()*SLOT_SYMBOLS.length)]);
  if(spinsLeft===0&&Math.random()>.5){ const j=['🌟','💎','🏆','🎂'][Math.floor(Math.random()*4)]; results[0]=results[1]=results[2]=j; }
  [0,1,2].forEach(i=>{
    const face=document.getElementById('face'+i);
    face.classList.remove('land'); face.classList.add('spinning');
    let n=0; const max=12+i*8;
    const iv=setInterval(()=>{
      face.textContent=SLOT_SYMBOLS[Math.floor(Math.random()*SLOT_SYMBOLS.length)]; n++;
      if(n>=max){ clearInterval(iv); face.classList.remove('spinning'); face.textContent=results[i]; face.classList.add('land'); if(i===2)resolveSlot(results); }
    },80);
  });
}
function resolveSlot(results){
  slotSpinning=false;
  const msgEl=document.getElementById('slotMsg'),resEl=document.getElementById('slotResult');
  const isJ=results[0]===results[1]&&results[1]===results[2];
  const is2=results[0]===results[1]||results[1]===results[2]||results[0]===results[2];
  let out;
  if(isJ){ out=SLOT_WINS.find(w=>w.match&&w.match[0]===results[0])||SLOT_WINS.find(w=>w.type==='jackpot'); launchConfetti(); flashScreen(); spawnOra(window.innerWidth/2,window.innerHeight/3,'ORA ORA ORA!'); resEl.className='slot-result win'; }
  else if(is2){ out=SLOT_WINS.find(w=>w.type==='match2'); resEl.className='slot-result win'; }
  else{ out=SLOT_WINS[Math.floor(Math.random()*2)+5]; resEl.className='slot-result'; }
  msgEl.style.color=isJ?'var(--gold-light)':is2?'var(--purple-light)':'rgba(255,248,231,.5)';
  msgEl.style.fontFamily="'Bebas Neue',cursive"; msgEl.style.letterSpacing='1px'; msgEl.style.fontSize='13px';
  msgEl.textContent=out.msg;
  if(spinsLeft<=0) setTimeout(()=>document.getElementById('slotNext').classList.remove('hidden'),600);
}

// ════ CURSOR GLITTER ════
const GCOLS=['#D4AF37','#F5D060','#C77DFF','#7B2FBE','#FF6B9D','#00D4D8','#FF6B35','#fff','#3A00FF'];
const GSHAPES=['✦','✧','◆','●','★','•'];
let lastGT=0;
document.addEventListener('mousemove',e=>{
  const now=Date.now(); if(now-lastGT<30)return; lastGT=now;
  const count=Math.floor(Math.random()*2)+1;
  for(let k=0;k<count;k++){
    const g=document.createElement('div'); g.className='glitter';
    const sz=6+Math.random()*10; const col=GCOLS[Math.floor(Math.random()*GCOLS.length)];
    const dur=.5+Math.random()*.7; const gx=(Math.random()-.5)*60; const gy=(Math.random()-.5)*60-20; const gr=(Math.random()-.5)*360+'deg';
    if(Math.random()>.4){
      g.style.cssText=`left:${e.clientX+(Math.random()-.5)*12}px;top:${e.clientY+(Math.random()-.5)*12}px;font-size:${sz}px;color:${col};width:auto;height:auto;border-radius:0;--gx:${gx}px;--gy:${gy}px;--gr:${gr};animation-duration:${dur}s;text-shadow:0 0 6px ${col};`;
      g.textContent=GSHAPES[Math.floor(Math.random()*GSHAPES.length)];
    } else {
      const ds=3+Math.random()*5;
      g.style.cssText=`left:${e.clientX+(Math.random()-.5)*10}px;top:${e.clientY+(Math.random()-.5)*10}px;width:${ds}px;height:${ds}px;background:${col};box-shadow:0 0 ${ds*2}px ${col};--gx:${gx}px;--gy:${gy}px;--gr:${gr};animation-duration:${dur}s;`;
    }
    document.body.appendChild(g); setTimeout(()=>g.remove(),dur*1000+100);
  }
});

// ════ CLICK SPARKLES ════
document.addEventListener('click',e=>{
  if(Math.random()>.6){ const el=document.createElement('div'); el.style.cssText=`position:fixed;left:${e.clientX-6}px;top:${e.clientY-6}px;font-size:14px;color:var(--gold);pointer-events:none;z-index:99999;animation:oraBurst .6s ease-out forwards;`; el.textContent=['✦','✧','💫'][Math.floor(Math.random()*3)]; document.body.appendChild(el); setTimeout(()=>el.remove(),700); }
});

// ════ SCROLL ════
function openBottle(){ flashScreen(); launchConfetti(); setTimeout(()=>nextScreen('zodiac'),900); }

// ════ CONFETTI ════
const canvas=document.getElementById('confetti'),ctx=canvas.getContext('2d');
canvas.width=window.innerWidth; canvas.height=window.innerHeight;
window.addEventListener('resize',()=>{canvas.width=window.innerWidth;canvas.height=window.innerHeight;});
function launchConfetti(){
  const colors=['#D4AF37','#F5D060','#7B2FBE','#C77DFF','#FF6B35','#FF6B9D','#00D4D8','#3A00FF'];
  const pieces=Array.from({length:180},()=>({x:Math.random()*canvas.width,y:-20,vx:(Math.random()-.5)*5,vy:Math.random()*3+2,r:Math.random()*7+3,c:colors[Math.floor(Math.random()*colors.length)],rot:Math.random()*360,shape:Math.random()>.5?'rect':'diamond'}));
  function animate(){ ctx.clearRect(0,0,canvas.width,canvas.height); let alive=false; pieces.forEach(p=>{ ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot*Math.PI/180); ctx.fillStyle=p.c; if(p.shape==='diamond'){ctx.beginPath();ctx.moveTo(0,-p.r);ctx.lineTo(p.r,0);ctx.lineTo(0,p.r);ctx.lineTo(-p.r,0);ctx.closePath();ctx.fill();}else{ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*1.5);} ctx.restore(); p.x+=p.vx;p.y+=p.vy;p.vy+=.08;p.rot+=4; if(p.y<canvas.height)alive=true; }); if(alive)requestAnimationFrame(animate); else ctx.clearRect(0,0,canvas.width,canvas.height); }
  animate();
}

// ════ REPLAY ════
function replay(){
  candleBlown=false; cakeCountdownDone=false; charIdx=0; envelopeOpened=false; spinsLeft=3; slotSpinning=false;
  // Stop heart
  if (heartAnimId) { cancelAnimationFrame(heartAnimId); heartAnimId = null; }
  if (heartRenderer) { heartRenderer.dispose(); heartRenderer = null; }
  document.getElementById('typedText').innerHTML='';
  document.getElementById('flame').classList.remove('blown');
  document.getElementById('cakeNext').classList.add('hidden');
  document.getElementById('envelopeView').classList.remove('hidden');
  document.getElementById('letterView').classList.add('hidden');
  ctx.clearRect(0,0,canvas.width,canvas.height);
  cinemDone=false;
  document.getElementById('cinematic').style.display='flex';
  document.getElementById('cinematic').classList.remove('fade-out');
  document.getElementById('cinemContent').innerHTML='';
  nextScreen('loading');
  runCinematic();
}
// ════════════════════════════════
// 3D PARTICLE HEART — Three.js
// ════════════════════════════════
let heartRenderer, heartScene, heartCamera, heartParticles, heartAnimId;
let heartDragging = false;
let heartPrevX = 0, heartPrevY = 0;
let heartRotX = 0.3, heartRotY = 0;
let heartTouch = null;

function initHeart() {
  const canvas = document.getElementById('heartCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // Clean up previous instance
  if (heartRenderer) {
    cancelAnimationFrame(heartAnimId);
    heartRenderer.dispose();
  }

  const section = document.getElementById('final');
  const W = section.offsetWidth || window.innerWidth;
  const H = section.offsetHeight || window.innerHeight;

  // Scene
  heartScene = new THREE.Scene();

  // Camera
  heartCamera = new THREE.PerspectiveCamera(60, W / H, 0.1, 5000);
  heartCamera.position.z = 420;

  // Renderer
  heartRenderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  heartRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  heartRenderer.setSize(W, H);
  heartRenderer.setClearColor(0x000000, 0);

  // ── Build heart shape points ──
  const NUM = 6000;
  const positions = new Float32Array(NUM * 3);
  const colors = new Float32Array(NUM * 3);

  // Heart parametric formula
  function heartPoint(t, spread) {
    const s = spread || 0;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
    return { x, y };
  }

  for (let i = 0; i < NUM; i++) {
    // Random point on / near heart surface
    const t = Math.random() * Math.PI * 2;
    const r = 1 + (Math.random() - 0.5) * 0.25; // slight thickness
    const h = heartPoint(t);

    // Add z depth — particles scatter slightly in 3D
    const zOff = (Math.random() - 0.5) * 6;

    positions[i * 3]     = h.x * r * 11;
    positions[i * 3 + 1] = h.y * r * 11;
    positions[i * 3 + 2] = zOff;

    // Color — pink/magenta/gold gradient based on y position
    const frac = (h.y + 14) / 28; // 0..1
    const c = new THREE.Color();
    if (frac < 0.4) {
      c.setHSL(0.85, 0.9, 0.45 + frac * 0.4); // deep pink → hot pink
    } else if (frac < 0.75) {
      c.setHSL(0.83, 1.0, 0.65); // bright magenta
    } else {
      c.setHSL(0.75, 0.8, 0.7 + frac * 0.2); // lavender/gold tips
    }
    // Occasionally gold sparkle
    if (Math.random() < 0.04) c.setRGB(0.83, 0.69, 0.22);
    // Occasional bright white core
    if (Math.random() < 0.01) c.setRGB(1, 0.9, 1);

    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const mat = new THREE.PointsMaterial({
    size: 2.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.88,
    sizeAttenuation: true,
    depthWrite: false,
  });

  heartParticles = new THREE.Points(geo, mat);
  heartParticles.rotation.x = heartRotX;
  heartParticles.rotation.y = heartRotY;
  heartScene.add(heartParticles);

  // ── Interaction ──
  canvas.addEventListener('mousedown', e => { heartDragging = true; heartPrevX = e.clientX; heartPrevY = e.clientY; });
  window.addEventListener('mouseup', () => { heartDragging = false; });
  window.addEventListener('mousemove', e => {
    if (!heartDragging) return;
    const dx = e.clientX - heartPrevX;
    const dy = e.clientY - heartPrevY;
    heartRotY += dx * 0.008;
    heartRotX += dy * 0.008;
    heartPrevX = e.clientX;
    heartPrevY = e.clientY;
  });

  // Touch
  canvas.addEventListener('touchstart', e => {
    heartTouch = e.touches[0];
    heartPrevX = heartTouch.clientX;
    heartPrevY = heartTouch.clientY;
  }, { passive: true });
  canvas.addEventListener('touchmove', e => {
    if (!e.touches[0]) return;
    const dx = e.touches[0].clientX - heartPrevX;
    const dy = e.touches[0].clientY - heartPrevY;
    heartRotY += dx * 0.008;
    heartRotX += dy * 0.008;
    heartPrevX = e.touches[0].clientX;
    heartPrevY = e.touches[0].clientY;
  }, { passive: true });

  // Resize
  window.addEventListener('resize', () => {
    if (currentScreen !== 'final') return;
    const s = document.getElementById('final');
    heartRenderer.setSize(s.offsetWidth, s.offsetHeight);
    heartCamera.aspect = s.offsetWidth / s.offsetHeight;
    heartCamera.updateProjectionMatrix();
  });

  // ── Animate ──
  let autoRot = 0;
  function animateHeart() {
    heartAnimId = requestAnimationFrame(animateHeart);
    autoRot += 0.004;
    // Gentle auto-rotation when not dragging
    if (!heartDragging && !heartTouch) {
      heartRotY += 0.004;
    }
    heartParticles.rotation.x = heartRotX;
    heartParticles.rotation.y = heartRotY;

    // Gentle pulse scale
    const pulse = 1 + Math.sin(autoRot * 1.2) * 0.025;
    heartParticles.scale.set(pulse, pulse, pulse);

    heartRenderer.render(heartScene, heartCamera);
  }
  animateHeart();
}

// Hook into screen navigation — start heart when final screen is shown

// ══════════════════════════════════════════
// PAGE ANIMATIONS
// ══════════════════════════════════════════

// ── Helper: get canvas context sized to section ──
function setupCanvas(id, sectionId) {
  const c = document.getElementById(id);
  const s = document.getElementById(sectionId || id.replace('Canvas',''));
  if (!c || !s) return null;
  c.width  = s.offsetWidth  || window.innerWidth;
  c.height = s.offsetHeight || window.innerHeight;
  return { c, ctx: c.getContext('2d'), W: c.width, H: c.height };
}

// ════════════════════════════════
// PART I — GALAXY WARP (Start)
// ════════════════════════════════
function initGalaxy() {
  const r = setupCanvas('galaxyCanvas','start');
  if (!r) return;
  const {c, ctx, W, H} = r;
  const NUM = 220;
  const stars = Array.from({length: NUM}, () => ({
    x: (Math.random()-0.5)*W*2, y: (Math.random()-0.5)*H*2,
    z: Math.random()*W,
    pz: 0,
    hue: Math.random()*60 + 260 // purple to gold range
  }));
  function frame() {
    c._animId = requestAnimationFrame(frame);
    ctx.fillStyle = 'rgba(5,0,12,0.25)';
    ctx.fillRect(0,0,W,H);
    const cx = W/2, cy = H/2;
    stars.forEach(s => {
      s.pz = s.z;
      s.z  -= 6;
      if (s.z <= 0) { s.x=(Math.random()-0.5)*W*2; s.y=(Math.random()-0.5)*H*2; s.z=W; s.pz=W; }
      const sx  = (s.x/s.z)*W  + cx;
      const sy  = (s.y/s.z)*H  + cy;
      const px  = (s.x/s.pz)*W + cx;
      const py  = (s.y/s.pz)*H + cy;
      const size = Math.max(0.3, (1-s.z/W)*3.5);
      const bright = Math.floor((1-s.z/W)*255);
      ctx.strokeStyle = `hsl(${s.hue},80%,${50+bright/5}%)`;
      ctx.lineWidth = size;
      ctx.globalAlpha = (1-s.z/W)*0.9;
      ctx.beginPath(); ctx.moveTo(px,py); ctx.lineTo(sx,sy); ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }
  frame();
}

// ════════════════════════════════
// PART II — LIGHTNING (Countdown)
// ════════════════════════════════
function initLightning() {
  const r = setupCanvas('lightningCanvas','countdown');
  if (!r) return;
  const {c, ctx, W, H} = r;
  let timer = 0;
  function bolt(x1,y1,x2,y2,depth) {
    if (depth<=0) return;
    const mx=(x1+x2)/2+(Math.random()-0.5)*(Math.hypot(x2-x1,y2-y1)*0.5);
    const my=(y1+y2)/2+(Math.random()-0.5)*(Math.hypot(x2-x1,y2-y1)*0.5);
    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(mx,my); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(mx,my); ctx.lineTo(x2,y2); ctx.stroke();
    if (Math.random()<0.4) bolt(mx,my,mx+(Math.random()-0.5)*80,my+40+Math.random()*60,depth-1);
    bolt(x1,y1,mx,my,depth-1);
    bolt(mx,my,x2,y2,depth-1);
  }
  function frame() {
    c._animId = requestAnimationFrame(frame);
    timer++;
    ctx.clearRect(0,0,W,H);
    if (timer % 18 < 4) {
      const x = Math.random()*W;
      ctx.shadowBlur = 18;
      ctx.shadowColor = '#C77DFF';
      ctx.strokeStyle = `rgba(199,125,255,${0.4+Math.random()*0.5})`;
      ctx.lineWidth = 1.2;
      bolt(x, 0, x+(Math.random()-0.5)*120, H*0.7, 5);
      // Gold bolt occasionally
      if (Math.random()<0.3) {
        ctx.strokeStyle = `rgba(212,175,55,0.5)`;
        ctx.shadowColor = '#D4AF37';
        bolt(Math.random()*W,0,Math.random()*W,H*0.5,4);
      }
      ctx.shadowBlur = 0;
    }
  }
  frame();
}

// ════════════════════════════════
// PART III — SAKURA PETALS (Letter)
// ════════════════════════════════
function initSakura() {
  const section = document.getElementById('letter');
  if (!section || document.getElementById('sakura-layer')) return;
  const layer = document.createElement('div');
  layer.id = 'sakura-layer';
  section.insertBefore(layer, section.firstChild);
  const PETALS = ['🌸','🌺','🌷','💮','🏵️'];
  for (let i=0; i<22; i++) {
    setTimeout(()=>{
      const p = document.createElement('div');
      p.className = 'sakura-petal';
      p.textContent = PETALS[Math.floor(Math.random()*PETALS.length)];
      const sx = (Math.random()-0.5)*200+'px';
      p.style.cssText = `
        left:${Math.random()*100}%;
        --sx:${sx};
        font-size:${12+Math.random()*14}px;
        animation-duration:${5+Math.random()*8}s;
        animation-delay:${Math.random()*-6}s;
        opacity:${0.4+Math.random()*0.5};
      `;
      layer.appendChild(p);
    }, i*120);
  }
}

// ════════════════════════════════
// PART IV — FIREWORKS (Cake)
// ════════════════════════════════
let fwAnimId = null;
function initFireworks() {
  const section = document.getElementById('cake');
  if (!section) return;
  let fw = document.getElementById('fw-canvas');
  if (!fw) {
    fw = document.createElement('canvas');
    fw.id = 'fw-canvas';
    fw.className = 'page-canvas';
    fw.style.pointerEvents = 'none';
    section.insertBefore(fw, section.firstChild);
  }
  fw.width  = section.offsetWidth  || window.innerWidth;
  fw.height = section.offsetHeight || window.innerHeight;
  const ctx = fw.getContext('2d');
  const W = fw.width, H = fw.height;
  const particles = [];

  function spawnFW() {
    const x = W*0.15 + Math.random()*W*0.7;
    const y = H*0.1  + Math.random()*H*0.4;
    const hue = Math.random()*360;
    const count = 55+Math.floor(Math.random()*40);
    for (let i=0;i<count;i++) {
      const angle = (Math.PI*2/count)*i + Math.random()*0.3;
      const speed = 1.5+Math.random()*3.5;
      particles.push({
        x,y,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed - 0.5,
        life: 1, decay: 0.015+Math.random()*0.015,
        hue: hue+Math.random()*40-20,
        size: 2+Math.random()*2
      });
    }
  }

  let fwTimer = 0;
  function frame() {
    fwAnimId = requestAnimationFrame(frame);
    fw._animId = fwAnimId;
    ctx.fillStyle = 'rgba(5,0,12,0.18)';
    ctx.fillRect(0,0,W,H);
    fwTimer++;
    if (fwTimer % 45 === 0) spawnFW();
    for (let i=particles.length-1;i>=0;i--) {
      const p=particles[i];
      p.x+=p.vx; p.y+=p.vy; p.vy+=0.06; p.vx*=0.98; p.life-=p.decay;
      if(p.life<=0){particles.splice(i,1);continue;}
      ctx.globalAlpha=p.life*0.9;
      ctx.fillStyle=`hsl(${p.hue},90%,65%)`;
      ctx.shadowColor=`hsl(${p.hue},90%,65%)`;
      ctx.shadowBlur=6;
      ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);ctx.fill();
    }
    ctx.globalAlpha=1; ctx.shadowBlur=0;
  }
  // Start firing after a tiny delay
  setTimeout(()=>{ spawnFW(); frame(); }, 100);
}

// ════════════════════════════════
// PART VI — RIPPLE WAVES (Timeline)
// ════════════════════════════════
function initRipple() {
  const r = setupCanvas('rippleCanvas','timeline');
  if (!r) return;
  const {c, ctx, W, H} = r;
  let t=0;
  function frame() {
    c._animId = requestAnimationFrame(frame);
    t += 0.018;
    ctx.clearRect(0,0,W,H);
    for (let i=0;i<5;i++) {
      const phase = t + i*(Math.PI*2/5);
      const radius = 60 + i*55 + Math.sin(phase)*15;
      const alpha  = 0.06 - i*0.01;
      ctx.beginPath();
      ctx.arc(W/2, H/2, radius, 0, Math.PI*2);
      ctx.strokeStyle = i%2===0
        ? `rgba(212,175,55,${alpha})`
        : `rgba(199,125,255,${alpha})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    // Horizontal wave lines
    for (let y=0;y<H;y+=38) {
      ctx.beginPath();
      for (let x=0;x<=W;x+=4) {
        const wy = y + Math.sin(x*0.015+t+y*0.02)*8;
        x===0 ? ctx.moveTo(x,wy) : ctx.lineTo(x,wy);
      }
      ctx.strokeStyle = 'rgba(212,175,55,0.04)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
  frame();
}

// ════════════════════════════════
// PART VII — FLOATING DIAMONDS (Memories)
// ════════════════════════════════
function initDiamonds() {
  const section = document.getElementById('memories');
  if (!section || document.getElementById('diamonds-layer')) return;
  const layer = document.createElement('div');
  layer.id = 'diamonds-layer';
  section.insertBefore(layer, section.firstChild);
  const SHAPES = ['💎','✦','◆','⬡'];
  const COLORS = ['#D4AF37','#C77DFF','#00D4D8','#FF6B9D','#F5D060'];
  for (let i=0;i<18;i++) {
    const d = document.createElement('div');
    d.className = 'float-diamond';
    const col = COLORS[Math.floor(Math.random()*COLORS.length)];
    const sz  = 14+Math.random()*22;
    const dur = 4+Math.random()*5;
    const rot = Math.random()*360;
    const op  = 0.15+Math.random()*0.35;
    d.style.cssText = `
      left:${Math.random()*95}%;
      top:${Math.random()*90}%;
      font-size:${sz}px;
      color:${col};
      --dc:${col};
      --dr:${rot}deg;
      --dop:${op};
      animation-duration:${dur}s;
      animation-delay:${-Math.random()*dur}s;
      opacity:${op};
    `;
    d.textContent = SHAPES[Math.floor(Math.random()*SHAPES.length)];
    layer.appendChild(d);
  }
}

// ════════════════════════════════
// PART VIII — BLACK HOLE (Bottle/Scroll)
// ════════════════════════════════
function initBlackHole() {
  const r = setupCanvas('bhCanvas','bottle');
  if (!r) return;
  const {c, ctx, W, H} = r;
  const cx=W/2, cy=H/2;
  const particles = Array.from({length:160}, () => ({
    angle: Math.random()*Math.PI*2,
    radius: 80+Math.random()*Math.min(W,H)*0.38,
    speed:  0.004+Math.random()*0.012,
    size:   1+Math.random()*2.5,
    hue:    Math.random()*80+260,
    alpha:  0.3+Math.random()*0.6,
    inward: 0.18+Math.random()*0.25
  }));
  function frame() {
    c._animId = requestAnimationFrame(frame);
    ctx.fillStyle='rgba(5,0,12,0.2)';
    ctx.fillRect(0,0,W,H);
    // Black hole center
    const grad = ctx.createRadialGradient(cx,cy,0,cx,cy,70);
    grad.addColorStop(0,'rgba(0,0,0,0.95)');
    grad.addColorStop(0.5,'rgba(58,0,255,0.15)');
    grad.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=grad;
    ctx.beginPath();ctx.arc(cx,cy,70,0,Math.PI*2);ctx.fill();
    // Lensing ring
    ctx.strokeStyle='rgba(212,175,55,0.15)';
    ctx.lineWidth=2;
    ctx.beginPath();ctx.arc(cx,cy,72,0,Math.PI*2);ctx.stroke();

    particles.forEach(p => {
      p.angle += p.speed;
      p.radius -= p.inward;
      if (p.radius < 20) { p.radius=80+Math.random()*Math.min(W,H)*0.38; p.angle=Math.random()*Math.PI*2; }
      const x = cx + Math.cos(p.angle)*p.radius;
      const y = cy + Math.sin(p.angle)*p.radius*0.38; // elliptical
      const pull = 1 - (p.radius/220);
      ctx.globalAlpha = p.alpha*pull;
      ctx.fillStyle = `hsl(${p.hue},80%,65%)`;
      ctx.beginPath();ctx.arc(x,y,p.size*pull,0,Math.PI*2);ctx.fill();
    });
    ctx.globalAlpha=1;
  }
  frame();
}

// ════════════════════════════════
// PART IX — STAND EYE (Zodiac)
// ════════════════════════════════
let eyeX=0, eyeY=0;
function initStandEye() {
  const section = document.getElementById('zodiac');
  if (!section || document.getElementById('stand-eye')) return;
  const eye = document.createElement('div');
  eye.id = 'stand-eye';
  eye.style.cssText = `
    width:70px; height:70px;
    border-radius:50%;
    background: radial-gradient(circle at 35% 35%, #fff 0%, #C77DFF 30%, #4B0082 60%, #000 100%);
    box-shadow: 0 0 20px #C77DFF, 0 0 40px rgba(75,0,130,0.6), 0 0 60px rgba(199,125,255,0.3);
    border: 2px solid rgba(212,175,55,0.6);
    animation: eyePulse 3s ease-in-out infinite;
    left: 50%;
    top: 12px;
    transform: translateX(-50%);
    position: absolute;
    z-index: 1;
    pointer-events: none;
  `;
  // Add pupil
  const pupil = document.createElement('div');
  pupil.id = 'eye-pupil';
  pupil.style.cssText = `
    width:24px; height:24px;
    background: radial-gradient(circle, #000 60%, #1a0040);
    border-radius:50%;
    position:absolute;
    top:50%; left:50%;
    transform:translate(-50%,-50%);
    box-shadow: 0 0 8px rgba(0,0,0,0.8);
    transition: transform 0.06s ease;
  `;
  eye.appendChild(pupil);
  section.insertBefore(eye, section.firstChild);

  // Style injection for eye pulse
  if (!document.getElementById('eye-style')) {
    const st = document.createElement('style');
    st.id = 'eye-style';
    st.textContent = `@keyframes eyePulse{0%,100%{box-shadow:0 0 20px #C77DFF,0 0 40px rgba(75,0,130,.6)}50%{box-shadow:0 0 35px #C77DFF,0 0 70px rgba(199,125,255,.7),0 0 100px rgba(75,0,130,.4)}}`;
    document.head.appendChild(st);
  }

  // Follow cursor / touch
  function movePupil(cx, cy) {
    const rect = eye.getBoundingClientRect();
    const ex = rect.left + rect.width/2;
    const ey = rect.top  + rect.height/2;
    const dx = cx - ex;
    const dy = cy - ey;
    const dist = Math.min(Math.hypot(dx,dy), 14);
    const angle = Math.atan2(dy,dx);
    const px = Math.cos(angle)*dist;
    const py = Math.sin(angle)*dist;
    pupil.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px))`;
  }
  document.addEventListener('mousemove', e => movePupil(e.clientX, e.clientY));
  document.addEventListener('touchmove', e => {
    if (e.touches[0]) movePupil(e.touches[0].clientX, e.touches[0].clientY);
  }, {passive:true});
}

// ════════════════════════════════
// PART X — EMBERS / FIRE (Stand Card)
// ════════════════════════════════
function initEmbers() {
  const r = setupCanvas('embersCanvas','standCard');
  if (!r) return;
  const {c, ctx, W, H} = r;
  const embers = [];
  function spawnEmber() {
    embers.push({
      x: Math.random()*W,
      y: H + 10,
      vx: (Math.random()-0.5)*1.2,
      vy: -(0.8+Math.random()*2.2),
      life: 1,
      decay: 0.006+Math.random()*0.008,
      size: 1.5+Math.random()*3,
      hue: Math.random()<0.3 ? 45 : (Math.random()<0.5 ? 15 : 0), // gold / orange / red
    });
  }
  function frame() {
    c._animId = requestAnimationFrame(frame);
    ctx.fillStyle='rgba(5,0,12,0.12)';
    ctx.fillRect(0,0,W,H);
    if (Math.random()<0.35) spawnEmber();
    for (let i=embers.length-1;i>=0;i--) {
      const e=embers[i];
      e.x+=e.vx + Math.sin(e.life*8)*0.5;
      e.y+=e.vy;
      e.vy*=0.99;
      e.life-=e.decay;
      if(e.life<=0||e.y<-10){embers.splice(i,1);continue;}
      ctx.globalAlpha = e.life*0.85;
      ctx.fillStyle = `hsl(${e.hue},90%,${55+e.life*30}%)`;
      ctx.shadowColor = `hsl(${e.hue},90%,60%)`;
      ctx.shadowBlur  = 8;
      ctx.beginPath();
      ctx.arc(e.x,e.y,e.size*e.life,0,Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha=1; ctx.shadowBlur=0;
  }
  frame();
}
