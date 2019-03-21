import React from 'react';
import './App.css';
import { connect } from 'react-redux';
import Beers from './views/Beers';

const App = () => {
  return (
    <div className="App">
      <Beers />
    </div>
  );
};

export default connect(state => state.app)(App);
