import React, { Component } from 'react';
import HiveGame from "../js/HiveGame.js";
import { UPDATE_PERIOD } from "../js/constants.js";

class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {
      updatesPerTick: 1,
      pixelScale: 3,
      width: 400,
      height: 200,
      shouldRenderAll: true,
      players: [],
    };
  }

  componentDidMount() {
    this._canvas.hive = new HiveGame(this.state);
    this._canvas.hive.init();
    this._canvas.interval = setInterval(this.update, UPDATE_PERIOD);
  }

  update = () => {
    const newState = {};
    for (let i = 0; i < this.state.updatesPerTick; i++) {
      this._canvas.hive.update();
    }
    if (this.state.shouldRenderAll) {
      this.renderAll();
      newState.shouldRenderAll = false;
    } else {
      this.renderUpdates();
    }
    newState.players = this._canvas.hive.players.map((p) => {
      return {
        id: p.id,
        antCount: p.ants.length,
        color: p.color,
      };
    });
    this.setState(newState);
  }

  renderUpdates() {
    const pixelScale = this.state.pixelScale;
    const ctx = this._canvas.getContext('2d');
    const updatedTiles = this._canvas.hive.getUpdatedTiles();
    if (updatedTiles.length > 0) {
      updatedTiles.forEach(function(tile) {
        ctx.clearRect(pixelScale * tile.x, pixelScale * tile.y, pixelScale, pixelScale);
        ctx.fillStyle = tile.color();
        ctx.fillRect(pixelScale * tile.x, pixelScale * tile.y, pixelScale, pixelScale);
      });
      this._canvas.hive.clearUpdatedTiles();
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

  handlePixelScaleChange = (evt) => {
    this.setState({
      pixelScale : parseInt(evt.target.value),
      shouldRenderAll: true,
    });
  }
  handleUpdatesPerTickChange = (evt) => {
    this.setState({ updatesPerTick: parseInt(evt.target.value) });
  }

  render() {
    let players = this.state.players.map((p) => {
      return <div style={ { color: p.color } } key={ p.id }>Player { p.id }: { p.antCount } ants</div>;
    });
    return (
      <div>
        <div>
          { players }
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
          <div>
            Pixel Scale: { this.state.pixelScale }
            <input type="range" min="1" max="10" step="1" value={ this.state.pixelScale.toString() || "1" } onChange={ this.handlePixelScaleChange } />
          </div>
          <div>
            Updates per tick: { this.state.updatesPerTick }
            <input type="range" min="1" max="100" step="1" value={ this.state.updatesPerTick.toString() || "1" } onChange={ this.handleUpdatesPerTickChange } />
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
