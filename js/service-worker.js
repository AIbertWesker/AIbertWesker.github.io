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

self.addEventListener('fetch', function (evt) {
    // console.log(event.request.url);
    evt.respondWith(
    // Firstly, send request..
    fetch(evt.request).catch(function () {
        // When request failed, return file from cache...
        return caches.match(evt.request);
        })
    );
});

function isSuccessful(response) {
    return response &&
    response.status === 200 &&
    response.type === 'basic';
}

self.addEventListener('fetch', function (event) {
    event.respondWith(
    caches.match(event.request)
    .then(function (response) {
        if (response) {
            return response; // Cache hit
        }

        return fetch(event.request.clone())
        .then(function (response) {
            if (!isSuccessful(response)) {
                alert("jestes offline")
                return response;
            }
            caches.open(CACHE_NAME)
            .then(function (cache) {
                cache.put(event.request, response.clone());
            });
            return response;
        }
        );
        })
    );
});