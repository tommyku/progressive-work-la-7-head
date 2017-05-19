import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './app.jsx';

injectTapEventPlugin();

render(<App/>, document.getElementById('app'));

if(typeof navigator['serviceWorker'] != 'undefined') {
  navigator.serviceWorker
    .register('./service-worker.js')
    .then(()=> {
      console.log('Service Worker Registered')
    });
};
