// Tutoriel de première utilisation, puis choix du contenu du frigo.
const OB = {
 it:{welcome:'Benvenuto!',pickLang:'Scegli la tua lingua',next:'Avanti',back:'Indietro',skip:'Salta',start:'Inizia!',
   swipeT:'Scorri, scegli, cucina',swipeD:'Scorri a destra ♥ le ricette che ti piacciono, a sinistra ✕ quelle che salti. Un errore? Il tasto ↶ annulla.',
   swipeY:'LO FACCIO',swipeN:'PASSO',demoName:'Spaghetti al pomodoro',
   fridgeT:'Meno spreco, più gusto',fridgeD:'Nel Frigo, tocca un ingrediente: ce l\'hai. Tocca ancora: 🟠 da finire presto. Le ricette che lo usano passano avanti.',
   demoIng:'pomodori',stHave:'ce l\'hai',stUrg:'da finire',
   listT:'La spesa si fa da sola',listD:'Quando scegli una ricetta, gli ingredienti che mancano finiscono nella lista, con le quantità. Spunta quello che compri: entra nel frigo.',
   pickT:'Cosa hai in casa?',pickD:'Tocca gli ingredienti che hai (due volte = da finire presto). Potrai cambiare tutto più tardi.',who:'Per quante persone cucini?',persons:'persone',person:'persona'},
 fr:{welcome:'Bienvenue !',pickLang:'Choisis ta langue',next:'Suivant',back:'Retour',skip:'Passer',start:'C\'est parti !',
   swipeT:'Swipe, choisis, cuisine',swipeD:'Swipe à droite ♥ les recettes qui te plaisent, à gauche ✕ celles que tu passes. Une erreur ? Le bouton ↶ annule.',
   swipeY:'JE LE FAIS',swipeN:'SUIVANT',demoName:'Spaghetti à la tomate',
   fridgeT:'Moins de gaspillage, plus de goût',fridgeD:'Dans le Frigo, touche un ingrédient : tu l\'as. Touche encore : 🟠 à finir vite. Les recettes qui l\'utilisent passent en premier.',
   demoIng:'tomates',stHave:'tu l\'as',stUrg:'à finir',
   listT:'Les courses se font toutes seules',listD:'Quand tu choisis une recette, les ingrédients manquants arrivent dans la liste, avec les quantités. Coche ce que tu achètes : ça entre dans le frigo.',
   pickT:'Qu\'as-tu à la maison ?',pickD:'Touche les ingrédients que tu as (deux fois = à finir vite). Tu pourras tout changer plus tard.',who:'Pour combien de personnes cuisines-tu ?',persons:'personnes',person:'personne'}
};
const OB_STEPS=5;
let obStep=0;

function obChipClass(k){return 'chip '+(S.urgent.includes(k)?'urg':S.fridge.includes(k)?'on':'')}

function obBody(){
  const T=OB[S.lang];
  if(obStep===0) return `<div class="onb-emoji">🍽️</div><h2>${T.welcome}</h2><p class="sub">${OB.it.pickLang} · ${OB.fr.pickLang}</p>
    <div class="onb-langs"><button class="btn ${S.lang==='it'?'':'sec'}" data-ob="lang" data-v="it">Italiano</button><button class="btn ${S.lang==='fr'?'':'sec'}" data-ob="lang" data-v="fr">Français</button></div>`;
  if(obStep===1) return `<div class="demo-wrap"><div class="demo-card" style="--h:20"><div class="dstamp dy">${T.swipeY}</div><div class="dstamp dn">${T.swipeN}</div>
      <div class="dhero"><span>🍝</span></div><div class="dname">${T.demoName}</div></div></div><h2>${T.swipeT}</h2><p class="sub">${T.swipeD}</p>`;
  if(obStep===2) return `<div class="demo-chips"><span class="chip">🍅 ${T.demoIng}</span><i>→</i><span class="chip on">🍅 ${T.demoIng}<em>${T.stHave}</em></span><i>→</i><span class="chip urg">🍅 ${T.demoIng}<em>${T.stUrg}</em></span></div>
    <h2>${T.fridgeT}</h2><p class="sub">${T.fridgeD}</p>`;
  if(obStep===3) return `<div class="demo-list"><div class="list-item"><div class="box"></div><div class="nm">🧀 ${ING.pecorino[L()]}</div><span class="qty">40 g</span></div>
      <div class="list-item"><div class="box"></div><div class="nm">🥚 ${ING.uova[L()]}</div><span class="qty">×2</span></div>
      <div class="list-item done"><div class="box">✓</div><div class="nm">🥓 ${ING.guanciale[L()]}</div><span class="qty">80 g</span></div></div>
    <h2>${T.listT}</h2><p class="sub">${T.listD}</p>`;
  return `<h2>${T.pickT}</h2><p class="sub">${T.pickD}</p>
    <div class="cat">${T.who}</div><div class="grid">${[1,2,3,4,6].map(n=>`<span class="chip ${S.persons===n?'on':''}" data-ob="per" data-v="${n}">${n} ${n>1?T.persons:T.person}</span>`).join('')}</div>`+
    ['base','veg','lat','car'].map(c=>`<div class="cat">${CATS[c][L()]}</div><div class="grid">`+
      Object.keys(ING).filter(k=>ING[k][3]===c).map(k=>`<span class="${obChipClass(k)}" data-ob="fr" data-v="${k}">${ING[k][2]} ${ING[k][L()]}</span>`).join('')+`</div>`).join('');
}
function drawOnb(dir=1){
  const el=document.getElementById('onb'); if(!el) return;
  const T=OB[S.lang];
  el.innerHTML=`<div class="onb-top"><div class="onb-dots">${Array.from({length:OB_STEPS},(_,i)=>`<i class="${i===obStep?'on':''}"></i>`).join('')}</div><button class="onb-skip" data-ob="skip">${T.skip}</button></div>
   <div class="onb-body ${obStep===4?'scroll':''}" style="--dx:${dir*30}px">${obBody()}</div>
   <div class="onb-nav">${obStep>0?`<button class="btn sec" data-ob="back">${T.back}</button>`:'<span></span>'}<button class="btn" data-ob="next">${obStep===OB_STEPS-1?T.start:T.next}</button></div>`;
  el.querySelectorAll('[data-ob]:not(button)').forEach(e=>{e.tabIndex=0;e.setAttribute('role','button')});
}
function startOnboarding(fresh){
  if(document.getElementById('onb')) return;
  if(fresh){ S.fridge=[]; S.urgent=[]; save(); render(); }
  obStep=0;
  const el=document.createElement('div'); el.className='onb'; el.id='onb';
  document.getElementById('app').appendChild(el);
  drawOnb(0);
}
function finishOnb(celebrate){
  S.onboarded=true; save();
  const el=document.getElementById('onb');
  S.tab='tonight'; animNext=true; render();
  if(el){ el.classList.add('out'); setTimeout(()=>el.remove(),380); }
  if(celebrate) confetti({count:60,power:12,spread:Math.PI});
}
document.addEventListener('click',e=>{
  const b=e.target.closest('#onb [data-ob]'); if(!b) return;
  const a=b.dataset.ob, v=b.dataset.v;
  if(a==='skip') finishOnb(false);
  else if(a==='next'){ if(obStep<OB_STEPS-1){ obStep++; drawOnb(1); } else finishOnb(true); }
  else if(a==='back'){ if(obStep>0){ obStep--; drawOnb(-1); } }
  else if(a==='lang'){ S.lang=v; save(); render(); drawOnb(0); }
  else if(a==='fr'){ toggleFridge(v); save(); b.className=obChipClass(v); render(); }
  else if(a==='per'){ S.persons=+v; save(); b.parentElement.querySelectorAll('[data-ob=per]').forEach(x=>x.classList.toggle('on',+x.dataset.v===S.persons)); render(); }
});
document.addEventListener('keydown',e=>{
  if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('#onb [data-ob]:not(button)')){ e.preventDefault(); e.target.click(); }
});
if(!S.onboarded) startOnboarding(true);
