import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './app.jsx';

injectTapEventPlugin();

render(<App/>, document.getElementById('app'));
