import React, { Component } from 'react';
import Board from "../js/Board.js";

const Colors = [
  "Black",
  "White",
  "Green",
  "Blue",
  "Red"
];

class Game extends Component {
  componentDidMount() {
    this._canvas.board = new Board(0,0);
    this.handleStart();
  }

  constructor(props) {
    super(props);
    this.state = {
      pixelScale: 2,
      width: 1000,
      height: 350
    };
  }

  handleStart = () => {
    this._canvas.board.randomBoard(this.state.width, this.state.height);
    this.updateCanvas();
  }

  updateCanvas(pixelScale) {
    if (pixelScale == null) {
      pixelScale = this.state.pixelScale;
    }
    const ctx = this._canvas.getContext('2d');

    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    for (var i = 0; i < this._canvas.board.width; i++) {
      for (var j = 0; j < this._canvas.board.height; j++) {
        ctx.fillStyle = Colors[this._canvas.board.squares[i][j]];
        ctx.fillRect(pixelScale * i, pixelScale * j, pixelScale, pixelScale);
      }
    }
  }

  decPixelScale = () => {
    var newScale = this.state.pixelScale - 1;
    if (newScale < 1) {
      newScale = 1;
    }
    this.setState({
      pixelScale : newScale
    });
    this.updateCanvas(newScale);
  }

  incPixelScale = () => {
    var newScale = this.state.pixelScale + 1;
    if (newScale > 10) {
      newScale = 10;
    }
    this.setState({
      pixelScale : newScale
    });
    this.updateCanvas(newScale);
  }

  render() {
    return (
      <div>
        <div>
          <canvas 
            ref={
              (c) => this._canvas = c
            }
            className="game_board" 
            width={ this.state.width } 
            height={ this.state.height}>
          </canvas>
        </div>
        <div>
          <button onClick={ this.decPixelScale }>Decrement</button>
          <span>{ this.state.pixelScale }</span>
          <button onClick={ this.incPixelScale }>Increment</button>
        </div>
        <div>
          <button onClick={ this.handleStart }>New Board!</button>
        </div>
      </div>
    );
  }
}

export default Game;
