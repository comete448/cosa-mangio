const TXT = {
 it:{tonight:'Stasera',menu:'Menu',fridge:'Frigo',list:'Spesa',title:'Cosa mangio stasera?',sub:'Scorri: ♥ lo faccio, ✕ un\'altra idea',min:'min',
   empty:'Hai visto tutte le idee 🎉',again:'Ricomincia',fridgeT:'Cosa hai in casa?',fridgeS:'Tocca gli ingredienti che hai. Le proposte si aggiornano.',
   listT:'Lista della spesa',listS:'Si riempie da sola. Spunta = lo hai comprato → entra nel frigo.',listE:'Niente da comprare 👌',cook:'Ottimo, si cucina!',added:'aggiunti alla spesa',
   perPerson:'a persona',nothing:'Nessuna ricetta con questi filtri. Allarga il budget o il tempo.',pitch:'Pitch',noMiss:'hai già tutto!',steps:'Come si fa',veg:'Vegetariano',
   menuT:'Il tuo menu',menuS:'Le ricette che hai scelto. Toccane una per vedere come si fa.',menuE:'Nessuna ricetta scelta. Vai su Stasera e scorri a destra ♥',
   missing:'da comprare',cooked:'✓ Cucinato',remove:'Rimuovi dal menu',close:'Chiudi',persons:'persone',addPh:'Aggiungi un articolo…',addB:'Aggiungi',
   clearDone:'Svuota comprati',share:'Condividi',copied:'Lista copiata 📋',install:'📲 Installa',other:'Altro',reset:'Azzera tutto',resetQ:'Cancellare menu, frigo e lista?'},
 fr:{tonight:'Ce soir',menu:'Menu',fridge:'Frigo',list:'Courses',title:'On mange quoi ce soir ?',sub:'Swipe : ♥ je le fais, ✕ autre idée',min:'min',
   empty:'Tu as vu toutes les idées 🎉',again:'Recommencer',fridgeT:'Qu\'as-tu à la maison ?',fridgeS:'Touche les ingrédients que tu as. Les idées se mettent à jour.',
   listT:'Liste de courses',listS:'Elle se remplit toute seule. Coche = acheté → ça entre dans le frigo.',listE:'Rien à acheter 👌',cook:'Super, on cuisine !',added:'ajoutés aux courses',
   perPerson:'par personne',nothing:'Aucune recette avec ces filtres. Élargis le budget ou le temps.',pitch:'Pitch',noMiss:'tu as déjà tout !',steps:'Comment faire',veg:'Végétarien',
   menuT:'Ton menu',menuS:'Les recettes que tu as choisies. Touche-en une pour voir comment faire.',menuE:'Aucune recette choisie. Va sur Ce soir et swipe à droite ♥',
   missing:'à acheter',cooked:'✓ Cuisiné',remove:'Retirer du menu',close:'Fermer',persons:'personnes',addPh:'Ajouter un article…',addB:'Ajouter',
   clearDone:'Vider les achetés',share:'Partager',copied:'Liste copiée 📋',install:'📲 Installer',other:'Autre',reset:'Tout remettre à zéro',resetQ:'Effacer menu, frigo et liste ?'}
};

const KEY='cosamangio.v2', OLDKEY='cosamangio.v1';
const DEFAULTS=()=>({lang:'it',tab:'tonight',fridge:['pasta','uova','pomodoro','zucchine','parmigiano'],time:30,budget:4,veg:false,persons:2,skipped:[],menu:[],list:[]});
let S=DEFAULTS();
try{const x=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem(OLDKEY)||'null'); if(x) S=Object.assign(S,x);}catch(e){}
S.menu=S.menu.filter(id=>RMAP[id]);
S.list=S.list.filter(x=>x.c||ING[x.k]);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}};
const L=()=>S.lang==='fr'?1:0;
const t=k=>TXT[S.lang][k];
const ing=k=>ING[k][L()];
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// ---- quantités ----
function fq(q,u){
  if(u==='pz') return '×'+Math.max(1,Math.ceil(q-1e-9));
  if(q>=1000) return (Math.round(q/100)/10)+(u==='ml'?' l':' kg');
  return (q>=20?Math.ceil(q/5)*5:Math.ceil(q))+' '+u;
}
function need(k){
  let q=0,u='g';
  S.menu.forEach(id=>{const x=RMAP[id].i.find(a=>a[0]===k); if(x){q+=x[1]*S.persons;u=x[2]}});
  return q?fq(q,u):'';
}

// ---- logique ----
function deck(){
  return R.filter(r=>r.t<=S.time && r.c<=S.budget && (!S.veg||r.v) && !S.skipped.includes(r.id) && !S.menu.includes(r.id))
    .map(r=>({r,have:r.i.filter(a=>S.fridge.includes(a[0])).length/r.i.length}))
    .sort((a,b)=>b.have-a.have||a.r.t-b.r.t).map(x=>x.r);
}
function missing(r){return r.i.map(a=>a[0]).filter(k=>!S.fridge.includes(k))}
function addToMenu(r){
  if(S.menu.includes(r.id)) return 0;
  S.menu.push(r.id);
  const miss=missing(r).filter(k=>!S.list.some(x=>x.k===k&&!x.done));
  miss.forEach(k=>S.list.push({k,done:false}));
  return miss.length;
}
function removeFromMenu(id){
  S.menu=S.menu.filter(x=>x!==id);
  const needed=new Set(S.menu.flatMap(m=>RMAP[m].i.map(a=>a[0])));
  S.list=S.list.filter(x=>x.c||x.done||needed.has(x.k));
}
function toggleBought(i){
  const it=S.list[i]; it.done=!it.done;
  if(!it.k) return;
  if(it.done){ if(!S.fridge.includes(it.k)) S.fridge.push(it.k); }
  else S.fridge=S.fridge.filter(k=>k!==it.k);
}
function toggleFridge(k){
  if(S.fridge.includes(k)) S.fridge=S.fridge.filter(x=>x!==k);
  else { S.fridge.push(k); S.list.forEach(x=>{if(x.k===k)x.done=true}); }
}
function listText(){
  return S.list.filter(x=>!x.done).map(x=>'• '+(x.c?x.c:ING[x.k][2]+' '+ing(x.k)+(need(x.k)?' ('+need(x.k)+')':''))).join('\n');
}
function toast(msg){
  const d=document.createElement('div'); d.className='toast'; d.textContent=msg; $('#app').appendChild(d);
  setTimeout(()=>d.remove(),1800);
}

// ---- vues ----
function ingredients(r,qty){
  return r.i.map(([k,q,u])=>`<span class="ing ${S.fridge.includes(k)?'have':'miss'}">${ING[k][2]} ${ing(k)}${qty?' · '+fq(q*S.persons,u):''}</span>`).join('');
}
function render(){
  const old=$('#main'), top=old?old.scrollTop:0;
  document.documentElement.lang=S.lang;
  const open=S.list.filter(x=>!x.done).length;
  const views={tonight:viewTonight,menu:viewMenu,fridge:viewFridge,list:viewList};
  $('#app').innerHTML=`
   <header><div class="logo">cosa<span>mangio</span>?</div>
     <div class="hbtns">${deferredInstall?`<button class="pill" data-a="install">${t('install')}</button>`:''}<button class="pill" data-a="lang">${S.lang==='it'?'🇫🇷 FR':'🇮🇹 IT'}</button><button class="pill accent" data-a="pitch">▶</button></div></header>
   <main id="main">${(views[S.tab]||viewTonight)()}</main>
   <nav>${[['tonight','🍽️'],['menu','📖'],['fridge','🧊'],['list','🛒']].map(([k,i])=>{
     const n=k==='list'?open:k==='menu'?S.menu.length:0;
     return `<button class="${S.tab===k?'on':''}" data-a="tab" data-v="${k}"><span class="ic">${i}</span>${t(k)}${n?`<span class="badge">${n}</span>`:''}</button>`}).join('')}</nav>`;
  $('#main').scrollTop=top;
  if(S.tab==='tonight') bindDrag();
}
function viewTonight(){
  const d=deck(), top=d.slice(0,3);
  const f=(k,v)=>`<span class="chip ${S[k]===v?'on':''}" data-a="f" data-k="${k}" data-v="${v}">`;
  let cards='';
  if(!top.length){
    const none=R.filter(r=>r.t<=S.time&&r.c<=S.budget&&(!S.veg||r.v)&&!S.menu.includes(r.id)).length===0;
    cards=`<div class="empty"><p>${none?t('nothing'):t('empty')}</p>${none?'':`<br><button class="btn" data-a="reset">${t('again')}</button>`}</div>`;
  } else {
    cards=`<div class="deck">`+top.map((r,i)=>i).reverse().map(i=>{
      const r=top[i];
      return `<div class="rc ${i===1?'back1':i===2?'back2':''}" data-top="${i===0?1:0}" data-id="${r.id}">
        <div class="stamp y">♥</div><div class="stamp n">✕</div>
        <div class="emo">${r.e}</div><h3>${r.n[L()]}</h3>
        <div class="meta"><span>⏱ ${r.t} ${t('min')}</span><span>💶 ~${r.c} € ${t('perPerson')}</span></div>
        <div class="ings">${ingredients(r)}</div></div>`}).join('')+`</div>
      <div class="actions"><button class="round no" data-a="no">✕</button><button class="round yes" data-a="yes">♥</button></div>`;
  }
  return `<h2>${t('title')}</h2><p class="sub">${t('sub')}</p>
    <div class="filters">${[15,30,45,90].map(v=>f('time',v)+`⏱ ≤${v}'</span>`).join('')}${[3,4,6].map(v=>f('budget',v)+`💶 ≤${v}€</span>`).join('')}
    ${[1,2,4,6].map(v=>f('persons',v)+`👥 ${v}</span>`).join('')}<span class="chip ${S.veg?'on':''}" data-a="veg">🌱 ${t('veg')}</span></div>${cards}`;
}
function viewMenu(){
  return `<h2>${t('menuT')}</h2><p class="sub">${t('menuS')} · 👥 ${S.persons} ${t('persons')}</p>`+
   (S.menu.length?S.menu.map(id=>{const r=RMAP[id],m=missing(r).length;
     return `<div class="mi" data-a="open" data-v="${id}"><span class="e">${r.e}</span><div class="nm">${r.n[L()]}<small>⏱ ${r.t} ${t('min')} · ${m?`🛒 ${m} ${t('missing')}`:'✅ '+t('noMiss')}</small></div></div>`}).join('')
    :`<div class="empty">${t('menuE')}</div>`);
}
function viewFridge(){
  return `<h2>${t('fridgeT')}</h2><p class="sub">${t('fridgeS')}</p>`+
   ['base','veg','lat','car'].map(c=>`<div class="cat">${CATS[c][L()]}</div><div class="grid">`+
     Object.keys(ING).filter(k=>ING[k][3]===c).map(k=>`<span class="chip ${S.fridge.includes(k)?'on':''}" data-a="fr" data-v="${k}">${ING[k][2]} ${ing(k)}</span>`).join('')+`</div>`).join('');
}
function viewList(){
  let out=`<h2>${t('listT')}</h2><p class="sub">${t('listS')}</p>
   <form id="addForm" class="addrow"><input id="addIn" placeholder="${t('addPh')}" autocomplete="off" maxlength="60"><button class="btn" type="submit">+</button></form>`;
  if(!S.list.length) return out+`<div class="empty">${t('listE')}</div>`;
  ['base','veg','lat','car','other'].forEach(c=>{
    const items=S.list.map((x,i)=>({x,i})).filter(({x})=>(x.c?'other':ING[x.k][3])===c);
    if(!items.length) return;
    out+=`<div class="cat">${CATS[c][L()]}</div>`+items.map(({x,i})=>
      `<div class="list-item ${x.done?'done':''}" data-a="buy" data-v="${i}"><div class="box">${x.done?'✓':''}</div>
       <div class="nm">${x.c?esc(x.c):ING[x.k][2]+' '+ing(x.k)}</div><span class="qty">${x.k?need(x.k):''}</span></div>`).join('');
  });
  const anyDone=S.list.some(x=>x.done), anyOpen=S.list.some(x=>!x.done);
  return out+`<div class="row2">${anyOpen?`<button class="btn sec" data-a="share">📤 ${t('share')}</button>`:''}${anyDone?`<button class="btn sec" data-a="clearDone">🧹 ${t('clearDone')}</button>`:''}</div>
   <div class="row2"><button class="btn sec" data-a="wipe" style="font-size:13px;color:var(--mute)">${t('reset')}</button></div>`;
}

// ---- fiches recette ----
function recipeSheet(r,n,fromMenu){
  const s=document.createElement('div'); s.className='sheet';
  s.innerHTML=`<div><div style="font-size:54px">${r.e}</div><h3>${r.n[L()]}</h3>
    <div class="meta" style="justify-content:flex-start"><span>⏱ ${r.t} ${t('min')}</span><span>💶 ~${r.c} € ${t('perPerson')}</span><span>👥 ${S.persons}</span></div>
    <div class="ings" style="justify-content:flex-start;margin:6px 0">${ingredients(r,true)}</div>
    <p><b>${t('steps')} —</b> ${r.s[L()]}</p>
    ${fromMenu?`<button class="btn" style="width:100%" data-a="cooked" data-v="${r.id}">${t('cooked')}</button>
      <div class="row2"><button class="btn sec" data-a="unmenu" data-v="${r.id}">${t('remove')}</button><button class="btn sec" data-a="closeSheet">${t('close')}</button></div>`
    :`<p style="color:var(--green);font-weight:700;margin-top:-6px">${n?`🛒 ${n} ${t('added')}`:`✅ ${t('noMiss')}`}</p>
      <button class="btn" style="width:100%" data-a="closeSheet">${t('cook')}</button>`}</div>`;
  $('#app').appendChild(s);
}

// ---- swipe ----
function decide(yes){
  const el=document.querySelector('.rc[data-top="1"]'); if(!el||el.dataset.busy) return;
  el.dataset.busy=1;
  const r=RMAP[+el.dataset.id];
  el.classList.remove('drag'); el.style.transform=`translateX(${yes?500:-500}px) rotate(${yes?25:-25}deg)`; el.style.opacity=0;
  setTimeout(()=>{
    let n=0;
    if(yes) n=addToMenu(r); else S.skipped.push(r.id);
    save(); render();
    if(yes) recipeSheet(r,n,false);
  },180);
}
function bindDrag(){
  const el=document.querySelector('.rc[data-top="1"]'); if(!el) return;
  let x0=null, dx=0; const y=el.querySelector('.stamp.y'), n=el.querySelector('.stamp.n');
  el.onpointerdown=e=>{x0=e.clientX;dx=0;el.classList.add('drag');el.setPointerCapture(e.pointerId)};
  el.onpointermove=e=>{if(x0===null)return;dx=e.clientX-x0;el.style.transform=`translateX(${dx}px) rotate(${dx/18}deg)`;y.style.opacity=Math.max(0,dx/100);n.style.opacity=Math.max(0,-dx/100)};
  const end=()=>{if(x0===null)return;x0=null;if(Math.abs(dx)>90)decide(dx>0);else{el.classList.remove('drag');el.style.transform='';y.style.opacity=0;n.style.opacity=0}};
  el.onpointerup=end; el.onpointercancel=end;
}

// ---- événements ----
let deferredInstall=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;render()});
window.addEventListener('appinstalled',()=>{deferredInstall=null;render()});

document.addEventListener('click',e=>{
  const b=e.target.closest('#app [data-a]'); if(!b) return;
  const a=b.dataset.a, v=b.dataset.v;
  if(a==='lang'){S.lang=S.lang==='it'?'fr':'it'}
  else if(a==='tab'){S.tab=v}
  else if(a==='f'){S[b.dataset.k]=+v}
  else if(a==='veg'){S.veg=!S.veg}
  else if(a==='fr'){toggleFridge(v)}
  else if(a==='buy'){toggleBought(+v)}
  else if(a==='yes'){return decide(true)}
  else if(a==='no'){return decide(false)}
  else if(a==='reset'){S.skipped=[]}
  else if(a==='open'){return recipeSheet(RMAP[+v],0,true)}
  else if(a==='cooked'||a==='unmenu'){removeFromMenu(+v)}
  else if(a==='clearDone'){S.list=S.list.filter(x=>!x.done)}
  else if(a==='wipe'){if(!confirm(t('resetQ')))return; const lang=S.lang; S=DEFAULTS(); S.lang=lang; S.tab='tonight'}
  else if(a==='share'){
    const txt=listText();
    if(navigator.share) navigator.share({title:t('listT'),text:txt}).catch(()=>{});
    else if(navigator.clipboard) navigator.clipboard.writeText(txt).then(()=>toast(t('copied')),()=>{});
    return;
  }
  else if(a==='install'){if(deferredInstall){deferredInstall.prompt();deferredInstall=null}}
  else if(a==='closeSheet'){b.closest('.sheet').remove();return}
  else if(a==='pitch'){return openPitch()}
  save(); render();
});
document.addEventListener('submit',e=>{
  if(e.target.id!=='addForm') return;
  e.preventDefault();
  const v=$('#addIn').value.trim(); if(!v) return;
  S.list.push({c:v,done:false}); save(); render(); const i=$('#addIn'); if(i) i.focus();
});
document.addEventListener('keydown',e=>{
  if(S.tab!=='tonight'||$('.sheet')||$('#pitch').classList.contains('show')||e.target.closest('input')) return;
  if(e.key==='ArrowRight') decide(true); else if(e.key==='ArrowLeft') decide(false);
});

render();
