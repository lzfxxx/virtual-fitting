require('babel-polyfill');

// import App from '../react-three-renderer/js/components/app.react';
import React from 'react';
import ReactDOM from 'react-dom';

import App from '../react-three/app';
import THREE from 'three';
// window.onload = function(){
//
//   ReactDOM.render(
//     <App />,
//     document.getElementById('app')
//   );
// };

class ResultPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <App />
    );
  }
}

export default ResultPage;
