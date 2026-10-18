// Effets visuels : confettis, transition de thème circulaire, feuille glissante, splash.
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Confettis / cœurs sur un canvas plein écran dans #app. opts: x,y (coordonnées écran), count, power, shape ('confetti'|'heart')
function confetti(opts){
  if(REDUCED) return;
  const host=document.getElementById('app'); if(!host) return;
  const box=host.getBoundingClientRect(), dpr=Math.min(2,window.devicePixelRatio||1);
  const cv=document.createElement('canvas');
  cv.className='fxcanvas'; cv.width=box.width*dpr; cv.height=box.height*dpr;
  host.appendChild(cv);
  const g=cv.getContext('2d'); g.scale(dpr,dpr);
  const css=getComputedStyle(document.documentElement);
  const colors=opts.shape==='heart'
    ? [css.getPropertyValue('--accent').trim()||'#c9402b','#f0a030','#2f7a4b','#ff8f7a']
    : ['#c9402b','#f0a030','#2f7a4b','#4c8bf5','#e8b4ff','#ffd166'];
  const ox=(opts.x??box.left+box.width/2)-box.left, oy=(opts.y??box.top+box.height/2)-box.top;
  const power=opts.power||10, n=opts.count||40;
  const ps=Array.from({length:n},()=>{
    const a=(opts.angle??-Math.PI/2)+(Math.random()-.5)*(opts.spread??Math.PI*1.2), v=power*(.45+Math.random()*.75);
    return {x:ox,y:oy,vx:Math.cos(a)*v,vy:Math.sin(a)*v,r:3+Math.random()*5,rot:Math.random()*6,vr:(Math.random()-.5)*.35,
      c:colors[(Math.random()*colors.length)|0],life:1,decay:.008+Math.random()*.01,sq:Math.random()<.5};
  });
  (function frame(){
    g.clearRect(0,0,box.width,box.height);
    let alive=false;
    for(const p of ps){
      p.vy+=.28; p.vx*=.985; p.vy*=.985; p.x+=p.vx; p.y+=p.vy; p.rot+=p.vr; p.life-=p.decay;
      if(p.life<=0||p.y>box.height+20) continue;
      alive=true; g.save(); g.globalAlpha=Math.min(1,p.life*2); g.translate(p.x,p.y); g.rotate(p.rot); g.fillStyle=p.c;
      if(opts.shape==='heart'){ g.font=(p.r*3.4)+'px system-ui'; g.textAlign='center'; g.textBaseline='middle'; g.fillText('♥',0,0); }
      else if(p.sq) g.fillRect(-p.r,-p.r/2,p.r*2,p.r);
      else { g.beginPath(); g.arc(0,0,p.r/1.5,0,6.3); g.fill(); }
      g.restore();
    }
    if(alive) requestAnimationFrame(frame); else cv.remove();
  })();
}

// Transition de thème en cercle qui s'étend depuis le bouton (View Transitions API), sinon changement direct.
function withReveal(fn,x,y){
  if(REDUCED||!document.startViewTransition){ fn(); return; }
  const r=document.documentElement;
  r.style.setProperty('--vx',x+'px'); r.style.setProperty('--vy',y+'px');
  document.startViewTransition(fn);
}

// Fermeture animée d'une feuille
function closeSheet(s){
  if(!s||s.dataset.closing) return;
  s.dataset.closing=1;
  const p=s.firstElementChild;
  if(REDUCED){ s.remove(); return; }
  p.style.animation='none';
  p.style.transition='transform .3s cubic-bezier(.4,0,.8,.4)';
  s.style.transition='background .3s'; s.style.background='transparent';
  requestAnimationFrame(()=>{ p.style.transform='translateY(105%)'; });
  setTimeout(()=>s.remove(),300);
}

// Feuille qui se ferme en la tirant vers le bas depuis son en-tête (.sh-head)
function sheetDrag(s){
  const p=s.firstElementChild, h=s.querySelector('.sh-head'); if(!h) return;
  let y0=null,dy=0,t0=0;
  h.addEventListener('pointerdown',e=>{y0=e.clientY;dy=0;t0=performance.now();h.setPointerCapture(e.pointerId);p.style.animation='none';p.style.transition='none'});
  h.addEventListener('pointermove',e=>{
    if(y0===null) return;
    dy=Math.max(0,e.clientY-y0);
    p.style.transform=`translateY(${dy}px)`;
    s.style.background=`rgba(20,12,5,${.55*(1-Math.min(1,dy/380))})`;
  });
  const end=()=>{
    if(y0===null) return;
    const v=dy/Math.max(1,performance.now()-t0); y0=null;
    if(dy>110||v>.6){ s.style.background=''; closeSheet(s); }
    else { p.style.transition='transform .45s cubic-bezier(.34,1.56,.64,1)'; p.style.transform=''; s.style.background=''; }
  };
  h.addEventListener('pointerup',end); h.addEventListener('pointercancel',end);
}

// Écran de lancement (une fois par session)
function splash(){
  try{ if(sessionStorage.getItem('splash')) return; sessionStorage.setItem('splash','1'); }catch(e){}
  if(REDUCED) return;
  const d=document.createElement('div'); d.id='splash';
  d.innerHTML='<div class="sp-plate"><span>🍝</span></div><div class="sp-logo">cosa mangio<b>?</b></div>';
  document.getElementById('app').appendChild(d);
  d.addEventListener('animationend',e=>{ if(e.target===d) d.remove(); });
  setTimeout(()=>d.remove(),2200);
}
