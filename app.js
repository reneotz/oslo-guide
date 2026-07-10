/* Top Floor by Oslo Opera — guest guidebook app */
'use strict';

/* ---------- icons (inline SVG, stroke style) ---------- */
const P = {
  house:'M3 10.5 12 3l9 7.5M5.5 9.2V21h13V9.2M9.8 21v-6.2h4.4V21',
  plane:'M10.5 13.5 3 11l1.8-1.8L19 4 14.8 19.2 13 21l-2.5-7.5ZM10.5 13.5 19 4',
  key:'M20 4l-9.2 9.2M16.5 7.5l2.5 2.5M11.5 12.5a4 4 0 1 1-5.7 5.7 4 4 0 0 1 5.7-5.7Z',
  clock:'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3.2 2',
  sofa:'M5 11V8a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3M3.5 13.5a2 2 0 0 1 4 0V15h9v-1.5a2 2 0 0 1 4 0V19h-17ZM5.5 19v1.5M18.5 19v1.5',
  map:'M9 4.5 3.5 6.5v13L9 17.5l6 2 5.5-2v-13l-5.5 2-6-2ZM9 4.5v13M15 6.5v13',
  suitcase:'M5.5 8h13a1.5 1.5 0 0 1 1.5 1.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19V9.5A1.5 1.5 0 0 1 5.5 8ZM9 8V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V8M8.5 8v12.5M15.5 8v12.5',
  shield:'M12 3l7 2.8v5.7c0 4.4-2.9 7.3-7 9-4.1-1.7-7-4.6-7-9V5.8ZM9 12l2.2 2.2L15.5 9.7',
  heart:'M12 20.3S4 15.6 3.2 10.7A4.6 4.6 0 0 1 12 8a4.6 4.6 0 0 1 8.8 2.7C20 15.6 12 20.3 12 20.3Z',
  phone:'M6.5 3.5h3l1.5 4-2 1.5a11.5 11.5 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z',
  star:'m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.6-4.8 2.6.9-5.4L4.2 9.7l5.4-.8Z',
  grid:'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z',
  pin:'M12 21s7-5.8 7-11a7 7 0 1 0-14 0c0 5.2 7 11 7 11ZM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z',
  search:'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13ZM20 20l-4.8-4.8',
  back:'M15.5 4.5 8 12l7.5 7.5',
  chev:'m6 9 6 6 6-6',
  share:'M12 3v11M8 6.5 12 3l4 3.5M6 11H5a1.5 1.5 0 0 0-1.5 1.5v6A1.5 1.5 0 0 0 5 20h14a1.5 1.5 0 0 0 1.5-1.5v-6A1.5 1.5 0 0 0 19 11h-1',
  print:'M7 8V3.5h10V8M7 17H4.5v-7A1.5 1.5 0 0 1 6 8.5h12A1.5 1.5 0 0 1 19.5 10v7H17M7 14.5h10v6H7Z',
  ext:'M13 5h6v6M19 5l-8.5 8.5M10 6H6.5A1.5 1.5 0 0 0 5 7.5v10A1.5 1.5 0 0 0 6.5 19h10a1.5 1.5 0 0 0 1.5-1.5V14',
  arrow:'M5 12h14M13 6l6 6-6 6'
};
const icon = (n, s) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${s||''}><path d="${P[n]||P.star}"/></svg>`;

/* ---------- state ---------- */
let DATA = null;
let searchIndex = [];

/* guest personalization: ?name=&checkin=&checkout= (persisted) */
const params = new URLSearchParams(location.search);
for (const k of ['name','checkin','checkout']) {
  if (params.get(k)) localStorage.setItem('g_'+k, params.get(k));
}
const guest = k => localStorage.getItem('g_'+k) || '';
function fmtDate(s){
  if(!s) return '';
  const d = new Date(s);
  if (isNaN(d)) return s;
  return d.toLocaleDateString('en-GB', {weekday:'short', day:'numeric', month:'short'});
}

/* ---------- boot ---------- */
async function boot(){
  DATA = await fetch('content.json').then(r => r.json());
  buildIndex();
  buildTabbar();
  document.getElementById('backbtn').innerHTML = icon('back');
  document.getElementById('sharebtn').innerHTML = icon('share');
  document.getElementById('printbtn').innerHTML = icon('print');
  document.getElementById('backbtn').onclick = () => history.back();
  document.getElementById('sharebtn').onclick = doShare;
  document.getElementById('printbtn').onclick = printGuide;
  window.addEventListener('hashchange', render);
  render();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
}

function doShare(){
  const url = location.origin + location.pathname;
  if (navigator.share) navigator.share({title: DATA.property.name, url}).catch(()=>{});
  else { navigator.clipboard.writeText(url); alert('Link copied'); }
}

/* ---------- routing ---------- */
const route = () => location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
const go = h => { location.hash = h; };

function render(){
  const r = route();
  const view = document.getElementById('view');
  const topbar = document.getElementById('topbar');
  window.scrollTo(0,0);
  let html = '', tb = null;
  if (r.length === 0) html = vHome();
  else if (r[0]==='guide') { html = vGrid(); tb = DATA.property.name; }
  else if (r[0]==='c') { const c = cat(r[1]); html = c ? vCategory(c) : vGrid(); tb = c ? c.title : ''; }
  else if (r[0]==='t') { const c = cat(r[1]); const t = c && c.topics.find(t=>t.slug===r[2]); html = t ? vTopic(c,t) : vGrid(); tb = c ? c.title : ''; }
  else if (r[0]==='map') { html = '<div id="mapbox"></div>'; tb = 'Area map'; }
  else if (r[0]==='search') { html = vSearch(); tb = 'Search'; }
  topbar.classList.toggle('hidden', tb===null);
  document.getElementById('tbtitle').textContent = tb || '';
  view.innerHTML = html;
  view.className = 'fade';
  bindView(r);
  markTab(r[0]||'home');
}

/* ---------- views ---------- */
function vHome(){
  const p = DATA.property;
  const name = guest('name');
  const ci = guest('checkin'), co = guest('checkout');
  return `
  <section class="cover">
    <picture>
      <source media="(min-width:700px)" srcset="${p.coverDesktop}">
      <img class="bg" src="${p.coverMobile}" alt="">
    </picture>
    <div class="cover-inner">
      ${name ? `<div class="greet">👋 Welcome, ${esc(name)}</div>` : ''}
      <h1>${esc(p.name)}</h1>
      <div class="addr">${icon('pin')} ${esc(p.address)}, ${esc(p.postal)} ${esc(p.city)}</div>
      <div class="staycard">
        <div><div class="lbl">Check-in</div><div class="val">${ci ? fmtDate(ci) : 'After'}</div><div class="sub">from ${p.checkin}</div></div>
        <div><div class="lbl">Check-out</div><div class="val">${co ? fmtDate(co) : 'Before'}</div><div class="sub">by ${p.checkout}</div></div>
      </div>
      <br>
      <button class="btn-primary" onclick="location.hash='#/guide'">Open the guide ${icon('arrow')}</button>
    </div>
  </section>`;
}

function vGrid(){
  return `<div class="wrap">
    <div class="pagehead"><h2>Your guide</h2><p>Everything about the apartment and the best of Oslo.</p></div>
    <div class="grid">
      ${DATA.categories.map(c=>`
        <button class="tile" onclick="location.hash='#/c/${c.slug}'">
          <span class="ticon">${icon(c.icon)}</span>
          <span class="tname">${esc(c.title)}</span>
          ${c.topics.length>1?`<span class="tcount">${c.topics.length} topics</span>`:''}
        </button>`).join('')}
    </div>
  </div>`;
}

function vCategory(c){
  if (c.topics.length === 1) { /* single-topic category → straight to content */
    return vTopic(c, c.topics[0], true);
  }
  return `<div class="wrap">
    <div class="pagehead"><h2>${esc(c.title)}</h2></div>
    <div class="toplist">
      ${c.topics.map(t=>`
        <button class="topic-row" onclick="location.hash='#/t/${c.slug}/${t.slug}'">
          ${t.photo?`<img src="${t.photo}" alt="" loading="lazy">`:`<span class="ph">${icon(c.icon)}</span>`}
          <span class="tt">${esc(t.title)}</span>
          <span class="chev">${icon('back','style="transform:rotate(180deg)"')}</span>
        </button>`).join('')}
    </div>
  </div>`;
}

function vTopic(c, t, single){
  const secs = splitSections(t.html);
  return `
    ${t.photo?`<img class="hero" src="${t.photo}" alt="">`:''}
    <div class="wrap">
      <div class="topic-head">
        <div class="crumb">${esc(c.title)}</div>
        ${!single || t.title!==c.title ? `<h2>${esc(t.title)}</h2>` : `<h2 style="display:none"></h2>`}
      </div>
      ${secs.map((s,i)=> s.title ? `
        <div class="acc${i===0?' open':''}">
          <button aria-expanded="${i===0}" data-acc="${i}">${s.title}<span class="chev">${icon('chev')}</span></button>
          <div class="body prose">${s.html}</div>
        </div>` : `<div class="prose" style="padding:4px 0">${s.html}</div>`).join('')}
      <div class="topic-actions">
        ${t.loc?`<a class="chip" target="_blank" rel="noopener" href="https://www.google.com/maps/dir//${t.loc[0]},${t.loc[1]}">${icon('pin')} Directions</a>`:''}
        ${t.website?`<a class="chip" target="_blank" rel="noopener" href="${t.website}">${icon('ext')} Website</a>`:''}
      </div>
    </div>`;
}

function vSearch(){
  return `<div class="wrap">
    <div class="searchbar">${icon('search')}<input id="q" type="search" placeholder="Search the guide… (wifi, parking, coffee)" autocomplete="off"></div>
    <div class="sres" id="sres"></div>
  </div>`;
}

/* ---------- behaviors ---------- */
function bindView(r){
  // accordions
  document.querySelectorAll('.acc>button').forEach(b=>{
    b.onclick = () => {
      const acc = b.parentElement;
      acc.classList.toggle('open');
      b.setAttribute('aria-expanded', acc.classList.contains('open'));
    };
  });
  // external links in prose
  document.querySelectorAll('.prose a[href^="http"]').forEach(a=>{ a.target='_blank'; a.rel='noopener'; });
  // search
  if (r[0]==='search'){
    const q = document.getElementById('q');
    q.focus();
    q.oninput = () => showResults(q.value);
  }
  // map
  if (r[0]==='map') initMap();
}

function splitSections(html){
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const out = [];
  let cur = {title:null, html:''};
  for (const node of [...doc.body.childNodes]){
    if (node.nodeType===1 && node.tagName==='H2'){
      if (cur.html.trim()) out.push(cur);
      cur = {title: node.innerHTML, html:''};
    } else {
      cur.html += node.outerHTML || esc(node.textContent||'');
    }
  }
  if (cur.html.trim()) out.push(cur);
  return out.length ? out : [{title:null, html}];
}

/* ---------- search ---------- */
function buildIndex(){
  for (const c of DATA.categories)
    for (const t of c.topics){
      const div = document.createElement('div');
      div.innerHTML = t.html;
      searchIndex.push({c, t, text: (t.title + ' ' + div.textContent).toLowerCase(), plain: div.textContent});
    }
}
function showResults(q){
  const box = document.getElementById('sres');
  q = q.trim().toLowerCase();
  if (q.length < 2){ box.innerHTML=''; return; }
  const terms = q.split(/\s+/);
  const hits = searchIndex
    .map(e=>({e, score: terms.reduce((s,w)=> s + (e.t.title.toLowerCase().includes(w)?3:0) + (e.text.includes(w)?1:0), 0)}))
    .filter(h=>h.score>0).sort((a,b)=>b.score-a.score).slice(0,12);
  if (!hits.length){ box.innerHTML = '<div class="nores">No results — try another word.</div>'; return; }
  box.innerHTML = hits.map(({e})=>{
    const i = e.text.indexOf(terms[0]);
    let snip = i>-1 ? e.plain.slice(Math.max(0, i-30), i+90) : e.plain.slice(0,110);
    snip = esc(snip).replace(new RegExp('('+terms.map(rxesc).join('|')+')','gi'), '<mark>$1</mark>');
    return `<button class="topic-row" onclick="location.hash='#/t/${e.c.slug}/${e.t.slug}'">
      <span class="ph">${icon(e.c.icon)}</span>
      <span class="tt">${esc(e.t.title)}<div class="snip">…${snip}…</div></span>
    </button>`;
  }).join('');
}

/* ---------- map (Leaflet lazy-load) ---------- */
let leafletLoaded = false;
function initMap(){
  const load = cb => {
    if (leafletLoaded) return cb();
    const css = document.createElement('link');
    css.rel='stylesheet'; css.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(css);
    const js = document.createElement('script');
    js.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    js.onload = ()=>{ leafletLoaded=true; cb(); };
    js.onerror = ()=>{ document.getElementById('mapbox').innerHTML = '<div class="wrap"><div class="offline-note">Map needs an internet connection.</div></div>'; };
    document.body.appendChild(js);
  };
  load(()=>{
    const p = DATA.property;
    const m = L.map('mapbox').setView([p.lat, p.lng], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution:'&copy; OpenStreetMap'}).addTo(m);
    const homeIcon = L.divIcon({html:'<div style="background:#a8923c;color:#fff;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.4)">★</div>', className:'', iconSize:[34,34], iconAnchor:[17,17]});
    L.marker([p.lat,p.lng], {icon:homeIcon}).addTo(m).bindPopup(`<div class="map-pop"><b>${esc(p.name)}</b>${esc(p.address)}</div>`);
    for (const mk of DATA.markers){
      if (Math.abs(mk.lat-p.lat)<1e-6 && Math.abs(mk.lng-p.lng)<1e-6) continue;
      L.marker([mk.lat,mk.lng]).addTo(m).bindPopup(`<div class="map-pop"><b>${esc(mk.title)}</b><a target="_blank" rel="noopener" href="${mk.dir||('https://www.google.com/maps/dir//'+mk.lat+','+mk.lng)}">Directions →</a></div>`);
    }
  });
}

/* ---------- print full guide ---------- */
function printGuide(){
  const root = document.getElementById('print-root');
  const p = DATA.property;
  root.innerHTML = `<h1>${esc(p.name)} — Guest Guide</h1>
    <p>${esc(p.address)}, ${esc(p.postal)} ${esc(p.city)} · Check-in from ${p.checkin} · Check-out by ${p.checkout}</p>` +
    DATA.categories.map(c=>`<h2 class="pcat">${esc(c.title)}</h2>` +
      c.topics.map(t=>`<h3 class="ptop">${esc(t.title)}</h3><div>${t.html}</div>`).join('')).join('');
  window.print();
}

/* ---------- tabbar ---------- */
function buildTabbar(){
  const tabs = [['home','','Home','house'],['guide','#/guide','Guide','grid'],['map','#/map','Map','pin'],['search','#/search','Search','search']];
  document.getElementById('tabbar').innerHTML = tabs.map(([id,h,l,i])=>
    `<button data-tab="${id}" onclick="location.hash='${h}'">${icon(i)}${l}</button>`).join('');
}
function markTab(r){
  const map = {home:'home', guide:'guide', c:'guide', t:'guide', map:'map', search:'search'};
  document.querySelectorAll('#tabbar button').forEach(b=>b.classList.toggle('active', b.dataset.tab===map[r]||'home'===map[r]&&b.dataset.tab==='home'&&!r));
}

/* ---------- utils ---------- */
const cat = slug => DATA.categories.find(c=>c.slug===slug);
const esc = s => String(s??'').replace(/[&<>"]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const rxesc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

boot();
