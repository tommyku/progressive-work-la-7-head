import React from 'react';
import {render} from 'react-dom';
import App from './app.jsx';
import timeago from 'timeago.js';
import LocalStorage from 'store';
import 'preact/devtools';

timeago.register('zh_TW', require('timeago.js/locales/zh_TW'));

render(<App/>, document.getElementById('app'));

// request persistant storage permission
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist().then(granted => {
    LocalStorage.set('storage.persist', granted);
    // If granted, Storage will not be cleared except by explicit user action
    // Otherwise, storage may be cleared by the UA under storage pressure.
  });
}

// install service worker
if (typeof navigator['serviceWorker'] != 'undefined' && !window.location.origin.match('localhost')) {
  window.addEventListener('load', ()=> {
    navigator.serviceWorker
      .register('./service-worker.js');
  });
}
