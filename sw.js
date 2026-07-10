/* service worker — offline cache for the guest guide */
const CACHE = 'guide-v1';
const ASSETS = [
 "./",
 "index.html",
 "app.js",
 "content.json",
 "manifest.webmanifest",
 "assets/0eb9124e.jpg",
 "assets/1f144985.jpg",
 "assets/2113a3a6.jpg",
 "assets/24daf927.jpg",
 "assets/3e461dc0.jpg",
 "assets/59447448.jpg",
 "assets/5d29c121.jpg",
 "assets/5dc20961.jpg",
 "assets/61b3fa55.jpg",
 "assets/70825a44.jpg",
 "assets/74067272.jpg",
 "assets/750acdc9.jpg",
 "assets/7ad391b3.jpg",
 "assets/8f095fc4.jpg",
 "assets/Figtree-Bold.ttf",
 "assets/Figtree-Regular.ttf",
 "assets/b23a2fb4.jpg",
 "assets/d29870c6.jpg",
 "assets/d49bd604.jpg",
 "assets/db44c248.jpg",
 "assets/e01dab39.jpg",
 "assets/e38ea2ea.jpg",
 "assets/icon-192.png",
 "assets/icon-512.png"
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // let CDN (map tiles/leaflet) hit network
  if (url.pathname.endsWith('content.json')) {
    // network-first so content edits show up quickly, cache fallback offline
    e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request)));
  } else {
    e.respondWith(caches.match(e.request, {ignoreSearch:true}).then(r => r || fetch(e.request)));
  }
});
