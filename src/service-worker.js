const cacheVersion = "v14";

const addResourcesToCache = async (resources) => {
    const cache = await caches.open(cacheVersion);
    await cache.addAll(resources);
};

const putInCache = async (request, response) => {
    const cache = await caches.open(cacheVersion);
    await cache.put(request, response);
};

const cacheFirst = async (request) => {
    const responseFromCache = await caches.match(request);
    if (responseFromCache) {
        return responseFromCache;
    }
    const responseFromNetwork = await fetch(request);
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
};

self.addEventListener("install", (event) => {
    event.waitUntil(
        addResourcesToCache([
            "/",
            "/index.html",
            "/manifest.json"
        ]),
    );
});

self.addEventListener("fetch", async (event) => {
    event.respondWith(cacheFirst(event.request));
});
