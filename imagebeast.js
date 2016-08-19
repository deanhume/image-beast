function handleErrors(response, returnNormal) {
    if (!response.ok && !returnNormal) {
        return fetch('/images/placeholder.jpg');
    }
    return response;
}

function optimize(config){

  this.addEventListener('fetch', event => {
    var useWebp = config.hasOwnProperty('useWebp') ? config.useWebp : true;
    var useXr = config.hasOwnProperty('useXr') ? config.useXr : true;
    var useSaveData = config.hasOwnProperty('useSaveData') ? config.useSaveData : true;
    var useCache = config.hasOwnProperty('useCache') ? config.useCache : true;

    var returnUrl;
    var headers = event.request.headers;
    var requestUrl = event.request.url;
    var dataCacheName = location.hostname + (location.port ? ':' + location.port: '') + '$$cache';

    if (/\.jpg$|.gif$|.png$/.test(requestUrl) && !requestUrl.includes('placeholder')) { // Check for images and not our placeholder
      if(headers.get('save-data') && useSaveData){   // Check for the save data headers
        returnUrl = requestUrl.substr(0, requestUrl.lastIndexOf(".")) + '-savedata' + requestUrl.substr(requestUrl.lastIndexOf("."), requestUrl.length - 1);
      }
      else if (headers.has('accept')){ // Inspect the accept header for alternate image support
        if (headers.get('accept').includes('webp') && useWebp){
          returnUrl = requestUrl.substr(0, requestUrl.lastIndexOf(".")) + ".webp"; // webP
        }
        if (headers.get('accept').includes('ms-photo') && useXr){
          returnUrl = requestUrl.substr(0, requestUrl.lastIndexOf(".")) + ".jxr"; //jpegXR
        }
      }

      if (returnUrl ===  undefined){ returnUrl = requestUrl; } // Double check that we didnt miss any cases and fallback

      // Respond with the resulting image
       event.respondWith(
          fetch(returnUrl)
            .then(handleErrors, requestUrl.includes('placeholder')) // Placeholder image for save data
            .then(function(response) {
              if (useCache) { // Should we cache the resource
                return caches.open(dataCacheName).then(function(cache) {
                  cache.put(returnUrl, response.clone());
                  return response;
                });
              }
              else {
                return response; //Don't cache
              }
            })
        );
      }
  });
}
