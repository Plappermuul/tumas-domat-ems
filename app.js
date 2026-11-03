const DATA = window.TUMA_DATA;
const $ = (s, root=document) => root.querySelector(s);
const workspace = $('#workspace'), content = $('#task-content');
let currentTask = null, selectedName = null, answers = {}, completed = new Set();
function openTask(task){ currentTask=task; selectedName=null; answers={}; $('#aufgaben').classList.add('hidden'); $('.intro').classList.add('hidden'); $('.landscape').classList.add('hidden'); workspace.classList.remove('hidden');
 if(task==='task0') renderOriginTask(); if(task==='task1') renderTask3(); if(task==='task2') renderTask1(); if(task==='task3') renderTask2(); workspace.scrollIntoView({behavior:'smooth',block:'start'}); }
function back(){workspace.classList.add('hidden');$('#aufgaben').classList.remove('hidden');$('.intro').classList.remove('hidden');$('.landscape').classList.remove('hidden');content.innerHTML='';currentTask=null;$('#aufgaben').scrollIntoView({behavior:'smooth'});}
$('#back').addEventListener('click',back); document.querySelectorAll('[data-task]').forEach(b=>b.addEventListener('click',()=>openTask(b.dataset.task)));
$('#learning-link').addEventListener('click',()=>{
 if(!workspace.classList.contains('hidden')) back();
 else $('#aufgaben').scrollIntoView({behavior:'smooth',block:'start'});
});
function renderOriginTask(){
 const steps=window.TUMA_ORIGIN_STEPS;
 content.innerHTML=`<p class="eyebrow">Aufgabe 1 · Entstehung der Tumas</p><h2>Wie entstanden die Tumas?</h2><p>Bearbeite beide Teile: Ordne zuerst die Bilder und verbinde danach jedes Bild mit dem passenden Text.</p><div class="stage-switch"><button class="button secondary active" id="origin-order-tab">Teil 1 · Bilder ordnen</button><button class="button secondary" id="origin-match-tab">Teil 2 · Texte zuordnen</button></div><div id="origin-stage"></div>`;
 const host=$('#origin-stage'), orderTab=$('#origin-order-tab'), matchTab=$('#origin-match-tab');
 const tiles=[...steps];for(let i=tiles.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[tiles[i],tiles[j]]=[tiles[j],tiles[i]]}if(tiles.every((step,index)=>step.id===steps[index].id))tiles.push(tiles.shift());
 const positions=Array(steps.length).fill(null);let selected=null,selectedFrom=null;
 const shuffledTexts=[...steps];for(let i=shuffledTexts.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffledTexts[i],shuffledTexts[j]]=[shuffledTexts[j],shuffledTexts[i]]}
 let selectedTextId=null;const matchedIds=new Set();
 function showPart(part){orderTab.classList.toggle('active',part===1);matchTab.classList.toggle('active',part===2);if(part===1)renderOrder();else renderMatching()}
 orderTab.addEventListener('click',()=>showPart(1));matchTab.addEventListener('click',()=>showPart(2));
 function renderOrder(){
  host.innerHTML=`<section class="origin-part"><h3>Ordne die Bilder</h3><p>Wähle eine Bildkachel und danach den Platz, an den sie gehört. Du kannst auch eine bereits abgelegte Kachel antippen, um sie zu verschieben.</p><div class="origin-order-slots" id="origin-order-slots"></div><h3 class="origin-bank-heading">Bildkacheln</h3><div class="origin-tile-bank" id="origin-tile-bank"></div><div class="feedback" id="origin-order-feedback" aria-live="polite">Lege alle fünf Kacheln in die richtige Reihenfolge.</div><button class="button" id="check-origin-order">Reihenfolge prüfen</button><button class="button secondary" id="shuffle-origin-order">Neu mischen</button></section>`;
  const slots=$('#origin-order-slots'),bank=$('#origin-tile-bank'),feedback=$('#origin-order-feedback');
  function draw(){
   slots.innerHTML='';bank.innerHTML='';
   positions.forEach((id,index)=>{const slot=document.createElement('div');slot.className='origin-order-slot';slot.dataset.position=index;const label=document.createElement('span');label.className='origin-slot-number';label.textContent=String(index+1);slot.append(label);if(id===null){const hint=document.createElement('span');hint.className='origin-slot-hint';hint.textContent='Kachel hier ablegen';slot.append(hint)}else{const step=steps.find(x=>x.id===id);const image=document.createElement('button');image.type='button';image.className='origin-placed-tile';image.setAttribute('aria-label','Kachel an Position '+(index+1)+' auswählen');image.innerHTML=`<img src="${step.image}" alt=""><span>Kachel verschieben</span>`;image.addEventListener('click',()=>{selected=id;selectedFrom=index;positions[index]=null;feedback.textContent='Wähle jetzt den neuen Platz für die Kachel.';draw()});slot.append(image)}slot.addEventListener('click',event=>{if(event.target.closest('.origin-placed-tile'))return;if(selected===null){feedback.textContent='Wähle zuerst eine Bildkachel aus.';return}const previous=selectedFrom;if(previous!==null){positions[previous]=positions[index];}positions[index]=selected;selected=null;selectedFrom=null;feedback.textContent='Kachel abgelegt. Du kannst weitere Kacheln ordnen.';draw()});slots.append(slot)});
   tiles.forEach(step=>{if(positions.includes(step.id))return;const card=document.createElement('button');card.type='button';card.className='origin-tile-card'+(selected===step.id?' selected':'');card.setAttribute('aria-label','Bildkachel auswählen');card.innerHTML=`<img src="${step.image}" alt="Bildkachel ohne Text">`;card.addEventListener('click',()=>{selected=selected===step.id?null:step.id;selectedFrom=null;feedback.textContent=selected?'Wähle nun einen Platz für die Kachel.':'Kachel nicht ausgewählt.';draw()});bank.append(card)});
  }
  $('#check-origin-order').addEventListener('click',()=>{if(positions.some(x=>x===null)){feedback.textContent='Ordne zuerst alle fünf Kacheln ein.';return}const right=positions.filter((id,index)=>id===steps[index].id).length;slots.querySelectorAll('.origin-order-slot').forEach((slot,index)=>slot.classList.toggle('correct',positions[index]===steps[index].id));feedback.textContent=right===steps.length?'Bravo! Alle fünf Bilder sind in der richtigen Reihenfolge.':`${right} von ${steps.length} Kacheln stehen richtig. Du kannst die Reihenfolge noch ändern.`});
  $('#shuffle-origin-order').addEventListener('click',()=>{for(let i=tiles.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[tiles[i],tiles[j]]=[tiles[j],tiles[i]]}if(tiles.every((step,index)=>step.id===steps[index].id))tiles.push(tiles.shift());positions.fill(null);selected=null;selectedFrom=null;renderOrder()});draw();
 }
 function renderMatching(){
  host.innerHTML=`<section class="origin-part"><h3>Verbinde Bild und Text</h3><p>Tippe zuerst einen Text und dann das passende Bild an. Richtige Paare bleiben verbunden.</p><div class="origin-match-layout"><div><h4>Bilder</h4><div class="origin-match-images" id="origin-match-images"></div></div><div><h4>Texte aus den Kacheln</h4><div class="origin-text-bank" id="origin-text-bank"></div></div></div><div class="feedback" id="origin-match-feedback" aria-live="polite">Wähle einen Text aus.</div><p class="result-line" id="origin-match-result">0 von ${steps.length} Paaren gefunden.</p><button class="button secondary" id="shuffle-origin-texts">Texte neu mischen</button></section>`;
  const images=$('#origin-match-images'),bank=$('#origin-text-bank'),feedback=$('#origin-match-feedback'),result=$('#origin-match-result');
  function updateResult(message){result.textContent=`${matchedIds.size} von ${steps.length} Paaren gefunden.`;if(message)feedback.textContent=message}
  steps.forEach(step=>{const alreadyMatched=matchedIds.has(step.id);const card=document.createElement('button');card.type='button';card.className='origin-match-image'+(alreadyMatched?' matched':'');card.dataset.imageId=step.id;card.innerHTML=`<img src="${step.image}" alt="Bildkachel ohne Text"><span class="origin-image-hint">${alreadyMatched?step.title:'Tippe auf das passende Bild'}</span>`;if(alreadyMatched){card.disabled=true;card.setAttribute('aria-label','Richtig zugeordnet: '+step.title)}card.addEventListener('click',()=>{if(card.classList.contains('matched'))return;if(selectedTextId===null){feedback.textContent='Wähle zuerst einen Text aus.';return}if(selectedTextId!==step.id){feedback.textContent='Das passt noch nicht. Versuche ein anderes Bild.';return}const textCard=bank.querySelector(`[data-text-id="${step.id}"]`);if(textCard){textCard.classList.remove('selected');textCard.classList.add('matched');textCard.disabled=true}card.classList.add('matched');card.querySelector('.origin-image-hint').textContent=step.title;card.setAttribute('aria-label','Richtig zugeordnet: '+step.title);selectedTextId=null;matchedIds.add(step.id);updateResult(matchedIds.size===steps.length?'Bravo! Du hast alle Texte den passenden Bildern zugeordnet.':'Richtig! Dieses Paar bleibt verbunden.')});images.append(card)});
  shuffledTexts.forEach(step=>{const alreadyMatched=matchedIds.has(step.id);const card=document.createElement('button');card.type='button';card.className='origin-text-card'+(alreadyMatched?' matched':'')+(selectedTextId===step.id?' selected':'');card.dataset.textId=step.id;card.innerHTML=`<strong>${step.title}</strong><span>${step.text}</span>`;card.disabled=alreadyMatched;card.addEventListener('click',()=>{if(card.disabled)return;bank.querySelectorAll('.origin-text-card').forEach(x=>x.classList.remove('selected'));if(selectedTextId===step.id){selectedTextId=null;card.classList.remove('selected');feedback.textContent='Wähle einen Text aus.'}else{selectedTextId=step.id;card.classList.add('selected');feedback.textContent='Tippe jetzt das passende Bild an.'}});bank.append(card)});
  $('#shuffle-origin-texts').addEventListener('click',()=>{for(let i=shuffledTexts.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffledTexts[i],shuffledTexts[j]]=[shuffledTexts[j],shuffledTexts[i]]}renderMatching()});updateResult();
 }
 showPart(1);
}
function renderTask1(){
 const locations=[
  {name:'Tuma Platta',lat:46.83425,lon:9.44274},{name:'Tuma Tschelle',lat:46.83213,lon:9.4482},
  {name:'Tuma Casté',lat:46.83539,lon:9.44773},{name:'Tuma Turera',lat:46.83733,lon:9.45064},
  {name:'Tuma Marchesa',lat:46.8296,lon:9.4483},{name:'Tuma Falveng',lat:46.8312,lon:9.4536},
  {name:'Tuma Padrusa',lat:46.83384,lon:9.43951},{name:'Tuma Carpusa',lat:46.83094,lon:9.43804},
  {name:'Tum’Arsa',lat:46.8247,lon:9.4404},{name:'Tuma Varsera',lat:46.82366,lon:9.44389},
  {name:'Tuma Lunga',lat:46.824,lon:9.4368},{name:'Tuma Calchera',lat:46.8228,lon:9.4332}
 ];
 content.innerHTML=`<p class="eyebrow">Aufgabe 3 · Beobachten und zuordnen</p><h2>Finde die Tumas</h2><p>Wähle einen Namen und tippe die passende Stelle an. Starte mit den Bildern oder wechsle zur Karte.</p><div class="stage-switch"><button class="button secondary active" id="photos-mode">Bilder · leicht</button><button class="button secondary" id="map-mode">Karte · schwierig</button></div><div class="name-bank" id="name-bank"></div><div id="photo-tasks"></div><div id="map-stage" class="hidden"><div id="tuma-map" role="application" aria-label="Swisstopo-Karte zum Zuordnen der Tumas"></div><p class="map-credit">Kartengrundlage: © swisstopo</p></div><div class="feedback" id="t1-feedback" aria-live="polite"></div><button class="button" id="check-t1">Aufgabe auswerten</button>`;
 const bank=$('#name-bank');
 DATA.infos.forEach(item=>{let b=document.createElement('button');b.className='name-chip';b.textContent=item.name;b.addEventListener('click',()=>{selectedName=item.name;document.querySelectorAll('.name-chip').forEach(x=>x.classList.toggle('selected',x===b));$('#t1-feedback').textContent='Jetzt die passende Stelle antippen.';});bank.append(b)});
 const photos=$('#photo-tasks');
 Object.entries(DATA.hotspots).forEach(([file,spots],idx)=>{let wrap=document.createElement('div');wrap.className='photo-task';wrap.innerHTML=`<h3>${idx===0?'Bild 1':'Bild 2'}</h3><div class="interactive-photo"><img src="assets/${file}" alt="Landschaftsbild ${idx+1}"><div class="hotspot-layer"></div></div>`;let layer=$('.hotspot-layer',wrap);spots.forEach(s=>{let h=document.createElement('button');h.className='hotspot';h.dataset.spot=s.name;h.style.left=s.x+'%';h.style.top=s.y+'%';h.title='Standort auswählen';h.setAttribute('aria-label','Diesen Standort auswählen');h.addEventListener('click',()=>placeAnswer(s.name,h));layer.append(h)});photos.append(wrap)});
 let map=null; const mapMarks=new Map();
 function releaseName(name){const b=[...document.querySelectorAll('.name-chip')].find(x=>x.textContent===name);if(b){b.disabled=false;b.classList.remove('used')}}
 function placeAnswer(location,marker){if(!selectedName){$('#t1-feedback').textContent='Wähle zuerst einen Namen aus der Liste.';return}if(answers[selectedName]){$('#t1-feedback').textContent='Du hast diesen Namen bereits platziert. Wähle einen anderen.';return}if(Object.values(answers).includes(location)){$('#t1-feedback').textContent='Dieser Standort ist bereits zugeordnet. Wähle einen anderen.';return}answers[selectedName]=location;if(marker){marker.dataset.attempt=selectedName;marker.classList.add('placed');marker.textContent='✓';marker.disabled=true}const chip=[...document.querySelectorAll('.name-chip')].find(b=>b.textContent===selectedName);if(chip){chip.classList.add('used');chip.disabled=true}$('#t1-feedback').textContent='Standort gespeichert. Werte die Zuordnungen am Schluss aus.';selectedName=null;document.querySelectorAll('.name-chip').forEach(x=>x.classList.remove('selected'))}
 function ensureMap(){if(map)return;if(!window.L){$('#t1-feedback').textContent='Die Karte konnte nicht geladen werden. Prüfe die Internetverbindung.';return}map=L.map('tuma-map',{scrollWheelZoom:false}).setView([46.8304,9.4434],15);L.tileLayer('https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-farbe/default/current/3857/{z}/{x}/{y}.jpeg',{minZoom:8,maxZoom:18,attribution:'© <a href="https://www.swisstopo.admin.ch/" target="_blank" rel="noreferrer">swisstopo</a>'}).addTo(map);map.on('click',e=>{if(!selectedName){$('#t1-feedback').textContent='Wähle zuerst einen Namen aus der Liste.';return}let nearest=null,dist=Infinity;locations.forEach(loc=>{const d=map.distance(e.latlng,[loc.lat,loc.lon]);if(d<dist){dist=d;nearest=loc}});if(dist>180){$('#t1-feedback').textContent='Tippe näher an einen Tuma-Standort.';return}if(mapMarks.has(nearest.name)){$('#t1-feedback').textContent='Dieser Standort ist bereits zugeordnet. Wähle einen anderen.';return}const marker=L.circleMarker([nearest.lat,nearest.lon],{radius:10,color:'#fff',weight:2,fillColor:'#285b48',fillOpacity:1}).addTo(map);marker.bindTooltip('✓');mapMarks.set(nearest.name,marker);placeAnswer(nearest.name,null)});setTimeout(()=>map.invalidateSize(),80)}
 $('#photos-mode').addEventListener('click',()=>{$('#photo-tasks').classList.remove('hidden');$('#map-stage').classList.add('hidden');$('#photos-mode').classList.add('active');$('#map-mode').classList.remove('active')});
 $('#map-mode').addEventListener('click',()=>{$('#photo-tasks').classList.add('hidden');$('#map-stage').classList.remove('hidden');$('#map-mode').classList.add('active');$('#photos-mode').classList.remove('active');ensureMap();if(map)setTimeout(()=>map.invalidateSize(),80)});
 $('#check-t1').addEventListener('click',()=>{let total=DATA.infos.length,right=0;Object.entries(answers).forEach(([chosen,placed])=>{if(chosen===placed)right++});let wrong=Object.entries(answers).filter(([chosen,placed])=>chosen!==placed).map(([chosen])=>chosen);document.querySelectorAll('.hotspot').forEach(h=>{if(h.dataset.attempt&&h.dataset.attempt===h.dataset.spot){h.classList.remove('placed');h.classList.add('correct');h.textContent='✓';h.disabled=true}else{h.classList.remove('placed','correct');h.textContent='';h.disabled=false;h.dataset.attempt=''}});wrong.forEach(name=>{releaseName(name);delete answers[name]});if(wrong.length){$('#t1-feedback').textContent=`Du hast ${right} Zuordnungen richtig. ${wrong.length} Namen sind noch offen und können erneut versucht werden.`}else if(Object.keys(answers).length===total){$('#t1-feedback').textContent=`Bravo! Du hast alle ${total} Tumas richtig gefunden.`}else{$('#t1-feedback').textContent=`${right} Zuordnungen sind richtig. Es fehlen noch ${total-Object.keys(answers).length} Namen.`}if(map){for(const [spot,marker] of mapMarks){const attempt=Object.entries(answers).find(([,placed])=>placed===spot)?.[0];if(!attempt){map.removeLayer(marker);mapMarks.delete(spot)}}}});
}
function renderTask2() {
 if (window.task2PointerController) window.task2PointerController.abort();
 const controller = new AbortController();
 window.task2PointerController = controller;
 content.innerHTML = '<p class="eyebrow">Aufgabe 4 · Namen kennenlernen</p><h2>Verbinde die Namen</h2><p>Ordne jede deutsche Bedeutung dem passenden romanischen Namen zu. Richtige Paare bleiben liegen; falsche springen zurück. Auf Tablets geht es auch per Tippen.</p><div class="pair-board" id="pair-board"></div><h3 class="bank-heading">Deutsche Bedeutungen</h3><div class="german-bank" id="german-bank"></div><div class="feedback" id="match-feedback" aria-live="polite">Ziehe eine Bedeutung zu einem Namen oder tippe zuerst eine Karte an.</div><div class="result-line" id="match-result"></div><button class="button secondary" id="restart-match">Neu mischen</button>';
 const board = $('#pair-board');
 const bank = $('#german-bank');
 let selectedCard = null;
 let drag = null;
 let matches = 0;

 function shuffle(items) {
  for (let i = items.length - 1; i > 0; i--) {
   const j = Math.floor(Math.random() * (i + 1));
   [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
 }
 function updateResult(message) {
  $('#match-result').textContent = matches + ' von ' + DATA.infos.length + ' Paaren gefunden.';
  if (message) $('#match-feedback').textContent = message;
 }
 function animateReturn(card) {
  card.classList.remove('bounce-back');
  void card.offsetWidth;
  card.classList.add('bounce-back');
  setTimeout(() => card.classList.remove('bounce-back'), 450);
 }
 function tryMatch(card, slot) {
  if (!card || !slot || slot.classList.contains('filled')) return;
  if (card.dataset.cardName !== slot.dataset.dropName) {
   selectedCard = null;
   card.classList.remove('selected');
   animateReturn(card);
   updateResult('Das passt noch nicht. Die Karte ist an ihren Platz zurückgesprungen. Versuche es nochmals.');
   return;
  }
  selectedCard = null;
  card.classList.remove('selected');
  card.classList.add('matched-card');
  card.disabled = true;
  const hint = slot.querySelector('.drop-hint');
  if (hint) hint.remove();
  slot.classList.add('filled', 'correct');
  slot.append(card);
  matches++;
  if (matches === DATA.infos.length) {
   updateResult('Bravo! Du hast alle Namen richtig verbunden.');
  } else {
   updateResult('Richtig! Diese Karte bleibt beim Namen.');
  }
 }
 function clearDrag() {
  if (!drag) return;
  drag.card.classList.remove('dragging-origin');
  if (drag.ghost) drag.ghost.remove();
  const didDrag = drag.started;
  drag = null;
  if (didDrag) window.task2IgnoreClickUntil = Date.now() + 400;
 }
 function onPointerMove(event) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  const dx = event.clientX - drag.startX;
  const dy = event.clientY - drag.startY;
  if (!drag.started && Math.hypot(dx, dy) < 7) return;
  if (!drag.started) {
   drag.started = true;
   const rect = drag.card.getBoundingClientRect();
   drag.card.classList.add('dragging-origin');
   drag.ghost = drag.card.cloneNode(true);
   drag.ghost.classList.add('drag-ghost');
   drag.ghost.disabled = true;
   drag.ghost.style.width = rect.width + 'px';
   document.body.append(drag.ghost);
  }
  drag.ghost.style.left = event.clientX + 'px';
  drag.ghost.style.top = event.clientY + 'px';
  event.preventDefault();
 }
 function onPointerUp(event) {
  if (!drag || event.pointerId !== drag.pointerId) return;
  if (drag.started) {
   const target = document.elementFromPoint(event.clientX, event.clientY);
   const slot = target && target.closest('.drop-slot');
   const card = drag.card;
   clearDrag();
   if (slot && content.contains(slot)) tryMatch(card, slot);
   else {
    animateReturn(card);
    updateResult('Lege die Karte auf ein passendes Namensfeld.');
   }
  } else {
   drag = null;
  }
 }
 document.addEventListener('pointermove', onPointerMove, { signal: controller.signal });
 document.addEventListener('pointerup', onPointerUp, { signal: controller.signal });
 document.addEventListener('pointercancel', clearDrag, { signal: controller.signal });

 DATA.infos.forEach(item => {
  const row = document.createElement('div');
  row.className = 'pair-row';
  const name = document.createElement('div');
  name.className = 'romanian-card';
  name.textContent = item.name;
  const arrow = document.createElement('span');
  arrow.className = 'pair-arrow';
  arrow.textContent = '→';
  const slot = document.createElement('div');
  slot.className = 'drop-slot';
  slot.dataset.dropName = item.name;
  slot.tabIndex = 0;
  slot.setAttribute('role', 'group');
  slot.setAttribute('aria-label', 'Ablagefeld für ' + item.name);
  const hint = document.createElement('span');
  hint.className = 'drop-hint';
  hint.textContent = 'Deutsche Bedeutung hier ablegen';
  slot.append(hint);
  slot.addEventListener('click', () => {
   if (selectedCard) tryMatch(selectedCard, slot);
  });
  slot.addEventListener('keydown', event => {
   if ((event.key === 'Enter' || event.key === ' ') && selectedCard) {
    event.preventDefault();
    tryMatch(selectedCard, slot);
   }
  });
  row.append(name, arrow, slot);
  board.append(row);
 });

 shuffle([...DATA.infos]).forEach(item => {
  const card = document.createElement('button');
  card.type = 'button';
  card.className = 'german-card';
  card.textContent = item.meaning;
  card.dataset.cardName = item.name;
  card.addEventListener('pointerdown', event => {
   if (card.disabled || event.button !== 0) return;
   drag = { card, pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, started: false, ghost: null };
  });
  card.addEventListener('click', event => {
   if (Date.now() < (window.task2IgnoreClickUntil || 0)) {
    event.preventDefault();
    return;
   }
   if (card.disabled) return;
   if (selectedCard === card) {
    selectedCard = null;
    card.classList.remove('selected');
    $('#match-feedback').textContent = 'Auswahl aufgehoben. Tippe eine Bedeutung an oder ziehe sie zum passenden Namen.';
    return;
   }
   if (selectedCard) selectedCard.classList.remove('selected');
   selectedCard = card;
   card.classList.add('selected');
   $('#match-feedback').textContent = 'Jetzt das Ablagefeld neben dem passenden romanischen Namen antippen.';
  });
  bank.append(card);
 });
 $('#match-result').textContent = '0 von ' + DATA.infos.length + ' Paaren gefunden.';
 $('#restart-match').addEventListener('click', () => renderTask2());
}function renderTask3(){
 content.innerHTML=`<p class="eyebrow">Aufgabe 2 · Lesen und entdecken</p><h2>Erkunde die Tumas</h2><p class="section-intro">Tuma kommt vom lateinischen Wort «tumulus» und bedeutet «Hügel». Alle Hügel tragen romanische Namen. Sie stehen unter Naturschutz.</p><p>Wähle eine Tuma aus. Dann öffnet sich ihr Kurzbeschrieb.</p><section class="tuma-section"><h3>Die Tumas von heute</h3><div class="tuma-grid" id="tuma-grid"></div></section><section class="tuma-section special-tumas"><h3>Besondere und historische Tumas</h3><p class="section-intro">Eine Tuma entstand auf besondere Weise. Zwei weitere gibt es heute nicht mehr.</p><div class="tuma-grid" id="special-tuma-grid"></div></section><div id="detail-panel" class="detail-panel hidden" aria-live="polite"></div>`;
 const panel=$('#detail-panel');
 function addCard(x,i,grid){let b=document.createElement('button');b.className='tuma-card';b.innerHTML=`<span class="mini-number">${String(i+1).padStart(2,'0')}</span><strong>${x.name}</strong><span>${x.category||x.meaning}</span><span class="card-link">Mehr erfahren →</span>`;b.addEventListener('click',()=>{const casteVideo=x.name==='Tuma Casté'?'<div class="youtube-video"><iframe src="https://www.youtube.com/embed/wsT1rBBAoqo?playsinline=1" title="Video zur Tuma Casté" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>':'';panel.classList.remove('hidden');panel.innerHTML=`<button class="close-detail" aria-label="Schliessen">×</button><p class="eyebrow">${x.category||'Über diese Tuma'}</p><h3>${x.name}</h3><p class="meaning">${x.meaning}</p>${casteVideo}<p>${x.text}</p>`;$('.close-detail',panel).addEventListener('click',()=>{const player=$('iframe',panel);if(player)player.src='about:blank';panel.classList.add('hidden')});panel.scrollIntoView({behavior:'smooth',block:'nearest'})});grid.append(b)}
 DATA.infos.forEach((x,i)=>addCard(x,i,$('#tuma-grid')));
 DATA.specialInfos.forEach((x,i)=>addCard(x,i,$('#special-tuma-grid')));
}
