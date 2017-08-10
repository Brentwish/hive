import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const Colors = [
  "Black",
  "White",
  "Green",
  "Blue",
  "Red"
];

class Game extends Component {
  componentDidMount() {
    this.handleStart();
  }

  constructor(props) {
    super(props);
    this.state = {
      pixelScale: 1,
      board: [[]],
      width: 100,
      height: 100,
    };
  }

  handleStart = () => {
    this.getRandomBoard();
    this.updateCanvas();
  }

  getRandomBoard() {
    this.state.board = [[]];
    for (var i = 0; i < this.state.width; i++) {
      this.state.board[i] = [];
      for (var j = 0; j < this.state.height; j++) {
        this.state.board[i][j] = Math.floor(Math.random() * Colors.length);
      }
    }
  }

  updateCanvas() {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.refs.canvas.width, this.refs.canvas.height);
    for (var x = 0; x < this.state.width; x++) {
      for (var y = 0; y < this.state.height; y++) {
        ctx.fillStyle = Colors[this.state.board[x][y]];
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
          <canvas ref="canvas" className="game_board" width={ this.state.width } height={ this.state.height}>
          </canvas>
        </div>
        <div>
          <button onClick={ this.decPixelScale }>Decrement</button>
          <button onClick={ this.incPixelScale }>Increment</button>
        </div>
        <div>
          <button onClick={ this.handleStart }>New Board!</button>
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
