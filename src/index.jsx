import React from 'react';
import {render} from 'react-dom';
import App from './app.jsx';
import timeago from 'timeago.js';
import 'preact/devtools';

timeago.register('zh_TW', require('timeago.js/locales/zh_TW'));

render(<App/>, document.getElementById('app'));

if(typeof navigator['serviceWorker'] != 'undefined' && !window.location.origin.match('localhost')) {
  window.addEventListener('load', ()=> {
    navigator.serviceWorker
      .register('./service-worker.js');
  });
}
