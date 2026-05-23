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
  document.getElementById(currentScreen).classList.remove('active');
  document.getElementById(screen).classList.add('active');
  currentScreen = screen;
  if (screen === 'countdown') animateCountdown();
  if (screen === 'letter') typeMessage();
  if (screen === 'jojoGame') startSlot();
  if (screen === 'standCard') animateStandCard();
  if (screen === 'envelope') setupEnvelope();
  if (screen === 'final') launchConfetti();
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
  const birthDate = new Date('2005-05-26');
  const now = new Date();
  const diff = now - birthDate;
  animNum('years', Math.floor(diff/(1000*60*60*24*365.25)));
  animNum('days',  Math.floor((diff%(1000*60*60*24*365.25))/(1000*60*60*24)));
  animNum('hours', Math.floor((diff%(1000*60*60*24))/(1000*60*60)));
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
let candleBlown=false;
function blowCandle() {
  if(candleBlown)return; candleBlown=true;
  document.getElementById('flame').classList.add('blown');
  flashScreen(); spawnOra(window.innerWidth/2,window.innerHeight/2,'ORA ORA ORA!');
  launchConfetti();
  setTimeout(()=>document.getElementById('cakeNext').classList.remove('hidden'),1200);
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
  candleBlown=false; charIdx=0; envelopeOpened=false; spinsLeft=3; slotSpinning=false;
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