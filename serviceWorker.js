const CACHE_NAME = "v1_cache_generator_app"
const urlsToCache = [
    "./",
    "./img/favicon.ico",
    "./img/img48.png",
    "./img/img64.png",
    "./img/img128.png",
    "./img/img256.png",
    "./img/img512.png",
    "./img/img1024.png",
    "./img/maskable.png",
    "./js/main.js",
    "./js/mount.js",
    "./css/style.css",
    "../css/style.css",
    "./manifest.json",
    "./?unt_source=web_app_manifest",
    "pages/fallback.html",
    "https://unpkg.com/vue@next"   
];

//chrome://serviceworker-internals
//chrome://inspect/#service-workers

//agregamos las url a la cache
self.addEventListener("install", e => { 
    e.waitUntil( 
        caches.open(CACHE_NAME).then( 
            cache => cache.addAll(urlsToCache).then( 
                () => self.skipWaiting() 
            ).catch(
                error => console.log(error) 
            )
        )
    )
})

//actualiza la cache de manera automatica
self.addEventListener("activate", e => {
    const cacheWhiteList = [CACHE_NAME]
    e.waitUntil(
        caches.keys().then(
            cacheNames => {
                return Promise.all(
                    cacheNames.map(
                        cacheName => {
                            if(cacheWhiteList.indexOf(cacheName) === -1){
                                return caches.delete(cacheName)
                            }
                        }
                    )
                )
            }
        ).then(
            () => self.clients.claim()
        )
    )
})

//maneja las peticiones del navegador
self.addEventListener("fetch", e => {
    e.respondWith(
        caches.match(e.request).then(
            res => {
                if(res){
                    return res
                }
                return fetch(e.request)   
            }

        ).catch(() => caches.match("./pages/fallback.html"))
    )
})