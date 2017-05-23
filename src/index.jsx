import React from 'react';
import {render} from 'react-dom';
import App from './app.jsx';

render(<App/>, document.getElementById('app'));

if(typeof navigator['serviceWorker'] != 'undefined') {
  window.addEventListener('load', ()=> {
    navigator.serviceWorker
      .register('./service-worker.js')
      .then(()=> {
        console.log('Service Worker Registered')
      });
  });
};
