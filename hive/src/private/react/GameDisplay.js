import React, { Component } from 'react';

class GameDisplay extends Component {
  onMouseDown = (e) => {
    let x = Math.floor(e.nativeEvent.offsetX / this.props.pixelScale);
    let y = Math.floor(e.nativeEvent.offsetY / this.props.pixelScale);
    console.log(window.hive.board.tiles[x][y]);
    this.props.onTileSelect(x, y);
  }
  renderUpdates() {
    const ctx = this._canvas.getContext('2d');
    const updatedTiles = window.hive.getUpdatedTiles();
    if (updatedTiles.length > 0) {
      updatedTiles.forEach((tile) => {
        ctx.clearRect(
          this.props.pixelScale * tile.x,
          this.props.pixelScale * tile.y,
          this.props.pixelScale,
          this.props.pixelScale
        );
        ctx.fillStyle = tile.color(this.props.showTrails);
        ctx.fillRect(
          this.props.pixelScale * tile.x,
          this.props.pixelScale * tile.y,
          this.props.pixelScale,
          this.props.pixelScale
        );
      });
      window.hive.clearUpdatedTiles();
    }
  }
  renderAll = () => {
    const ctx = this._canvas.getContext('2d');
    ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    for (var i = 0; i < window.hive.board.width; i++) {
      for (var j = 0; j < window.hive.board.height; j++) {
        ctx.fillStyle = window.hive.board.tiles[i][j].color(this.props.showTrails);
        ctx.fillRect(
          this.props.pixelScale * i,
          this.props.pixelScale * j,
          this.props.pixelScale,
          this.props.pixelScale
        );
      }
    }
  }
  render() {
    return (
      <div>
        <canvas
          ref={ (c) => this._canvas = c }
          className="game_board"
          onMouseDown={ this.onMouseDown }
          width={ this.props.gameWidth * this.props.pixelScale }
          height={ this.props.gameHeight * this.props.pixelScale }>
        </canvas>
      </div>
    );
  }
}

export default GameDisplay;
