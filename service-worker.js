importScripts('workbox-sw.prod.v1.0.0.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
  {
    "url": "/bundle.js",
    "revision": "28525bb58bbd45945defa7c0dc2624b2"
  },
  {
    "url": "/index.html",
    "revision": "b0f3b642ebaa8e39a2a13ff3e173b7b3"
  }
];

const workboxSW = new self.WorkboxSW();
workboxSW.precache(fileManifest);
/* eslint eqeqeq: "off", curly: "error" */
'use strict';

function isFunction(obj) {
  return obj && {}.toString.call(obj) === '[object Function]';
}

function runFunctionString(funcStr) {
  if (funcStr.trim().length > 0) {
    var func = new Function(funcStr);
    if (isFunction(func)) {
      func();
    }
  }
}

self.addEventListener('message', function (event) {
  self.client = event.source;
});

self.onnotificationclose = function (event) {
  runFunctionString(event.notification.data.onClose);

  /* Tell Push to execute close callback */
  self.client.postMessage(JSON.stringify({
    id: event.notification.data.id,
    action: 'close'
  }));
}

self.onnotificationclick = function (event) {
  var link, origin, href;

  runFunctionString(event.notification.data.onClick);

  if (typeof event.notification.data.link !== 'undefined' && event.notification.data.link !== null) {
    origin = event.notification.data.origin;
    link = event.notification.data.link;
    href = origin.substring(0, origin.indexOf('/', 8)) + '/';

    event.notification.close();

    /* This looks to see if the current is already open and focuses if it is */
    event.waitUntil(clients.matchAll({
      type: "window"
    }).then(function (clientList) {
      var client, full_url;

      for (var i = 0; i < clientList.length; i++) {
        client = clientList[i];
        full_url = href + link;

        if (full_url[full_url.length - 1] !== '/' && client.url[client.url.length - 1] === '/'){
          full_url += '/';
        }

        if (client.url === full_url && 'focus' in client){
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow('/' + link);
      }
    }).catch(function (error) {
      throw new Error("A ServiceWorker error occurred: " + error.message);
    }));
  }
}
