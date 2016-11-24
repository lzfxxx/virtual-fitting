import './index.html';
import './index.less';
import ReactDOM from 'react-dom';
import React from 'react';
import { browserHistory } from 'react-router';
import Routes from '../routes/index';
// import App from '../components/react-three/app';
// import App from '../components/react-three-renderer/js/components/app.react';
// import App from '../components/three/js/components/app.react';
// import App from '../components/three-renderer/js/components/app.react';

// import App from '../components/react-three-renderer/js/components/three/Cloth/index';

// ReactDOM.render(<App />, document.getElementById('root'));


ReactDOM.render(<Routes history={browserHistory} />, document.getElementById('root'));

