import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './private/react/App';
import registerServiceWorker from './private/react/registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
