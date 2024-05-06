const CACHE_NAME = 'NazwaCache-u';
// List of files which are store in cache.
let filesToCache = [
'/',
'/index.html',
'/style/style.css',
'/images/logo.png',
];

self.addEventListener('install', function (event) {
    event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
        return cache.addAll(filesToCache);
        }).catch(function (err) {
        console.error(err);
    }));
});

function isSuccessful(response) {
    return response &&
    response.status === 200 &&
    response.type === 'basic';
}

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                return response; // Cache hit
            }
            return fetch(event.request).then(function (response) {
                if (!isSuccessful(response)) {
                    return response;
                }
                caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(event.request, response.clone());
                });
                return response;
            });
        }).catch(function (error) {
            console.error('Fetch error:', error);
        })
    );
});