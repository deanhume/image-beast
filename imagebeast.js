const dataCacheName = `${location.hostname}${(location.port ? ':' + location.port : '')}$$cache`;

/**
 * Calculates the new URL that we want to use 
 * @param {string} requestUrl 
 */
function calculateSaveDataUrl(requestUrl){
  return `${requestUrl.substr(0, requestUrl.lastIndexOf("."))}-savedata${requestUrl.substr(requestUrl.lastIndexOf("."), requestUrl.length - 1)}`;
}

/**
 * Fetch the resource and process the results
 * @param {string} returnUrl 
 */
async function fetchAndProcess(requestUrl, returnUrl, useCache) { 
  // Does the URL already exist in cache?
  const cacheResults = await caches.match(returnUrl);

  if (cacheResults) {
    return cacheResults;
  }
  
  // If not, we need to go and get it
  const returnedResponse = await fetch(returnUrl);

  // Was the request successful?
  if (!returnedResponse.ok && !requestUrl.includes('placeholder')) { 
    return fetch('/images/placeholder.jpg');
  }

  // Should we cache the resource?
  if (useCache) {
    const cache = await caches.open(dataCacheName);
    cache.put(returnUrl, returnedResponse.clone());
    return returnedResponse;
  } else {
    return returnedResponse; // Don't cache
  }
}

/**
 * Calculates the URL to return based on the headers passed through.
 * @param {Object} acceptHeaders 
 * @param {string} requestUrl 
 * @param {boolean} useXr - Should we use JpegXR? 
 * @param {boolean} useWebp  - Should we use WebP?
 */
function calculateReturnUrl(acceptHeaders, requestUrl, useXr, useWebp) {

  // Is WebP supported?
  if (acceptHeaders.get('accept').includes('webp') && useWebp) {
    return `${requestUrl.substr(0, requestUrl.lastIndexOf("."))}.webp`;
  } 

  // Is jpegXR supported?
  if (acceptHeaders.get('accept').includes('ms-photo') && useXr) {
    return `${requestUrl.substr(0, requestUrl.lastIndexOf("."))}.jxr`;
  }
}

/**
 * Choose the best image format based on the current configuration settings.
 * @param {Object} config 
 */
async function optimize(config) {
  this.addEventListener('fetch', event => {

    let returnUrl;
    const headers = event.request.headers;
    const requestUrl = event.request.url;

    if (/\.jpg$|.gif$|.png$/.test(requestUrl) && !requestUrl.includes('placeholder')) { // Check for images and not our placeholder
      if (headers.get('save-data') && config.useSaveData) {   // Check for the save data headers
        returnUrl = calculateSaveDataUrl(requestUrl);
      }
      else if (headers.has('accept')) { // Inspect the accept header for alternate image support
        returnUrl = calculateReturnUrl(headers, requestUrl, config.useXr, config.useWebp);
      }

      // Double check that we didnt miss any cases and fallback
      if (returnUrl === undefined) { returnUrl = requestUrl; } 

      event.respondWith(fetchAndProcess(requestUrl, returnUrl, config.useCache));
    }
  });
}
