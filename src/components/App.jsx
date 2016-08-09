import React, { Component, PropTypes } from 'react';
import Menu from '../layouts/Menu/Menu';
// import MainLayout from '../layouts/MainLayout/MainLayout';

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
