// Service worker: deixa o app funcionando offline.
// - Arquivos do app (html, css, js, ícones, fonte): cache primeiro.
//   Ao mudar algum deles, aumente a versão abaixo.
// - Conteúdo em data/*.json: rede primeiro (pega a versão nova quando tem internet)
//   e cópia salva quando está offline. Atualizar JSON NÃO exige mudar a versão.
const CACHE = 'estuda-v8';
const DATA_CACHE = 'estuda-dados';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/style.css',
  './js/app.js',
  './js/engine.js',
  './js/curriculum.js',
  './js/fx.js',
  './js/icons.js',
  './fonts/nunito.woff2',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png',
];
const DATA = [
  './data/bncc.json',
  './data/curiosidades.json',
  './data/conteudo/ano3.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(Promise.all([
    caches.open(CACHE).then((c) => c.addAll(ASSETS)),
    caches.open(DATA_CACHE).then((c) => Promise.all(DATA.map((u) => c.add(u).catch(() => {})))),
  ]).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== DATA_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Rede primeiro para os JSON de conteúdo; sem internet, usa a cópia salva
function networkFirst(req) {
  const key = req.url.split('?')[0];
  return fetch(req).then((res) => {
    if (res.ok) {
      const copy = res.clone();
      caches.open(DATA_CACHE).then((c) => c.put(key, copy));
    }
    return res;
  }).catch(() => caches.match(key, { ignoreSearch: true }).then((hit) => hit || Response.error()));
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== location.origin) return;
  if (url.pathname.includes('/data/')) { event.respondWith(networkFirst(req)); return; }
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => (req.mode === 'navigate' ? caches.match('./index.html') : Response.error()));
    }),
  );
});
