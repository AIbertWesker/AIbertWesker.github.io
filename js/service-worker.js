const CACHE_NAME = 'nazwa';
// List of files which are store in cache.
let filesToCache = [
'/',
'/style/style.css',
'/images/logo.png'
];

self.addEventListener('install', function (evt) {
    evt.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
        return cache.addAll(filesToCache);
        }).catch(function (err) {
        //console.error(err);
    }));
});

function isSuccessful(response) {
    return response &&
    response.status === 200 &&
    response.type === 'basic';
}

self.addEventListener('fetch', function (evt) {
    evt.respondWith(
        caches.match(evt.request).then(function (response) {
            if (response) {
                return response; // Cache hit
            }

            return fetch(evt.request).then(function (response) {
                if (!isSuccessful(response)) {
                    return response;
                }
                caches.open(CACHE_NAME).then(function (cache) {
                    cache.put(evt.request, response.clone());
                });
                return response;
            });
        }).catch(function (error) {
            console.error('Fetch error:', error);
        })
    );
});