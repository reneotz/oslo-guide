/* Top Floor by Oslo Opera — guest guidebook app v2 */
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
  arrow:'M5 12h14M13 6l6 6-6 6',
  wifi:'M4 9.5a12 12 0 0 1 16 0M6.8 12.8a8 8 0 0 1 10.4 0M9.6 16a4 4 0 0 1 4.8 0M12 19.2h.01',
  crosshair:'M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM12 2.5V6M12 18v3.5M2.5 12H6M18 12h3.5'
};
const icon = (n, s) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" ${s||''}><path d="${P[n]||P.star}"/></svg>`;

/* ---------- state ---------- */
let DATA = null;
let searchIndex = [];
let PLACES = [];
let WIFI = null;

/* guest personalization: ?name=&checkin=&checkout= (persisted) */
const params = new URLSearchParams(location.search);
for (const k of ['name','checkin','checkout']) {
  if (params.get(k)) localStorage.setItem('g_'+k, params.get(k));
}
const guest = k => localStorage.getItem('g_'+k) || '';

/* ---------- date/time helpers (Europe/Oslo) ---------- */
function fmtDate(s){
  if(!s) return '';
  const d = new Date(s + 'T12:00:00');
  if (isNaN(d)) return s;
  return d.toLocaleDateString('en-GB', {weekday:'short', day:'numeric', month:'short'});
}
const osloToday = () => new Intl.DateTimeFormat('en-CA', {timeZone:'Europe/Oslo'}).format(new Date());
const osloTime  = () => new Intl.DateTimeFormat('en-GB', {timeZone:'Europe/Oslo', hour:'2-digit', minute:'2-digit'}).format(new Date());
const osloHour  = () => parseInt(new Intl.DateTimeFormat('en-GB', {timeZone:'Europe/Oslo', hour:'2-digit', hour12:false}).format(new Date()), 10);
const dayDiff = (a, b) => Math.round((Date.parse(b+'T00:00:00Z') - Date.parse(a+'T00:00:00Z')) / 864e5);

function greeting(){
  const h = osloHour();
  const w = h < 5 ? 'Welcome' : h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
  const n = guest('name');
  return n ? `${w}, ${n}` : w;
}

/* stay phase from personalized dates */
function stayPhase(){
  const ci = guest('checkin'), co = guest('checkout');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(ci)) return null;
  const t = osloToday();
  const dIn = dayDiff(t, ci);
  if (dIn > 0) return {icon:'✈️', html:`<b>${dIn} day${dIn>1?'s':''}</b>&nbsp;until check-in — plan your arrival`, target:'#/c/getting-here'};
  if (dIn === 0) return {icon:'🔑', html:`<b>Check-in today</b>&nbsp;— from ${DATA.property.checkin}`, target:'#/c/check-in'};
  if (/^\d{4}-\d{2}-\d{2}$/.test(co)) {
    const dOut = dayDiff(t, co);
    if (dOut > 0) return {icon:'🌊', html:`<b>Day ${1-dIn}</b>&nbsp;of your stay — make it count`, target:'#/c/exploring-oslo'};
    if (dOut === 0) return {icon:'🧳', html:`<b>Check-out today</b>&nbsp;— by ${DATA.property.checkout}`, target:'#/c/check-out'};
  }
  return null;
}

/* ---------- live Oslo weather (open-meteo, no key) ---------- */
const WMOJI = {0:'☀️',1:'🌤️',2:'⛅',3:'☁️',45:'🌫️',48:'🌫️',51:'🌦️',53:'🌦️',55:'🌧️',61:'🌧️',63:'🌧️',65:'🌧️',66:'🌧️',67:'🌧️',71:'🌨️',73:'🌨️',75:'❄️',77:'❄️',80:'🌦️',81:'🌧️',82:'⛈️',85:'🌨️',86:'❄️',95:'⛈️',96:'⛈️',99:'⛈️'};
const WLBL = {0:'clear',1:'mostly clear',2:'partly cloudy',3:'overcast',45:'fog',48:'fog',51:'drizzle',53:'drizzle',55:'drizzle',61:'light rain',63:'rain',65:'heavy rain',71:'light snow',73:'snow',75:'heavy snow',80:'showers',81:'showers',82:'heavy showers',95:'thunderstorm'};
async function getWeather(){
  try {
    const c = JSON.parse(sessionStorage.getItem('wx') || 'null');
    if (c && Date.now() - c.t < 18e5) return c.v;
    const p = DATA.property;
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lng}&current=temperature_2m,weather_code&timezone=Europe%2FOslo`);
    const j = await r.json();
    const v = {temp: Math.round(j.current.temperature_2m), code: j.current.weather_code};
    sessionStorage.setItem('wx', JSON.stringify({t: Date.now(), v}));
    return v;
  } catch(e){ return null; }
}
function paintWeather(){
  getWeather().then(v => {
    if (!v) return;
    const s = `${WMOJI[v.code]||'🌡️'} ${v.temp}°C ${WLBL[v.code]||''}`.trim();
    const chip = document.getElementById('nowchip');
    if (chip){ chip.hidden = false; chip.textContent = `${s} · ${osloTime()} in Oslo`; }
    const line = document.getElementById('nowline');
    if (line) line.textContent = `${osloTime()} in Oslo · ${s}`;
  });
}

/* ---------- boot ---------- */
async function boot(){
  DATA = await fetch('content.json').then(r => r.json());
  buildIndex();
  buildPlaces();
  findWifi();
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
  else if (navigator.clipboard) { navigator.clipboard.writeText(url); toast('Link copied'); }
}

function findWifi(){
  let best = null;
  for (const c of DATA.categories)
    for (const t of c.topics){
      const txt = t.html.replace(/<[^>]+>/g, ' ');
      if (/password/i.test(txt) && /wi-?fi|network/i.test(txt)){
        const ssid = (txt.match(/network\s*:\s*([A-Za-z0-9 _-]{2,24}?)(?:\s\s|\s[A-Z(]|$)/i) || [])[1];
        const pass = (txt.match(/password\s*:\s*(\S+)/i) || [])[1];
        const cand = {ssid: (ssid||'').trim(), pass, path: `#/t/${c.slug}/${t.slug}`};
        if (cand.ssid && cand.pass){ WIFI = cand; return; } /* complete match wins */
        if (!best && cand.pass) best = cand;
      }
    }
  WIFI = best;
}
function copyWifi(){
  if (WIFI && WIFI.pass && navigator.clipboard){
    navigator.clipboard.writeText(WIFI.pass)
      .then(() => toast(`Wi-Fi password copied${WIFI.ssid ? ' · network “' + WIFI.ssid + '”' : ''}`))
      .catch(() => { location.hash = WIFI.path; });
  } else if (WIFI) location.hash = WIFI.path;
}

/* ---------- routing ---------- */
const route = () => location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);

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
  else if (r[0]==='map') { html = '<div class="mapwrap"><div id="mapbox"></div><div class="tspin" id="maptip"></div></div>'; tb = 'Area map'; }
  else if (r[0]==='search') { html = vSearch(); tb = 'Search'; }
  topbar.classList.toggle('hidden', tb===null);
  document.getElementById('tbtitle').textContent = tb || '';
  view.innerHTML = html;
  view.className = 'view-enter';
  bindView(r);
  markTab(r[0]||'home');
}

/* ---------- views ---------- */
function vHome(){
  const p = DATA.property;
  const ci = guest('checkin'), co = guest('checkout');
  const phase = stayPhase();
  let i = 0;
  return `
  <section class="cover">
    <picture>
      <source media="(min-width:700px)" srcset="${p.coverDesktop}">
      <img class="bg" src="${p.coverMobile}" alt="">
    </picture>
    <div class="cover-inner">
      <div class="chiprow" style="--i:${i++}">
        <span class="greet">👋 ${esc(greeting())}</span>
        <span class="now" id="nowchip" hidden></span>
      </div>
      <h1 style="--i:${i++}">${esc(p.name)}</h1>
      <div class="addr" style="--i:${i++}">${icon('pin')} ${esc(p.address)}, ${esc(p.postal)} ${esc(p.city)}</div>
      <div class="staycard" style="--i:${i++}">
        <div><div class="lbl">Check-in</div><div class="val">${ci ? fmtDate(ci) : 'After'}</div><div class="sub">from ${p.checkin}</div></div>
        <div><div class="lbl">Check-out</div><div class="val">${co ? fmtDate(co) : 'Before'}</div><div class="sub">by ${p.checkout}</div></div>
      </div>
      ${phase ? `<div style="--i:${i++}"><button class="phasechip" onclick="location.hash='${phase.target}'">${phase.icon} ${phase.html}</button></div>` : ''}
      <div style="--i:${i++}"><button class="btn-primary" onclick="location.hash='#/guide'">Open the guide ${icon('arrow')}</button></div>
    </div>
  </section>`;
}

function vGrid(){
  const p = DATA.property;
  const phase = stayPhase();
  const dirUrl = `https://www.google.com/maps/dir//${p.lat},${p.lng}`;
  const installed = matchMedia('(display-mode: standalone)').matches;
  const hintDismissed = localStorage.getItem('hint_dismissed');
  return `<div class="wrap">
    <div class="pagehead">
      <h2>Your guide</h2>
      <p class="nowline" id="nowline">${osloTime()} in Oslo</p>
    </div>
    ${phase ? `<button class="phase" onclick="location.hash='${phase.target}'">${phase.icon} <span>${phase.html}</span><span class="chev">${icon('arrow')}</span></button>` : ''}
    <div class="quickrow">
      ${WIFI ? `<button class="qchip" onclick="copyWifi()">${icon('wifi')} Wi-Fi password</button>` : ''}
      <a class="qchip" target="_blank" rel="noopener" href="${dirUrl}">${icon('pin')} Directions here</a>
      <button class="qchip" onclick="location.hash='#/c/check-in'">${icon('key')} Check-in</button>
      <button class="qchip" onclick="location.hash='#/c/house-rules-safety'">${icon('shield')} House rules</button>
    </div>
    <div class="grid stagger">
      ${DATA.categories.map((c,i)=>`
        <button class="tile" style="--i:${i}" onclick="location.hash='#/c/${c.slug}'">
          <span class="ticon">${icon(c.icon)}</span>
          <span class="tname">${esc(c.title)}</span>
          ${c.topics.length>1?`<span class="tcount">${c.topics.length} topics</span>`:''}
        </button>`).join('')}
    </div>
    ${!installed && !hintDismissed ? `
    <div class="hint" id="a2hs">${icon('star')} <span>Tip: add this guide to your home screen — it works offline during your stay.</span>
      <button aria-label="Dismiss" onclick="localStorage.setItem('hint_dismissed','1');document.getElementById('a2hs').remove()">✕</button>
    </div>` : '<div style="height:20px"></div>'}
  </div>`;
}

function vCategory(c){
  if (c.topics.length === 1) return vTopic(c, c.topics[0], true);
  return `<div class="wrap">
    <div class="pagehead"><h2>${esc(c.title)}</h2></div>
    <div class="toplist stagger">
      ${c.topics.map((t,i)=>`
        <button class="topic-row" style="--i:${i}" onclick="location.hash='#/t/${c.slug}/${t.slug}'">
          ${t.photo?`<img class="fade" src="${t.photo}" alt="" loading="lazy">`:`<span class="ph">${icon(c.icon)}</span>`}
          <span class="tt">${esc(t.title)}</span>
          <span class="chev">${icon('back','style="transform:rotate(180deg)"')}</span>
        </button>`).join('')}
    </div>
  </div>`;
}

function vTopic(c, t, single){
  const secs = splitSections(t.html);
  let i = 0;
  return `
    ${t.photo?`<img class="hero fade" src="${t.photo}" alt="">`:''}
    <div class="wrap stagger">
      <div class="topic-head" style="--i:${i++}">
        <div class="crumb">${esc(c.title)}</div>
        ${!single || t.title!==c.title ? `<h2>${esc(t.title)}</h2>` : ''}
      </div>
      ${secs.map((s,ix)=> s.title ? `
        <div class="acc${ix===0?' open':''}" style="--i:${i++}">
          <button aria-expanded="${ix===0}">${s.title}<span class="chev">${icon('chev')}</span></button>
          <div class="bodywrap"><div class="body prose">${s.html}</div></div>
        </div>` : `<div class="prose" style="--i:${i++};padding:4px 0">${s.html}</div>`).join('')}
      <div class="topic-actions" style="--i:${i++}">
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
  document.querySelectorAll('.acc>button').forEach(b=>{
    b.onclick = () => {
      const acc = b.parentElement;
      acc.classList.toggle('open');
      b.setAttribute('aria-expanded', acc.classList.contains('open'));
    };
  });
  document.querySelectorAll('.prose a[href^="http"]').forEach(a=>{ a.target='_blank'; a.rel='noopener'; });
  document.querySelectorAll('img.fade').forEach(im=>{
    if (im.complete) im.classList.add('loaded');
    else im.addEventListener('load', () => im.classList.add('loaded'), {once:true});
  });
  if (r[0]==='search'){
    const q = document.getElementById('q');
    q.focus();
    q.oninput = () => showResults(q.value);
  }
  if (r[0]==='map') initMap();
  if (r.length===0 || r[0]==='guide') paintWeather();
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
  box.innerHTML = hits.map(({e},i)=>{
    const ix = e.text.indexOf(terms[0]);
    let snip = ix>-1 ? e.plain.slice(Math.max(0, ix-30), ix+90) : e.plain.slice(0,110);
    snip = esc(snip).replace(new RegExp('('+terms.map(rxesc).join('|')+')','gi'), '<mark>$1</mark>');
    return `<button class="topic-row" style="--i:${i}" onclick="location.hash='#/t/${e.c.slug}/${e.t.slug}'">
      <span class="ph">${icon(e.c.icon)}</span>
      <span class="tt">${esc(e.t.title)}<div class="snip">…${snip}…</div></span>
    </button>`;
  }).join('');
  box.classList.add('stagger');
}

/* ---------- map v2 ---------- */
function buildPlaces(){
  const p = DATA.property;
  PLACES = [];
  for (const c of DATA.categories)
    for (const t of c.topics){
      if (!t.loc) continue;
      const km = haversine(p.lat, p.lng, t.loc[0], t.loc[1]);
      if (km < 0.03) continue; /* the apartment itself */
      const div = document.createElement('div');
      div.innerHTML = t.html;
      PLACES.push({
        title: t.title, loc: t.loc, photo: t.photo, iconName: c.icon, km,
        path: `#/t/${c.slug}/${t.slug}`,
        snippet: div.textContent.replace(/\s+/g,' ').trim().slice(0, 90)
      });
    }
  PLACES.sort((a,b)=>a.km-b.km);
}
const walkLabel = km => km <= 2.6 ? `~${Math.max(2, Math.round(km*12.5))} min walk` : `${km.toFixed(km<10?1:0)} km away`;

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
    js.onerror = ()=>{ document.getElementById('mapbox').innerHTML = '<div class="wrap"><div class="offline-note" style="margin-top:80px">The map needs an internet connection — everything else in the guide still works offline.</div></div>'; };
    document.body.appendChild(js);
  };
  load(()=>{
    const p = DATA.property;
    const m = L.map('mapbox', {zoomControl:false}).setView([p.lat, p.lng], 14);
    L.control.zoom({position:'topleft'}).addTo(m);
    const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>', maxZoom: 20
    }).addTo(m);
    let tileFail = false;
    tiles.on('tileerror', () => {
      if (tileFail) return; tileFail = true;
      const tip = document.getElementById('maptip');
      if (tip){ tip.style.display='block'; tip.textContent = 'Offline — map tiles unavailable right now'; }
    });

    /* home pin (pulsing) */
    const homeIcon = L.divIcon({html:`<div class="pin home"><span class="ring"></span>${icon('house')}</div>`, className:'', iconSize:[36,43], iconAnchor:[18,43], popupAnchor:[0,-40]});
    const homeMarker = L.marker([p.lat, p.lng], {icon: homeIcon, zIndexOffset: 1000}).addTo(m)
      .bindPopup(`<div class="map-pop"><b>${esc(p.name)}</b><div class="sn">${esc(p.address)}, ${esc(p.postal)} ${esc(p.city)}</div>
        <div class="row"><a target="_blank" rel="noopener" href="https://www.google.com/maps/dir//${p.lat},${p.lng}">Directions ↗</a></div></div>`);

    /* place pins */
    const markers = PLACES.map(pl => {
      const ic = L.divIcon({html:`<div class="pin">${icon(pl.iconName)}</div>`, className:'', iconSize:[36,43], iconAnchor:[18,43], popupAnchor:[0,-40]});
      return L.marker(pl.loc, {icon: ic}).addTo(m).bindPopup(`<div class="map-pop">
        ${pl.photo?`<img src="${pl.photo}" alt="">`:''}
        <b>${esc(pl.title)}</b>
        <div class="sn">${esc(pl.snippet)}…</div>
        <div class="row">
          <a target="_blank" rel="noopener" href="https://www.google.com/maps/dir//${pl.loc[0]},${pl.loc[1]}">Directions ↗</a>
          <a href="${pl.path}">Open guide →</a>
        </div></div>`);
    });

    /* fit nearby (≤3.5 km) so airports don't zoom the world out */
    const near = PLACES.filter(pl=>pl.km<=3.5).map(pl=>pl.loc);
    if (near.length) m.fitBounds([[p.lat,p.lng], ...near], {padding:[46,46], maxZoom:15});

    /* recenter control */
    const wrap = document.querySelector('.mapwrap');
    const btn = document.createElement('button');
    btn.className = 'mapbtn'; btn.title = 'Back to the apartment'; btn.innerHTML = icon('crosshair');
    btn.onclick = () => { m.flyTo([p.lat, p.lng], 15, {duration:.8}); homeMarker.openPopup(); };
    wrap.appendChild(btn);

    /* place cards */
    const cards = document.createElement('div');
    cards.className = 'placecards';
    cards.innerHTML = `
      <button class="pcard active" data-i="-1">
        <span class="pph">${icon('house')}</span>
        <span><span class="pt">${esc(p.name)}</span><span class="pd" style="display:block">You're here · ${esc(p.address)}</span></span>
      </button>` +
      PLACES.map((pl,i)=>`
      <button class="pcard" data-i="${i}">
        ${pl.photo?`<img src="${pl.photo}" alt="">`:`<span class="pph">${icon(pl.iconName)}</span>`}
        <span><span class="pt">${esc(pl.title)}</span><span class="pd" style="display:block">${walkLabel(pl.km)}</span></span>
      </button>`).join('');
    wrap.appendChild(cards);
    cards.querySelectorAll('.pcard').forEach(cardEl => {
      cardEl.onclick = () => {
        cards.querySelectorAll('.pcard').forEach(x=>x.classList.remove('active'));
        cardEl.classList.add('active');
        const i = +cardEl.dataset.i;
        if (i < 0){ m.flyTo([p.lat,p.lng], 15, {duration:.8}); homeMarker.openPopup(); }
        else { m.flyTo(PLACES[i].loc, PLACES[i].km>3.5?11:15, {duration:.9}); markers[i].openPopup(); }
      };
    });
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
  const active = map[r] || 'home';
  document.querySelectorAll('#tabbar button').forEach(b=>b.classList.toggle('active', b.dataset.tab===active));
}

/* ---------- utils ---------- */
const cat = slug => DATA.categories.find(c=>c.slug===slug);
const esc = s => String(s??'').replace(/[&<>"]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const rxesc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function haversine(a,b,c,d){
  const R=6371, r=x=>x*Math.PI/180;
  const h = Math.sin(r(c-a)/2)**2 + Math.cos(r(a))*Math.cos(r(c))*Math.sin(r(d-b)/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}
let toastTimer;
function toast(msg){
  document.getElementById('toast')?.remove();
  clearTimeout(toastTimer);
  const t = document.createElement('div');
  t.id = 'toast'; t.textContent = msg; t.setAttribute('role','status');
  document.body.appendChild(t);
  toastTimer = setTimeout(()=>{ t.style.transition='opacity .4s'; t.style.opacity='0'; setTimeout(()=>t.remove(), 400); }, 2600);
}

boot();
