/**
 * FileConvert - sw.js
 * Service Worker para suporte Offline e Cache PWA
 * 4U.IA.BR
 */

const CACHE_NAME = 'fileconvert-v2.0.0';
const ASSETS = [
    './',
    './index.php',
    './style_main.css',
    './lib_state.js',
    './lib_utils.js',
    './lib_audio.js',
    './lib_image.js',
    './lib_docs.js',
    './lib_video.js',
    './lib_tools.js',
    './manifest.json',
    './favicon.svg',
    './favicon-32x32.png',
    './icon-192.png',
    './icon-512.png',
    './privacidade.php',
    './termos.php',
    './suporte.php'
];

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (e) => {
    // Apenas requisições GET
    if (e.request.method !== 'GET') return;

    e.respondWith(
        caches.match(e.request).then(cached => {
            if (cached) return cached;
            return fetch(e.request).then(response => {
                // Não cacheia respostas que não sejam 200
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(e.request, responseToCache);
                });
                return response;
            }).catch(() => {
                // Se offline e requisição de página HTML, tenta index.php do cache
                if (e.request.headers.get('accept')?.includes('text/html')) {
                    return caches.match('./index.php');
                }
            });
        })
    );
});
