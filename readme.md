
![Image Beast](https://raw.githubusercontent.com/deanhume/image-beast/master/images/beast.jpg)

## The Image Beast

From the murky depths of the sea, comes the image beast! It’s here to tame your every image need with a handy [1 KB script](https://github.com/deanhume/image-beast/blob/master/imagebeast.min.js). There are so many great different image formats available these days, and many of them offer significant file size savings over the traditional formats (JPEG, GIF, PNG). Unfortunately not every browser provides support for all of these great image formats. We want to pass on these savings to all of our users.

This is where the image beast comes in! Simply include this [tiny 1KB script](https://github.com/deanhume/image-beast/blob/master/imagebeast.min.js) in your Service Worker, create the appropriate image formats, and it will handle the rest for you.

Serve the lightest, leanest images to your users and help them get the fastest page load times possible. Grrrrrr!
The image beast does all of these things:

-   Serves WebP images to Google’s Chrome Browser
-   Serves JpegXR images to Microsoft’s Edge Browser
-   Serves lean image for Android users with the Data Saver feature enabled
-   Caches the images!

## Progressive Enhancement

What about older browsers I hear you say? Well, the beast has them tamed too! Service Workers are the ultimate progressive enhancement and if your browser doesn’t support them they will simply return the images as normal. If your browser does support Service Workers, then the image beast simply uses it slippery tentacles to decide the perfect image format to return.

[WebP](https://developers.google.com/speed/webp/)? [JPEGXR](https://msdn.microsoft.com/en-gb/library/windows/desktop/hh707223.aspx)? Or even a low resolution version of an image? The image beast is in control.

## Show me an example!

First up, you need to check if Service Workers are supported in your browser. If they are, create and register the Service Worker by adding the following code to your page.

```
<script>
 // Register the service worker
 if ('serviceWorker' in navigator) {
 navigator.serviceWorker.register('./service-worker.js').then(function(registration) {
   // Registration was successful
   console.log('ServiceWorker registration successful with scope: ', registration.scope);
 })
 }
</script>

```

Next, simply import the script into your Service Worker (service-worker.js) and begin optimizing.

```
(global => {
  'use strict';

  importScripts('./imagebeast.min.js');
  optimize({ useWebp: false, useXr: true, useSaveData: true, useCache: true });

  // Ensure that our service worker takes control of the page as soon as possible.
  global.addEventListener('install', event => event.waitUntil(global.skipWaiting()));
  global.addEventListener('activate', event => event.waitUntil(global.clients.claim()));
})(self);

```

As you can see from the code above, you can also configure image beast. For example, if you’d prefer not to return WebP images, then simply disable it in the config.

If you’d like to see this in action, head over to [deanhume.github.io/image-beast](https://deanhume.github.io/image-beast/index.html) for a working example.

## How does it work under the hood?

The image beast works by listening to the client hints that your browser sends through when it makes an HTTP request. Let's say you are using Google Chrome as your browser. By default, the browser will send through an Accept Request header and in the
case of Chrome, it will send through a client hint of "image/webp" notifying the server that it supports WebP images. Using a Service Worker, we can tap into this request and return an alternate version of the image.

Hey, but I don't use Google Chrome! Don't worry - the image beast has you covered. Microsoft's Edge currently has Service Workers under development and the image beast will return JPEGXR images for you if it detects that it can support it. The image beast is prowling and ready to pounce on every image format.

## Performance is key!

Using the image beast, you are able to return the leanest possible images to your user's browser. Using the power of Service Workers, we can take this a step further and cache the image request once it has been made. This means that the user won't even have to make another HTTP request for the image and it will load instantly. It is built-in by default, but you can turn it off using the configuration options.

The image beast also has another sneaky trick up it's tentacle. Users that use Android devices and have the [Data Saver feature](https://support.google.com/chrome/answer/2392284?hl=en-GB) enabled for their phone or tablet will have low resolution images returned to them. All you need to do is save a low resolution version of the image with "-savedata" appended to the file name (eg. beast-savedata.jpg) and the image beast will do the rest. In fact, even if you haven't provided a low resolution version of the image, it will simply return a tiny placeholder image in order
to save your users data.
