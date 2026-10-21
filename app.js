const TXT = {
 it:{tuto:'Rivedi il tutorial',recipes:'Ricette',recipesT:'Tutte le ricette',recipesS:'ricette: cerca per nome o ingrediente',searchPh:'Cerca… (es. zucca, pollo)',noResults:'Nessun risultato',addMenu:'＋ Aggiungi al menu',inMenu:'✓ Nel menu',
   kAll:'Tutto',kPasta:'🍝 Pasta',kRice:'🍚 Riso',kSoup:'🥣 Zuppe',kMeat:'🍗 Carne',kFish:'🐟 Pesce',kOther:'🥗 Altro',filters:'Filtri',
   statCooked:'piatti cucinati',statSaved:'ingredienti salvati dallo spreco',addedMenu:'Aggiunto al menu',
   urgentTag:'Da finire',undo:'Annulla',person:'persona',themeAuto:'Tema: automatico',themeLight:'Tema: chiaro',themeDark:'Tema: scuro',ingr:'Ingredienti',tonight:'Stasera',menu:'Menu',fridge:'Frigo',list:'Spesa',title:'Cosa mangio stasera?',sub:'Scorri: ♥ lo faccio, ✕ un\'altra idea',min:'min',
   empty:'Hai visto tutte le idee',again:'Ricomincia',fridgeT:'Cosa hai in casa?',fridgeS:'Tocca = ce l\'hai. Tocca ancora = da consumare presto 🟠: le ricette che lo usano passano avanti.',
   listT:'Lista della spesa',listS:'Si riempie da sola. Spunta = lo hai comprato → entra nel frigo.',listE:'Niente da comprare 👌',cook:'Ottimo, si cucina!',added:'aggiunti alla spesa',
   perPerson:'a persona',nothing:'Nessuna ricetta con questi filtri. Allarga il budget o il tempo.',pitch:'Pitch',noMiss:'hai già tutto!',steps:'Come si fa',veg:'Vegetariano',
   menuT:'Il tuo menu',menuS:'Le ricette che hai scelto. Toccane una per vedere come si fa.',menuE:'Nessuna ricetta scelta. Vai su Stasera e scorri a destra ♥',
   missing:'da comprare',cooked:'✓ Cucinato',remove:'Rimuovi dal menu',close:'Chiudi',persons:'persone',addPh:'Aggiungi un articolo…',addB:'Aggiungi',
   clearDone:'Svuota comprati',share:'Condividi',copied:'Lista copiata 📋',install:'Installa',other:'Altro',reset:'Azzera tutto',resetQ:'Cancellare menu, frigo e lista?',allBought:'Spesa completa! 🎉'},
 fr:{tuto:'Revoir le tutoriel',recipes:'Recettes',recipesT:'Toutes les recettes',recipesS:'recettes : cherche par nom ou ingrédient',searchPh:'Chercher… (ex. potiron, poulet)',noResults:'Aucun résultat',addMenu:'＋ Ajouter au menu',inMenu:'✓ Dans le menu',
   kAll:'Tout',kPasta:'🍝 Pâtes',kRice:'🍚 Riz',kSoup:'🥣 Soupes',kMeat:'🍗 Viande',kFish:'🐟 Poisson',kOther:'🥗 Autre',filters:'Filtres',
   statCooked:'plats cuisinés',statSaved:'ingrédients sauvés du gaspillage',addedMenu:'Ajouté au menu',
   urgentTag:'À finir',undo:'Annuler',person:'personne',themeAuto:'Thème : automatique',themeLight:'Thème : clair',themeDark:'Thème : sombre',ingr:'Ingrédients',tonight:'Ce soir',menu:'Menu',fridge:'Frigo',list:'Courses',title:'On mange quoi ce soir ?',sub:'Swipe : ♥ je le fais, ✕ autre idée',min:'min',
   empty:'Tu as vu toutes les idées',again:'Recommencer',fridgeT:'Qu\'as-tu à la maison ?',fridgeS:'Touche = tu l\'as. Touche encore = à consommer vite 🟠 : les recettes qui l\'utilisent passent en premier.',
   listT:'Liste de courses',listS:'Elle se remplit toute seule. Coche = acheté → ça entre dans le frigo.',listE:'Rien à acheter 👌',cook:'Super, on cuisine !',added:'ajoutés aux courses',
   perPerson:'par personne',nothing:'Aucune recette avec ces filtres. Élargis le budget ou le temps.',pitch:'Pitch',noMiss:'tu as déjà tout !',steps:'Comment faire',veg:'Végétarien',
   menuT:'Ton menu',menuS:'Les recettes que tu as choisies. Touche-en une pour voir comment faire.',menuE:'Aucune recette choisie. Va sur Ce soir et swipe à droite ♥',
   missing:'à acheter',cooked:'✓ Cuisiné',remove:'Retirer du menu',close:'Fermer',persons:'personnes',addPh:'Ajouter un article…',addB:'Ajouter',
   clearDone:'Vider les achetés',share:'Partager',copied:'Liste copiée 📋',install:'Installer',other:'Autre',reset:'Tout remettre à zéro',resetQ:'Effacer menu, frigo et liste ?',allBought:'Courses terminées ! 🎉'}
};

const KEY='cosamangio.v2', OLDKEY='cosamangio.v1';
const TABS=['tonight','recipes','menu','fridge','list'];
const KINDS=['all','pasta','rice','soup','meat','fish','other'];
const FISH=['tonno','acciughe','merluzzo','gamberi','salmone'], MEAT=['pollo','guanciale','salsiccia','macinato','prosciutto'];
// Type de plat déduit automatiquement des ingrédients et du nom
R.forEach(r=>{
  const ks=r.i.map(a=>a[0]);
  r.k=/zuppa|crema|vellutata|minestrone|pappa/i.test(r.n[0])?'soup'
    :(ks.includes('pasta')||ks.includes('gnocchi'))?'pasta'
    :ks.includes('riso')?'rice'
    :ks.some(k=>FISH.includes(k))?'fish'
    :ks.some(k=>MEAT.includes(k))?'meat':'other';
});
const DEFAULTS=()=>({onboarded:false,kind:'all',fopen:false,q:'',stats:{cooked:0,saved:0},theme:'auto',lang:'it',tab:'tonight',fridge:['pasta','uova','pomodoro','zucchine','parmigiano'],time:30,budget:4,veg:false,persons:2,skipped:[],menu:[],list:[],urgent:[],last:null});
let S=DEFAULTS();
try{const x=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem(OLDKEY)||'null'); if(x){ S=Object.assign(S,x); if(x.onboarded===undefined) S.onboarded=true; }}catch(e){}
S.menu=S.menu.filter(id=>RMAP[id]);
S.list=S.list.filter(x=>x.c||ING[x.k]);
S.urgent=(S.urgent||[]).filter(k=>ING[k]&&S.fridge.includes(k));
if(!TABS.includes(S.tab)) S.tab='tonight';
if(!KINDS.includes(S.kind)) S.kind='all';
S.q=''; S.stats=Object.assign({cooked:0,saved:0},S.stats);
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
  return R.filter(r=>r.t<=S.time && r.c<=S.budget && (!S.veg||r.v) && (S.kind==='all'||r.k===S.kind) && !S.skipped.includes(r.id) && !S.menu.includes(r.id))
    .map(r=>({r,urg:urgentIn(r).length,have:r.i.filter(a=>S.fridge.includes(a[0])).length/r.i.length}))
    .sort((a,b)=>b.urg-a.urg||b.have-a.have||a.r.t-b.r.t).map(x=>x.r);
}
function urgentIn(r){return r.i.map(a=>a[0]).filter(k=>S.urgent.includes(k))}
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
  else { S.fridge=S.fridge.filter(k=>k!==it.k); S.urgent=S.urgent.filter(k=>k!==it.k); }
}
// Cycle : absent -> au frigo -> à finir vite -> absent
function toggleFridge(k){
  if(!S.fridge.includes(k)){ S.fridge.push(k); S.list.forEach(x=>{if(x.k===k)x.done=true}); }
  else if(!S.urgent.includes(k)) S.urgent.push(k);
  else { S.urgent=S.urgent.filter(x=>x!==k); S.fridge=S.fridge.filter(x=>x!==k); }
}
function undo(){
  const l=S.last; if(!l) return;
  if(l.kind==='skip') S.skipped=S.skipped.filter(id=>id!==l.id);
  else if(l.kind==='menu') removeFromMenu(l.id);
  S.last=null;
}
function listText(){
  return S.list.filter(x=>!x.done).map(x=>'• '+(x.c?x.c:ING[x.k][2]+' '+ing(x.k)+(need(x.k)?' ('+need(x.k)+')':''))).join('\n');
}
function toast(msg){
  const old=document.querySelector('.toast'); if(old) old.remove();
  const d=document.createElement('div'); d.className='toast'; d.textContent=msg; $('#app').appendChild(d);
  setTimeout(()=>{d.classList.add('out'); setTimeout(()=>d.remove(),250)},1700);
}
const buzz=ms=>{try{ if(navigator.vibrate&&(!navigator.userActivation||navigator.userActivation.hasBeenActive)) navigator.vibrate(ms) }catch(e){}};

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
  recipes:svg('<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/>'),
  chev:svg('<path d="M6 9l6 6 6-6"/>'),
  users:svg('<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5M16 5.2a3 3 0 0 1 0 5.6M18 14.8c1.8.7 3 2.4 3 5.2"/>')
};
const hue=r=>`--h:${(r.id*47+12)%360}`;

// ---- rendu ----
let shellBuilt=false, animNext=true, tabDir=1, promoteNext=false, popIdx=-1, fFresh=false;
const prevCounts={};

function ingredients(r,qty){
  return r.i.map(([k,q,u])=>`<span class="ing ${S.urgent.includes(k)?'urg':S.fridge.includes(k)?'have':'miss'}">${ING[k][2]} ${ing(k)}${qty?' · '+fq(q*S.persons,u):''}</span>`).join('');
}
function applyTheme(){
  const el=document.documentElement;
  if(S.theme==='light'||S.theme==='dark') el.dataset.theme=S.theme; else delete el.dataset.theme;
  const m=document.querySelector('meta[name=theme-color]');
  if(m) m.content=(S.theme==='dark'||(S.theme!=='light'&&matchMedia('(prefers-color-scheme:dark)').matches))?'#16120e':'#faf5ec';
}
function buildShell(){
  $('#app').innerHTML=`
   <header><div class="logo">cosa mangio<b>?</b></div><div class="hbtns" id="hbtns"></div></header>
   <main id="main"></main>
   <nav id="nav"><i class="navind"></i>${TABS.map(k=>`<button data-a="tab" data-v="${k}"><span class="ic">${ICON[k]}<span class="badge" hidden></span></span><span class="lbl"></span></button>`).join('')}</nav>`;
}
function render(){
  if(!shellBuilt){ buildShell(); shellBuilt=true; }
  document.documentElement.lang=S.lang;
  applyTheme();
  const thName='theme'+S.theme[0].toUpperCase()+S.theme.slice(1);
  $('#hbtns').innerHTML=`${deferredInstall?`<button class="pill" data-a="install">${t('install')}</button>`:''}<button class="pill icon2" data-a="theme" aria-label="${t(thName)}" title="${t(thName)}">${ICON[S.theme]}</button><button class="pill" data-a="lang">${S.lang==='it'?'FR':'IT'}</button><button class="pill icon" data-a="pitch" aria-label="Pitch">${ICON.play}</button>`;
  const nav=$('#nav');
  nav.style.setProperty('--i',TABS.indexOf(S.tab)); nav.style.setProperty('--n',TABS.length);
  nav.querySelectorAll('button').forEach((b,i)=>{
    const k=TABS[i], n=k==='list'?S.list.filter(x=>!x.done).length:k==='menu'?S.menu.length:0;
    b.classList.toggle('on',S.tab===k);
    b.querySelector('.lbl').textContent=t(k);
    const bd=b.querySelector('.badge'); bd.textContent=n; bd.hidden=!n;
    if(n&&n!==(prevCounts[k]||0)){ bd.classList.remove('bump'); void bd.offsetWidth; bd.classList.add('bump'); }
    prevCounts[k]=n;
  });
  const main=$('#main'), top=main.scrollTop, anim=animNext;
  main.style.setProperty('--dx',(tabDir*22)+'px');
  main.className=anim?'anim':'';
  const views={tonight:viewTonight,recipes:viewRecipes,menu:viewMenu,fridge:viewFridge,list:viewList};
  main.innerHTML=views[S.tab]();
  main.querySelectorAll('[data-a]').forEach(e=>{ if(e.tagName!=='BUTTON'){ e.tabIndex=0; e.setAttribute('role','button'); } });
  main.scrollTop=anim?0:top;
  if(anim) [...main.children].forEach((c,i)=>{c.style.animationDelay=Math.min(i,14)*45+'ms'});
  animNext=false; promoteNext=false; popIdx=-1; fFresh=false;
  if(S.tab==='tonight') bindDrag();
}
function viewTonight(){
  const d=deck(), top=d.slice(0,3);
  const f=(k,v)=>`<span class="chip ${S[k]===v?'on':''}" data-a="f" data-k="${k}" data-v="${v}">`;
  let cards='';
  if(!top.length){
    const none=R.filter(r=>r.t<=S.time&&r.c<=S.budget&&(!S.veg||r.v)&&(S.kind==='all'||r.k===S.kind)&&!S.menu.includes(r.id)).length===0;
    cards=`<div class="empty"><span class="big">${none?'🍽️':'🎉'}</span><p>${none?t('nothing'):t('empty')}</p>${none?'':`<br><button class="btn" data-a="reset">${t('again')}</button>`}</div>`;
  } else {
    cards=`<div class="deck">`+top.map((r,i)=>i).reverse().map(i=>{
      const r=top[i];
      return `<div class="rc ${i===1?'back1':i===2?'back2':''} ${i===0&&promoteNext?'promote':''}" data-top="${i===0?1:0}" data-id="${r.id}" style="${hue(r)}">
        <div class="stamp y">${S.lang==='it'?'LO FACCIO':'JE LE FAIS'}</div><div class="stamp n">${S.lang==='it'?'PASSO':'SUIVANT'}</div>
        <div class="hero"><div class="plate">${r.e}</div></div>
        ${urgentIn(r).length?`<div class="urgtag">⏳ ${t('urgentTag')} : ${urgentIn(r).map(ing).join(', ')}</div>`:''}
        <div class="body"><h3>${r.n[L()]}</h3>
        <div class="meta"><span>${ICON.clock}${r.t} ${t('min')}</span><span>${ICON.euro}~${r.c} € ${t('perPerson')}</span></div>
        <div class="ings">${ingredients(r)}</div></div></div>`}).join('')+`</div>
      <div class="actions"><button class="round no" data-a="no" aria-label="${S.lang==='fr'?'Non':'No'}">${ICON.x}</button>${S.last?`<button class="round sm" data-a="undo" aria-label="${t('undo')}" title="${t('undo')}">↶</button>`:''}<button class="round yes" data-a="yes" aria-label="${S.lang==='fr'?'Oui':'Sì'}">${ICON.heart}</button></div>`;
  }
  return `<h2>${t('title')}</h2><p class="sub">${t('sub')}</p>
    <div class="filters ${S.fopen?'open':''} ${fFresh?'fresh':''}">
      <button class="fsum" data-a="ftoggle" aria-expanded="${S.fopen}">
        <span class="fs-txt">≤ ${S.time} ${t('min')} · ≤ ${S.budget} € · ${S.persons} ${S.persons>1?t('persons'):t('person')}${S.veg?' · 🌱':''}</span>
        <span class="fs-lbl">${t('filters')}</span><span class="fs-chev">${ICON.chev}</span></button>
      ${S.fopen?`
      <div class="frow"><span class="fl">${ICON.clock}</span>${[15,30,45,90].map(v=>f('time',v)+`≤ ${v}</span>`).join('')}<span class="fnote">${t('min')}</span></div>
      <div class="frow"><span class="fl">${ICON.euro}</span>${[3,4,6].map(v=>f('budget',v)+`≤ ${v} €</span>`).join('')}<span class="fnote">${t('perPerson')}</span></div>
      <div class="frow"><span class="fl">${ICON.users}</span>${[1,2,4,6].map(v=>f('persons',v)+`${v}</span>`).join('')}<span class="fnote">${t('persons')}</span><span class="chip ${S.veg?'on':''}" data-a="veg">🌱 ${t('veg')}</span></div>`:''}
    </div>
    <div class="kinds">${KINDS.map(k=>f('kind',k)+t('k'+k[0].toUpperCase()+k.slice(1))+'</span>').join('')}</div>${cards}`;
}
const norm=s=>String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
function resultsHTML(){
  const q=norm(S.q||'').trim();
  const list=R.filter(r=>!q||norm(r.n[0]+' '+r.n[1]+' '+r.i.map(a=>ING[a[0]][0]+' '+ING[a[0]][1]).join(' ')).includes(q))
    .sort((a,b)=>a.n[L()].localeCompare(b.n[L()]));
  if(!list.length) return `<div class="empty"><span class="big">🔍</span>${t('noResults')}</div>`;
  return list.map(r=>{const have=r.i.filter(a=>S.fridge.includes(a[0])).length;
    return `<div class="mi" data-a="browse" data-v="${r.id}" style="${hue(r)}"><span class="e">${r.e}</span><div class="nm">${r.n[L()]}<small>${r.t} ${t('min')} · ~${r.c} € · ${have}/${r.i.length} ${t('ingr').toLowerCase()}</small></div>${S.menu.includes(r.id)?'<span class="inmenu">✓</span>':''}</div>`}).join('');
}
function viewRecipes(){
  return `<h2>${t('recipesT')}</h2><p class="sub">${R.length} ${t('recipesS')}</p>
   <input id="searchIn" class="search" type="search" placeholder="${t('searchPh')}" value="${esc(S.q||'')}" autocomplete="off">
   <div id="results">${resultsHTML()}</div>`;
}
function viewMenu(){
  const st=S.stats.cooked?`<div class="stats"><div><b>${S.stats.cooked}</b><span>${t('statCooked')}</span></div><div><b>♻️ ${S.stats.saved}</b><span>${t('statSaved')}</span></div></div>`:'';
  return `<h2>${t('menuT')}</h2><p class="sub">${t('menuS')} · 👥 ${S.persons} ${t('persons')}</p>${st}`+
   (S.menu.length?S.menu.map(id=>{const r=RMAP[id],m=missing(r).length;
     return `<div class="mi" data-a="open" data-v="${id}" style="${hue(r)}"><span class="e">${r.e}</span><div class="nm">${r.n[L()]}<small>${r.t} ${t('min')} · ${m?`🛒 ${m} ${t('missing')}`:'✅ '+t('noMiss')}</small></div></div>`}).join('')
    :`<div class="empty"><span class="big">📖</span>${t('menuE')}</div>`);
}
function viewFridge(){
  return `<h2>${t('fridgeT')}</h2><p class="sub">${t('fridgeS')}</p>`+
   ['base','veg','lat','car'].map(c=>`<div class="cat">${CATS[c][L()]}</div><div class="grid">`+
     Object.keys(ING).filter(k=>ING[k][3]===c).map(k=>`<span class="chip ${S.urgent.includes(k)?'urg':S.fridge.includes(k)?'on':''}" data-a="fr" data-v="${k}">${ING[k][2]} ${ing(k)}</span>`).join('')+`</div>`).join('');
}
function viewList(){
  let out=`<h2>${t('listT')}</h2><p class="sub">${t('listS')}</p>
   <form id="addForm" class="addrow"><input id="addIn" placeholder="${t('addPh')}" autocomplete="off" maxlength="60"><button class="btn" type="submit" aria-label="${t('addB')}">+</button></form>`;
  if(!S.list.length) return out+`<div class="empty"><span class="big">🛒</span>${t('listE')}</div>
   <div class="row2"><button class="btn ghost" data-a="tuto">❓ ${t('tuto')}</button><button class="btn ghost" data-a="wipe">${t('reset')}</button></div>`;
  ['base','veg','lat','car','other'].forEach(c=>{
    const items=S.list.map((x,i)=>({x,i})).filter(({x})=>(x.c?'other':ING[x.k][3])===c);
    if(!items.length) return;
    out+=`<div class="cat">${CATS[c][L()]}</div>`+items.map(({x,i})=>
      `<div class="list-item ${x.done?'done':''} ${i===popIdx?'pop':''}" data-a="buy" data-v="${i}"><div class="box">${x.done?'✓':''}</div>
       <div class="nm">${x.c?esc(x.c):ING[x.k][2]+' '+ing(x.k)}</div><span class="qty">${x.k?need(x.k):''}</span></div>`).join('');
  });
  const anyDone=S.list.some(x=>x.done), anyOpen=S.list.some(x=>!x.done);
  return out+`<div class="row2">${anyOpen?`<button class="btn sec" data-a="share">📤 ${t('share')}</button>`:''}${anyDone?`<button class="btn sec" data-a="clearDone">🧹 ${t('clearDone')}</button>`:''}</div>
   <div class="row2"><button class="btn ghost" data-a="tuto">❓ ${t('tuto')}</button><button class="btn ghost" data-a="wipe">${t('reset')}</button></div>`;
}

// ---- fiches recette ----
function recipeSheet(r,n,fromMenu){
  const s=document.createElement('div'); s.className='sheet';
  s.dataset.id=r.id;
  s.innerHTML=`<div style="${hue(r)}"><div class="sh-head"><div class="grab"></div><div class="hero2">${r.e}</div><h3>${r.n[L()]}</h3></div>
    <div class="meta"><span>${ICON.clock}${r.t} ${t('min')}</span><span>${ICON.euro}~${r.c} € ${t('perPerson')}</span><span>${ICON.users}${S.persons}</span></div>
    <h4>${t('ingr')}</h4><div class="ings">${ingredients(r,true)}</div>
    <h4>${t('steps')}</h4><p>${r.s[L()]}</p>
    ${fromMenu==='browse'?(S.menu.includes(r.id)
      ?`<button class="btn" style="width:100%" data-a="cooked" data-v="${r.id}">${t('cooked')}</button>
        <div class="row2"><button class="btn sec" data-a="unmenu" data-v="${r.id}">${t('remove')}</button><button class="btn sec" data-a="closeSheet">${t('close')}</button></div>`
      :`<button class="btn" style="width:100%" data-a="addmenu" data-v="${r.id}">${t('addMenu')}</button>
        <div class="row2"><button class="btn sec" data-a="closeSheet">${t('close')}</button></div>`)
    :fromMenu?`<button class="btn" style="width:100%" data-a="cooked" data-v="${r.id}">${t('cooked')}</button>
      <div class="row2"><button class="btn sec" data-a="unmenu" data-v="${r.id}">${t('remove')}</button><button class="btn sec" data-a="closeSheet">${t('close')}</button></div>`
    :`<p class="ok">${n?`🛒 ${n} ${t('added')}`:`✅ ${t('noMiss')}`}</p>
      <button class="btn" style="width:100%" data-a="closeSheet">${t('cook')}</button>`}</div>`;
  s.addEventListener('click',e=>{if(e.target===s)closeSheet(s)});
  $('#app').appendChild(s);
  sheetDrag(s);
}

// ---- swipe (physique) ----
function decide(yes){
  const el=document.querySelector('.rc[data-top="1"]'); if(!el||el.dataset.busy) return;
  el.dataset.busy=1;
  const r=RMAP[+el.dataset.id];
  const box=el.getBoundingClientRect();
  el.classList.remove('drag');
  el.style.transition='transform .42s cubic-bezier(.2,.7,.3,1), opacity .34s ease-in .08s';
  el.style.transform=`translateX(${yes?620:-620}px) translateY(-30px) rotate(${yes?28:-28}deg)`; el.style.opacity=0;
  const b1=document.querySelector('.rc.back1'), b2=document.querySelector('.rc.back2');
  if(b1){ b1.style.transform='scale(1) translateY(0)'; b1.style.opacity=1; }
  if(b2){ b2.style.transform='scale(.95) translateY(14px)'; b2.style.opacity=.85; }
  if(yes){ buzz(14); confetti({x:box.left+box.width/2,y:box.top+box.height/2,count:26,power:9,shape:'heart',spread:Math.PI*1.5}); }
  setTimeout(()=>{
    let n=0;
    if(yes){ n=addToMenu(r); S.last={kind:'menu',id:r.id}; } else { S.skipped.push(r.id); S.last={kind:'skip',id:r.id}; }
    save(); promoteNext=true; render();
    if(yes) recipeSheet(r,n,false);
  },300);
}
function bindDrag(){
  const el=document.querySelector('.rc[data-top="1"]'); if(!el) return;
  const y=el.querySelector('.stamp.y'), n=el.querySelector('.stamp.n');
  const b1=document.querySelector('.rc.back1'), b2=document.querySelector('.rc.back2');
  let x0=null,dx=0,vx=0,lx=0,lt=0;
  const progress=p=>{
    if(b1){ b1.style.transform=`scale(${.95+.05*p}) translateY(${14-14*p}px)`; b1.style.opacity=.85+.15*p; }
    if(b2){ b2.style.transform=`scale(${.9+.05*p}) translateY(${28-14*p}px)`; b2.style.opacity=.55+.3*p; }
  };
  el.onpointerdown=e=>{ if(el.dataset.busy) return; x0=e.clientX;dx=0;vx=0;lx=x0;lt=performance.now();
    el.classList.add('drag'); el.style.transition='none'; el.setPointerCapture(e.pointerId); };
  el.onpointermove=e=>{
    if(x0===null) return;
    const now=performance.now(); dx=e.clientX-x0;
    vx=.7*vx+.3*((e.clientX-lx)/Math.max(1,now-lt)); lx=e.clientX; lt=now;
    el.style.transform=`translate(${dx}px,${-Math.abs(dx)*.05}px) rotate(${dx/16}deg)`;
    y.style.opacity=Math.max(0,Math.min(1,dx/90)); n.style.opacity=Math.max(0,Math.min(1,-dx/90));
    y.style.transform=`rotate(-10deg) scale(${.8+Math.min(.4,Math.max(0,dx)/250)})`;
    n.style.transform=`rotate(10deg) scale(${.8+Math.min(.4,Math.max(0,-dx)/250)})`;
    progress(Math.min(1,Math.abs(dx)/140));
  };
  const end=()=>{
    if(x0===null) return; x0=null;
    if(Math.abs(dx)>110||(Math.abs(vx)>.55&&Math.abs(dx)>35)) decide(dx>0||(dx===0&&vx>0));
    else {
      el.classList.remove('drag');
      el.style.transition='transform .55s cubic-bezier(.34,1.56,.64,1)';
      el.style.transform=''; y.style.opacity=0; n.style.opacity=0; progress(0);
    }
  };
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
  else if(a==='tab'){ if(S.tab===v) return; tabDir=TABS.indexOf(v)>TABS.indexOf(S.tab)?1:-1; S.tab=v; animNext=true; buzz(6); }
  else if(a==='theme'){
    const r=b.getBoundingClientRect();
    S.theme=S.theme==='auto'?'light':S.theme==='light'?'dark':'auto'; save();
    withReveal(()=>render(),r.left+r.width/2,r.top+r.height/2);
    toast(t('theme'+S.theme[0].toUpperCase()+S.theme.slice(1))); return;
  }
  else if(a==='f'){S[b.dataset.k]=b.dataset.k==='kind'?v:+v}
  else if(a==='ftoggle'){S.fopen=!S.fopen; fFresh=S.fopen}
  else if(a==='browse'){return recipeSheet(RMAP[+v],0,'browse')}
  else if(a==='addmenu'){
    const r=RMAP[+v], n=addToMenu(r); const br=b.getBoundingClientRect();
    confetti({x:br.left+br.width/2,y:br.top,count:30,power:10,shape:'heart',spread:Math.PI*1.2}); buzz(14);
    save(); closeSheet(b.closest('.sheet')); render(); toast(t('addedMenu')+(n?' · 🛒 '+n:'')); return;
  }
  else if(a==='veg'){S.veg=!S.veg}
  else if(a==='fr'){toggleFridge(v)}
  else if(a==='buy'){
    popIdx=+v; toggleBought(+v);
    if(S.list.length&&S.list.every(x=>x.done)){ const r=b.getBoundingClientRect(); confetti({x:r.left+r.width/2,y:r.top,count:70,power:11,spread:Math.PI}); toast(t('allBought')); buzz([10,40,10]); }
  }
  else if(a==='yes'){return decide(true)}
  else if(a==='no'){return decide(false)}
  else if(a==='reset'){S.skipped=[]; S.last=null; promoteNext=true}
  else if(a==='undo'){undo(); promoteNext=true}
  else if(a==='open'){return recipeSheet(RMAP[+v],0,true)}
  else if(a==='noop'){return}
  else if(a==='cooked'||a==='unmenu'){
    const sh=b.closest('.sheet');
    if(a==='cooked'){
      const r=b.getBoundingClientRect(); confetti({x:r.left+r.width/2,y:r.top,count:90,power:13,spread:Math.PI*1.1}); buzz([12,50,12]);
      const rec=RMAP[+v], used=urgentIn(rec);
      S.stats.cooked++; S.stats.saved+=used.length; S.urgent=S.urgent.filter(k=>!used.includes(k));
    }
    removeFromMenu(+v); closeSheet(sh);
  }
  else if(a==='clearDone'){S.list=S.list.filter(x=>!x.done)}
  else if(a==='wipe'){if(!confirm(t('resetQ')))return; const lang=S.lang; S=DEFAULTS(); S.lang=lang; S.tab='tonight'; S.onboarded=true; animNext=true}
  else if(a==='tuto'){return startOnboarding(false)}
  else if(a==='share'){
    const txt=listText();
    if(navigator.share) navigator.share({title:t('listT'),text:txt}).catch(()=>{});
    else if(navigator.clipboard) navigator.clipboard.writeText(txt).then(()=>toast(t('copied')),()=>{});
    return;
  }
  else if(a==='install'){if(deferredInstall){deferredInstall.prompt();deferredInstall=null}}
  else if(a==='closeSheet'){closeSheet(b.closest('.sheet'));return}
  else if(a==='pitch'){return openPitch()}
  save(); render();
});
document.addEventListener('submit',e=>{
  if(e.target.id!=='addForm') return;
  e.preventDefault();
  const v=$('#addIn').value.trim(); if(!v) return;
  S.list.push({c:v,done:false}); popIdx=S.list.length-1; save(); render(); const i=$('#addIn'); if(i) i.focus();
});
document.addEventListener('input',e=>{
  if(e.target.id!=='searchIn') return;
  S.q=e.target.value; const res=$('#results'); if(!res) return;
  res.innerHTML=resultsHTML();
  res.querySelectorAll('[data-a]').forEach(x=>{x.tabIndex=0;x.setAttribute('role','button')});
});
// Accessibilité clavier : Entrée / Espace activent les éléments cliquables non-boutons
document.addEventListener('keydown',e=>{
  if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('#app [data-a]:not(button)')){ e.preventDefault(); e.target.click(); }
});
document.addEventListener('keydown',e=>{
  if(S.tab!=='tonight'||$('.sheet')||$('#onb')||$('#pitch').classList.contains('show')||e.target.closest('input')) return;
  if(e.key==='ArrowRight') decide(true); else if(e.key==='ArrowLeft') decide(false);
});

render();
splash();
