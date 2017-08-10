import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const board = [
  [1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0],
  [0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 1, 1, 0, 0],
  [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1],
  [1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0],
  [1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 0],
  [1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0],
  [1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0],
  [1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0],
  [1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],
  [1, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0],
  [0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0],
  [0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1],
  [1, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1],
  [1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0],
  [0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0]
];

class Game extends Component {
  componentDidMount() {
    this.updateCanvas();
  }

  constructor(props) {
    super(props);
    this.state = {count: 0, pixelScale: 1};
  }

  handleStart = () => {
    this.setState({count: this.state.count + 1});
  }

  updateCanvas() {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
    for (var x = 0; x < board[0].length; x++) {
      for (var y = 0; y < board.length; y++) {
        ctx.fillStyle = board[x][y] == 1 ? "Black" : "White";
        ctx.fillRect(this.state.pixelScale*x, this.state.pixelScale*y, this.state.pixelScale, this.state.pixelScale);
      }
    }
  }

  decPixelScale = () => {
    this.state.pixelScale -= 1;
    if (this.state.pixelScale < 1) {
      this.state.pixelScale = 1;
    }
    this.updateCanvas();
  }
  incPixelScale = () => {
    this.state.pixelScale += 1;
    if (this.state.pixelScale > 10) {
      this.state.pixelScale = 10;
    }
    this.updateCanvas();
  }

  render() {
    return (
      <div>
        <div>
          <canvas ref="canvas" className="game_board" width="200" height="200">
          </canvas>
        </div>
        <div>
          <button onClick={ this.decPixelScale }>Decrement</button>
          <button onClick={ this.incPixelScale }>Increment</button>
        </div>
        <div>
          <button onClick={ this.handleStart }>{ this.state.count }</button>
        </div>
      </div>
    );
  }
}

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
