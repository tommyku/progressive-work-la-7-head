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
    "revision": "d34cb1d15a7dc26ba742e026b3d867a8"
  },
  {
    "url": "/index.html",
    "revision": "62169e9b6b98713e92ed462f9efb7407"
  }
];

const workboxSW = new self.WorkboxSW();
workboxSW.precache(fileManifest);
