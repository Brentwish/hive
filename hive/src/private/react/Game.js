import React, { Component } from 'react';
import HiveGame from "../js/HiveGame.js";

class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pixelScale: 5,
      width: 40,
      height: 30,
      shouldRenderAll: true,
    };
  }

  componentDidMount() {
    this._canvas.hive = new HiveGame(this.state);
    this._canvas.hive.init();
    this._canvas.interval = setInterval(this.update, 250);
  }

  update = () => {
    this._canvas.hive.update();
    if (this.state.shouldRenderAll) {
      this.renderAll();
      this.setState({ shouldRenderAll: false });
    } else {
      this.renderUpdates();
    }
  }

  renderUpdates(pixelScale) {
    if (pixelScale === undefined) {
      pixelScale = this.state.pixelScale;
    }
    const ctx = this._canvas.getContext('2d');
    if (this._canvas.hive.toRender.length > 0) {
      this._canvas.hive.toRender.forEach(function(tile) {
        ctx.clearRect(pixelScale * tile.x, pixelScale * tile.y, pixelScale, pixelScale);
        ctx.fillStyle = tile.color();
        ctx.fillRect(pixelScale * tile.x, pixelScale * tile.y, pixelScale, pixelScale);
      });
    }
  }

  renderAll(pixelScale) {
    if (pixelScale === undefined) {
      pixelScale = this.state.pixelScale;
    }
    const ctx = this._canvas.getContext('2d');
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    for (var i = 0; i < this._canvas.hive.board.width; i++) {
      for (var j = 0; j < this._canvas.hive.board.height; j++) {
        ctx.fillStyle = this._canvas.hive.board.tiles[i][j].color();
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
      pixelScale : newScale,
      shouldRenderAll: true,
    });
  }

  incPixelScale = () => {
    var newScale = this.state.pixelScale + 1;
    if (newScale > 10) {
      newScale = 10;
    }
    this.setState({
      pixelScale : newScale,
      shouldRenderAll: true,
    });
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
            width={ this.state.width * this.state.pixelScale }
            height={ this.state.height * this.state.pixelScale }>
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

export default Game;
