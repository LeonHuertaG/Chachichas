
const CACHE_NAME = 'chachichas-v1';

const ARCHIVOS = [
    '/',
    '/src/landing/landing.html',
    '/src/login/login.html',
    '/src/dashboard/dashboard.html',
    '/manifest.webmanifest',
    '/icon.svg'
];

// INSTALAR SERVICE WORKER

self.addEventListener('install', (event) => {
    console.log('SW Chachichas: instalando');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async (cache) => {
                for (const archivo of ARCHIVOS) {
                    try {
                        await cache.add(archivo);
                        console.log('Cacheado:', archivo);
                    } catch (error) {
                        console.error('No se pudo cachear:', archivo, error);
                    }
                }
            })
    );

    self.skipWaiting();
});

// ACTIVAR SERVICE WORKER

self.addEventListener('activate', (event) => {
    console.log('SW Chachichas: activado');

    event.waitUntil(
        caches.keys()
            .then((nombres) => {
                return Promise.all(
                    nombres
                        .filter((nombre) =>
                            nombre.startsWith('chachichas-') &&
                            nombre !== CACHE_NAME
                        )
                        .map((nombre) => caches.delete(nombre))
                );
            })
            .then(() => self.clients.claim())
    );
});

// INTERCEPTAR SOLICITUDES

self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    // No cachear solicitudes a la API.
    // El login y la sesión deben validarse con el servidor.
    if (url.pathname.startsWith('/api/')) {
        return;
    }

    // No cachear peticiones POST, PUT, DELETE, etc.
    if (request.method !== 'GET') {
        return;
    }

    // No interceptar recursos de otros dominios.
    if (url.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        caches.match(request).then(async (respuestaCache) => {
            if (respuestaCache) {
                return respuestaCache;
            }

            const respuestaRed = await fetch(request);

            if (respuestaRed.ok) {
                const cache = await caches.open(CACHE_NAME);
                await cache.put(request, respuestaRed.clone());
            }

            return respuestaRed;
        })
    );
});
