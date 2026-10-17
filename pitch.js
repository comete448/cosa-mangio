const SLIDES={
 it:[
  ['🍽️','Cosa <em>mangio</em>?','Ogni giorno, la stessa domanda. Ogni giorno, la stessa fatica.'],
  ['😮‍💨','Il problema','<ul><li>🧠 Decidere ogni sera stanca: è la "decision fatigue".</li><li>🗑️ Lo spreco alimentare domestico è enorme (cifre da verificare prima dell\'orale).</li><li>📖 Le app di ricette sono cataloghi: si cerca, si scorre, non si decide.</li></ul>'],
  ['✨','La soluzione','<p>Un\'app che <b>decide per te</b> in 10 secondi.<br>Frigo + tempo + budget → 3 idee → uno swipe → lista della spesa automatica.</p>'],
  ['👆','Demo dal vivo','<p>Apriamo l\'app. Cambiamo i filtri, svuotiamo il frigo, scorriamo, e guardiamo la spesa riempirsi da sola.</p>'],
  ['🔁','Perché diventa un\'abitudine','<ul><li>⏰ Notifica alle 17:30, l\'ora in cui ci si chiede cosa cucinare</li><li>⚡ Meno di 10 secondi per uso</li><li>🧠 Impara i tuoi gusti ad ogni swipe</li></ul>'],
  ['💶','Come guadagna','<ul><li>🛒 Partnership con i supermercati (consegna della spesa, commissione)</li><li>⭐ Abbonamento Premium: famiglia, intolleranze, menu settimanale</li><li>🏷️ Offerte del volantino mirate sulle ricette scelte</li></ul>'],
  ['🇮🇹🇫🇷','Prossimi passi','<p>Foto dello scontrino → frigo automatico.<br>Versione bilingue IT/FR già pronta.</p><p style="margin-top:2vh"><b>Grazie! Domande?</b></p>']
 ],
 fr:[
  ['🍽️','Cosa <em>mangio</em>?','Chaque jour, la même question. Chaque jour, la même corvée.'],
  ['😮‍💨','Le problème','<ul><li>🧠 Décider chaque soir fatigue : c\'est la « fatigue décisionnelle ».</li><li>🗑️ Le gaspillage alimentaire des ménages est énorme (chiffres à vérifier avant l\'oral).</li><li>📖 Les apps de recettes sont des catalogues : on cherche, on scrolle, on ne décide pas.</li></ul>'],
  ['✨','La solution','<p>Une app qui <b>décide pour toi</b> en 10 secondes.<br>Frigo + temps + budget → 3 idées → un swipe → liste de courses automatique.</p>'],
  ['👆','Démo en direct','<p>On ouvre l\'app. On change les filtres, on vide le frigo, on swipe, et on regarde la liste de courses se remplir toute seule.</p>'],
  ['🔁','Pourquoi ça devient une habitude','<ul><li>⏰ Notification à 17h30, l\'heure où on se demande quoi cuisiner</li><li>⚡ Moins de 10 secondes par usage</li><li>🧠 Elle apprend tes goûts à chaque swipe</li></ul>'],
  ['💶','Comment elle gagne de l\'argent','<ul><li>🛒 Partenariats supermarchés (livraison des courses, commission)</li><li>⭐ Abonnement Premium : famille, intolérances, menu de la semaine</li><li>🏷️ Promos de prospectus ciblées sur les recettes choisies</li></ul>'],
  ['🇮🇹🇫🇷','Prochaines étapes','<p>Photo du ticket de caisse → frigo automatique.<br>Version bilingue IT/FR déjà prête.</p><p style="margin-top:2vh"><b>Merci ! Des questions ?</b></p>']
 ]};
let P=0;
function openPitch(){P=0;$('#pitch').classList.add('show');drawPitch()}
function closePitch(){$('#pitch').classList.remove('show')}
function drawPitch(){
  const s=SLIDES[S.lang], [big,h,body]=s[P];
  $('#pitch').innerHTML=`<button class="x" data-p="x">✕</button><div class="big">${big}</div><h1>${h}</h1>${body.startsWith('<')?body:`<p>${body}</p>`}
   <div class="ctl"><button data-p="prev">←</button><div class="dots">${s.map((_,i)=>`<i class="${i===P?'on':''}"></i>`).join('')}</div><button data-p="next">→</button><button data-p="lang">${S.lang==='it'?'FR':'IT'}</button></div>`;
}
$('#pitch').addEventListener('click',e=>{
  const b=e.target.closest('[data-p]'); if(!b) return; const a=b.dataset.p, n=SLIDES[S.lang].length;
  if(a==='x') closePitch(); else if(a==='next'){ if(P<n-1){P++;drawPitch()} else closePitch() }
  else if(a==='prev'){P=Math.max(0,P-1);drawPitch()}
  else if(a==='lang'){S.lang=S.lang==='it'?'fr':'it';save();render();drawPitch()}
});
document.addEventListener('keydown',e=>{
  if(!$('#pitch').classList.contains('show')) return;
  if(e.key==='ArrowRight'||e.key===' '){e.preventDefault();$('#pitch [data-p=next]').click()}
  else if(e.key==='ArrowLeft') $('#pitch [data-p=prev]').click();
  else if(e.key==='Escape') closePitch();
});
