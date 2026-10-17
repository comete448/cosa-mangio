const TXT = {
 it:{person:'persona',themeAuto:'Tema: automatico',themeLight:'Tema: chiaro',themeDark:'Tema: scuro',ingr:'Ingredienti',tonight:'Stasera',menu:'Menu',fridge:'Frigo',list:'Spesa',title:'Cosa mangio stasera?',sub:'Scorri: ♥ lo faccio, ✕ un\'altra idea',min:'min',
   empty:'Hai visto tutte le idee',again:'Ricomincia',fridgeT:'Cosa hai in casa?',fridgeS:'Tocca gli ingredienti che hai. Le proposte si aggiornano.',
   listT:'Lista della spesa',listS:'Si riempie da sola. Spunta = lo hai comprato → entra nel frigo.',listE:'Niente da comprare 👌',cook:'Ottimo, si cucina!',added:'aggiunti alla spesa',
   perPerson:'a persona',nothing:'Nessuna ricetta con questi filtri. Allarga il budget o il tempo.',pitch:'Pitch',noMiss:'hai già tutto!',steps:'Come si fa',veg:'Vegetariano',
   menuT:'Il tuo menu',menuS:'Le ricette che hai scelto. Toccane una per vedere come si fa.',menuE:'Nessuna ricetta scelta. Vai su Stasera e scorri a destra ♥',
   missing:'da comprare',cooked:'✓ Cucinato',remove:'Rimuovi dal menu',close:'Chiudi',persons:'persone',addPh:'Aggiungi un articolo…',addB:'Aggiungi',
   clearDone:'Svuota comprati',share:'Condividi',copied:'Lista copiata 📋',install:'Installa',other:'Altro',reset:'Azzera tutto',resetQ:'Cancellare menu, frigo e lista?'},
 fr:{person:'personne',themeAuto:'Thème : automatique',themeLight:'Thème : clair',themeDark:'Thème : sombre',ingr:'Ingrédients',tonight:'Ce soir',menu:'Menu',fridge:'Frigo',list:'Courses',title:'On mange quoi ce soir ?',sub:'Swipe : ♥ je le fais, ✕ autre idée',min:'min',
   empty:'Tu as vu toutes les idées',again:'Recommencer',fridgeT:'Qu\'as-tu à la maison ?',fridgeS:'Touche les ingrédients que tu as. Les idées se mettent à jour.',
   listT:'Liste de courses',listS:'Elle se remplit toute seule. Coche = acheté → ça entre dans le frigo.',listE:'Rien à acheter 👌',cook:'Super, on cuisine !',added:'ajoutés aux courses',
   perPerson:'par personne',nothing:'Aucune recette avec ces filtres. Élargis le budget ou le temps.',pitch:'Pitch',noMiss:'tu as déjà tout !',steps:'Comment faire',veg:'Végétarien',
   menuT:'Ton menu',menuS:'Les recettes que tu as choisies. Touche-en une pour voir comment faire.',menuE:'Aucune recette choisie. Va sur Ce soir et swipe à droite ♥',
   missing:'à acheter',cooked:'✓ Cuisiné',remove:'Retirer du menu',close:'Fermer',persons:'personnes',addPh:'Ajouter un article…',addB:'Ajouter',
   clearDone:'Vider les achetés',share:'Partager',copied:'Liste copiée 📋',install:'Installer',other:'Autre',reset:'Tout remettre à zéro',resetQ:'Effacer menu, frigo et liste ?'}
};

const KEY='cosamangio.v2', OLDKEY='cosamangio.v1';
const DEFAULTS=()=>({theme:'auto',lang:'it',tab:'tonight',fridge:['pasta','uova','pomodoro','zucchine','parmigiano'],time:30,budget:4,veg:false,persons:2,skipped:[],menu:[],list:[]});
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

// ---- icônes ----
const svg=p=>`<svg viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
const ICON={
  tonight:svg('<path d="M7 3v7a2.5 2.5 0 0 0 2.5 2.5V21M12 3v7a2.5 2.5 0 0 1-2.5 2.5M17 3c-2.2 1.6-3 4-3 7v3h3v8"/>'),
  menu:svg('<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z"/><path d="M4 21.5V4.5M9 7h7"/>'),
  fridge:svg('<rect x="5" y="2" width="14" height="20" rx="3"/><path d="M5 10h14M9 5.5v1.5M9 13v3"/>'),
  list:svg('<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3h3l2.4 11.5h11l2-8H6"/>'),
  x:svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  heart:svg('<path d="M12 20.5s-7.5-4.6-7.5-10.4A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 2.5c0 5.8-7.5 10.4-7.5 10.4z"/>'),
  auto:svg('<circle cx="12" cy="12" r="9"/><path d="M12 3v18" /><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/>'),
  light:svg('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4"/>'),
  dark:svg('<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"/>'),
  play:svg('<path d="M8 5.5v13l10.5-6.5z" fill="currentColor"/>'),
  clock:svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
  euro:svg('<path d="M18 6.5A7 7 0 1 0 18 17.5M4 10.5h9M4 13.5h9"/>'),
  users:svg('<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M16 5.2a3 3 0 0 1 0 5.6M18 14.8c1.8.7 3 2.4 3 5.2"/>')
};
const hue=r=>`--h:${(r.id*47+12)%360}`;

// ---- vues ----
function ingredients(r,qty){
  return r.i.map(([k,q,u])=>`<span class="ing ${S.fridge.includes(k)?'have':'miss'}">${ING[k][2]} ${ing(k)}${qty?' · '+fq(q*S.persons,u):''}</span>`).join('');
}
function applyTheme(){
  const el=document.documentElement;
  if(S.theme==='light'||S.theme==='dark') el.dataset.theme=S.theme; else delete el.dataset.theme;
  const m=document.querySelector('meta[name=theme-color]');
  if(m) m.content=(S.theme==='dark'||(S.theme!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches))?'#16120e':'#faf5ec';
}
function render(){
  const old=$('#main'), top=old?old.scrollTop:0;
  document.documentElement.lang=S.lang;
  applyTheme();
  const open=S.list.filter(x=>!x.done).length;
  const views={tonight:viewTonight,menu:viewMenu,fridge:viewFridge,list:viewList};
  $('#app').innerHTML=`
   <header><div class="logo">cosa mangio<b>?</b></div>
     <div class="hbtns">${deferredInstall?`<button class="pill" data-a="install">${t('install')}</button>`:''}<button class="pill icon2" data-a="theme" aria-label="${t('theme'+S.theme[0].toUpperCase()+S.theme.slice(1))}" title="${t('theme'+S.theme[0].toUpperCase()+S.theme.slice(1))}">${ICON[S.theme]}</button><button class="pill" data-a="lang">${S.lang==='it'?'FR':'IT'}</button><button class="pill icon" data-a="pitch" aria-label="Pitch">${ICON.play}</button></div></header>
   <main id="main">${(views[S.tab]||viewTonight)()}</main>
   <nav>${['tonight','menu','fridge','list'].map(k=>{
     const n=k==='list'?open:k==='menu'?S.menu.length:0;
     return `<button class="${S.tab===k?'on':''}" data-a="tab" data-v="${k}"><span class="ic">${ICON[k]}${n?`<span class="badge">${n}</span>`:''}</span>${t(k)}</button>`}).join('')}</nav>`;
  $('#main').scrollTop=top;
  if(S.tab==='tonight') bindDrag();
}
function viewTonight(){
  const d=deck(), top=d.slice(0,3);
  const f=(k,v)=>`<span class="chip ${S[k]===v?'on':''}" data-a="f" data-k="${k}" data-v="${v}">`;
  let cards='';
  if(!top.length){
    const none=R.filter(r=>r.t<=S.time&&r.c<=S.budget&&(!S.veg||r.v)&&!S.menu.includes(r.id)).length===0;
    cards=`<div class="empty"><span class="big">${none?'🍽️':'🎉'}</span><p>${none?t('nothing'):t('empty')}</p>${none?'':`<br><button class="btn" data-a="reset">${t('again')}</button>`}</div>`;
  } else {
    cards=`<div class="deck">`+top.map((r,i)=>i).reverse().map(i=>{
      const r=top[i];
      return `<div class="rc ${i===1?'back1':i===2?'back2':''}" data-top="${i===0?1:0}" data-id="${r.id}" style="${hue(r)}">
        <div class="stamp y">${S.lang==='it'?'LO FACCIO':'JE LE FAIS'}</div><div class="stamp n">${S.lang==='it'?'PASSO':'SUIVANT'}</div>
        <div class="hero"><div class="plate">${r.e}</div></div>
        <div class="body"><h3>${r.n[L()]}</h3>
        <div class="meta"><span>${ICON.clock}${r.t} ${t('min')}</span><span>${ICON.euro}~${r.c} € ${t('perPerson')}</span></div>
        <div class="ings">${ingredients(r)}</div></div></div>`}).join('')+`</div>
      <div class="actions"><button class="round no" data-a="no" aria-label="${S.lang==='fr'?'Non':'No'}">${ICON.x}</button><button class="round yes" data-a="yes" aria-label="${S.lang==='fr'?'Oui':'Sì'}">${ICON.heart}</button></div>`;
  }
  return `<h2>${t('title')}</h2><p class="sub">${t('sub')}</p>
    <div class="filters">
      <div class="frow"><span class="fl">${ICON.clock}</span>${[15,30,45,90].map(v=>f('time',v)+`≤ ${v}</span>`).join('')}<span class="fnote">${t('min')}</span></div>
      <div class="frow"><span class="fl">${ICON.euro}</span>${[3,4,6].map(v=>f('budget',v)+`≤ ${v} €</span>`).join('')}<span class="fnote">${t('perPerson')}</span></div>
      <div class="frow"><span class="fl">${ICON.users}</span>${[1,2,4,6].map(v=>f('persons',v)+`${v}</span>`).join('')}<span class="fnote">${t('persons')}</span><span class="chip ${S.veg?'on':''}" data-a="veg">🌱 ${t('veg')}</span></div>
    </div>${cards}`;
}
function viewMenu(){
  return `<h2>${t('menuT')}</h2><p class="sub">${t('menuS')} · 👥 ${S.persons} ${t('persons')}</p>`+
   (S.menu.length?S.menu.map(id=>{const r=RMAP[id],m=missing(r).length;
     return `<div class="mi" data-a="open" data-v="${id}" style="${hue(r)}"><span class="e">${r.e}</span><div class="nm">${r.n[L()]}<small>${r.t} ${t('min')} · ${m?`🛒 ${m} ${t('missing')}`:'✅ '+t('noMiss')}</small></div></div>`}).join('')
    :`<div class="empty"><span class="big">📖</span>${t('menuE')}</div>`);
}
function viewFridge(){
  return `<h2>${t('fridgeT')}</h2><p class="sub">${t('fridgeS')}</p>`+
   ['base','veg','lat','car'].map(c=>`<div class="cat">${CATS[c][L()]}</div><div class="grid">`+
     Object.keys(ING).filter(k=>ING[k][3]===c).map(k=>`<span class="chip ${S.fridge.includes(k)?'on':''}" data-a="fr" data-v="${k}">${ING[k][2]} ${ing(k)}</span>`).join('')+`</div>`).join('');
}
function viewList(){
  let out=`<h2>${t('listT')}</h2><p class="sub">${t('listS')}</p>
   <form id="addForm" class="addrow"><input id="addIn" placeholder="${t('addPh')}" autocomplete="off" maxlength="60"><button class="btn" type="submit" aria-label="${t('addB')}">+</button></form>`;
  if(!S.list.length) return out+`<div class="empty"><span class="big">🛒</span>${t('listE')}</div>`;
  ['base','veg','lat','car','other'].forEach(c=>{
    const items=S.list.map((x,i)=>({x,i})).filter(({x})=>(x.c?'other':ING[x.k][3])===c);
    if(!items.length) return;
    out+=`<div class="cat">${CATS[c][L()]}</div>`+items.map(({x,i})=>
      `<div class="list-item ${x.done?'done':''}" data-a="buy" data-v="${i}"><div class="box">${x.done?'✓':''}</div>
       <div class="nm">${x.c?esc(x.c):ING[x.k][2]+' '+ing(x.k)}</div><span class="qty">${x.k?need(x.k):''}</span></div>`).join('');
  });
  const anyDone=S.list.some(x=>x.done), anyOpen=S.list.some(x=>!x.done);
  return out+`<div class="row2">${anyOpen?`<button class="btn sec" data-a="share">📤 ${t('share')}</button>`:''}${anyDone?`<button class="btn sec" data-a="clearDone">🧹 ${t('clearDone')}</button>`:''}</div>
   <div class="row2"><button class="btn ghost" data-a="wipe">${t('reset')}</button></div>`;
}

// ---- fiches recette ----
function recipeSheet(r,n,fromMenu){
  const s=document.createElement('div'); s.className='sheet';
  s.innerHTML=`<div style="${hue(r)}"><div class="grab"></div><div class="hero2">${r.e}</div><h3>${r.n[L()]}</h3>
    <div class="meta"><span>${ICON.clock}${r.t} ${t('min')}</span><span>${ICON.euro}~${r.c} € ${t('perPerson')}</span><span>${ICON.users}${S.persons}</span></div>
    <h4>${t('ingr')}</h4><div class="ings">${ingredients(r,true)}</div>
    <h4>${t('steps')}</h4><p>${r.s[L()]}</p>
    ${fromMenu?`<button class="btn" style="width:100%" data-a="cooked" data-v="${r.id}">${t('cooked')}</button>
      <div class="row2"><button class="btn sec" data-a="unmenu" data-v="${r.id}">${t('remove')}</button><button class="btn sec" data-a="closeSheet">${t('close')}</button></div>`
    :`<p class="ok">${n?`🛒 ${n} ${t('added')}`:`✅ ${t('noMiss')}`}</p>
      <button class="btn" style="width:100%" data-a="closeSheet">${t('cook')}</button>`}</div>`;
  s.addEventListener('click',e=>{if(e.target===s)s.remove()});
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
  else if(a==='theme'){S.theme=S.theme==='auto'?'light':S.theme==='light'?'dark':'auto'; save(); render(); toast(t('theme'+S.theme[0].toUpperCase()+S.theme.slice(1))); return}
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
