import React, { Component } from 'react';
import HiveGame from "../js/HiveGame.js";
import { UPDATE_PERIOD } from "../js/constants.js";
import _ from "lodash";

const logTime = function(updateTime, renderTime) {
  const goodCss = "";
  const badCss = 'background: #222; color: #bada55';
  const totalTime = updateTime + renderTime;
  console.log(
    "%cTotal time: %s, Update time: %s, Render time: %s",
    totalTime < UPDATE_PERIOD ? goodCss : badCss,
    totalTime.toString(),
    updateTime.toString(),
    renderTime.toString()
  )
}

class Game extends Component {

  constructor(props) {
    super(props);
    this.state = {
      updatesPerTick: 1,
      pixelScale: 5,
      width: 200,
      height: 100,
      shouldRenderAll: true,
      players: [],
    };
  }

  onMouseOver = (e) => {
    let x = Math.floor(e.offsetX / this.state.pixelScale);
    let y = Math.floor(e.offsetY / this.state.pixelScale);
    console.log(this._canvas.hive.board.tiles[x][y]);
    this.setState({ watchTile: [x, y] });
  }

  componentDidMount() {
    this._canvas.hive = new HiveGame(this.state);
    this._canvas.hive.init();
    this._canvas.interval = setInterval(this.update, UPDATE_PERIOD);
    this._canvas.onmousedown = this.onMouseOver.bind(this);
  }

  update = () => {
    const newState = {};
    const updateStartTime = new Date().getTime();
    for (let i = 0; i < this.state.updatesPerTick; i++) {
      this._canvas.hive.update();
    }
    const updateTime = (new Date().getTime()) - updateStartTime;
    const renderStartTime = new Date().getTime();
    if (this.state.shouldRenderAll) {
      this.renderAll();
      newState.shouldRenderAll = false;
    } else {
      this.renderUpdates();
    }
    const renderTime = (new Date().getTime()) - renderStartTime;
    //logTime(updateTime, renderTime);
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
    let watchTile;
    if (this._canvas && this.state.watchTile) {
      const tileCoords = this.state.watchTile;
      const tile = this._canvas.hive.board.tiles[tileCoords[0]][tileCoords[1]]
      watchTile = <div>{ JSON.stringify(_.omitBy(tile.toDataHash(), (v) => _.isNull(v))) }</div>;
    }
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
        { watchTile }
      </div>
    );
  }
}

export default Game;
