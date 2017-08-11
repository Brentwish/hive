import React, { Component } from 'react';
import './App.css';
import Game from './Game.js';


//class InfoPanel extends Component {
//
//  componentDidMount() {
//    this.setState({
//      styles: {
//        top: computeTopWith(this.refs.info),
//        right: computeRightWith(this.refs.info)
//      }
//    });
//  }
//
//  render() {
//    return (
//      <div ref="info" style={ this.state.styles }>Info Panel</div>
//    )
//  }
//}

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="App">
        <Game />
      </div>
    );
  }
}

export default App;
