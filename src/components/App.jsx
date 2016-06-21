import React, { Component, PropTypes } from 'react';
import Menu from '../layouts/Menu/Menu';

const App = ({ children }) => {
  return (
    <Menu>
      {children}
    </Menu>
  );
};

App.propTypes = {
};

export default App;
