import React from 'react';
import {render} from 'react-dom';
import App from './app.jsx';
import 'preact/devtools';

render(<App/>, document.getElementById('app'));

if(typeof navigator['serviceWorker'] != 'undefined' && !window.location.origin.match('localhost')) {
  window.addEventListener('load', ()=> {
    navigator.serviceWorker
      .register('./service-worker.js');
  });
}
