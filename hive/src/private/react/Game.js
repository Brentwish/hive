import React, { Component } from 'react';
import Hive from "../js/Hive.js";

const Colors = [
  "Black",
  "White",
  "Green",
  "Blue",
  "Red"
];

class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pixelScale: 2,
      width: 0,
      height: 0
    };
  }

  componentDidMount() {
    this._canvas.hive = new Hive();
    this.setState({
      width: this._canvas.hive.board.width,
      height: this._canvas.hive.board.width
    });
    this._canvas.interval = setInterval(this.update, 42);
  }

  update = () => {
    this._canvas.hive.update();
    this.updateCanvas();
  }

  updateCanvas(pixelScale) {
    if (pixelScale == null) {
      pixelScale = this.state.pixelScale;
    }
    const ctx = this._canvas.getContext('2d');

    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    for (var i = 0; i < this._canvas.hive.board.width; i++) {
      for (var j = 0; j < this._canvas.hive.board.height; j++) {
        ctx.fillStyle = Colors[this._canvas.hive.board.squares[i][j]];
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
      </div>
    );
  }
}
//        <div>
//          <button onClick={ this.handleStart }>New Board!</button>
//        </div>

export default Game;
