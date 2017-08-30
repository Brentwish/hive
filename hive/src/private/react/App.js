import React, { Component } from 'react';
import './App.css';
import Hive from './Hive.js';

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="App">
        <Hive />
      </div>
    );
  }
}

export default App;
