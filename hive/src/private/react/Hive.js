import React, { Component } from 'react';
import GameOptions from "./GameOptions.js";
import HiveGame from "../js/HiveGame.js";
import { UPDATE_PERIOD, foodGrades } from "../js/constants.js";
import {
  MIN_NUM_PLAYERS, MAX_NUM_PLAYERS, MIN_BOARD_WIDTH,
  MAX_BOARD_WIDTH, MIN_BOARD_HEIGHT, MAX_BOARD_HEIGHT
} from "../js/constants.js";
import _ from "lodash";
import SplitPane from "react-split-pane";
import "./Hive.css";
import brace from "brace";
import AceEditor from "react-ace";

import 'brace/mode/javascript';
import 'brace/theme/monokai';

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

class Hive extends Component {

  constructor(props) {
    super(props);
    this.state = {
      updatesPerStep: 1,
      delayPerUpdate: 10,
      pixelScale: 5,
      width: 200,
      height: 100,
      shouldRenderAll: true,
      shouldRenderTrails: false,
      numPlayers: 5,
      players: [],
      paused: false,
      newGame: false,
      sparsity: "medium",
      density: "medium",
      saturation: "very low",
    };
  }

  onMouseDown = (e) => {
    let x = Math.floor(e.nativeEvent.offsetX / this.state.pixelScale);
    let y = Math.floor(e.nativeEvent.offsetY / this.state.pixelScale);
    console.log(this._gameDiv.hive.board.tiles[x][y]);
    this.setState({ watchTile: [x, y] });
  }

  componentDidMount() {
    if (!this.state.newGame) {
      this._gameDiv.hive = new HiveGame(this.state);
      this._gameDiv.hive.init();
      this.stepTimeout = setTimeout(this.step, 100);
    }
  }

  step = () => {
    const newState = {};
    const updateStartTime = new Date().getTime();
    for (let i = 0; i < this.state.updatesPerStep; i++) {
      this._gameDiv.hive.update();
    }
    const updateTime = (new Date().getTime()) - updateStartTime;
    const renderStartTime = new Date().getTime();
    if (this.state.shouldRenderAll) {
      this.renderAll(this.state.pixelScale);
      newState.shouldRenderAll = false;
    } else {
      this.renderUpdates(this.state.pixelScale);
    }
    const renderTime = (new Date().getTime()) - renderStartTime;
    //logTime(updateTime, renderTime);
    newState.players = this._gameDiv.hive.players.map((p) => {
      return {
        id: p.id,
        antCount: p.ants.length,
        color: p.color,
      };
    });
    this.setState(newState);

    // Schedule next step
    if (!this.state.isPaused) {
      this.stepTimeout = setTimeout(this.step, this.state.delayPerUpdate);
    }
  }
  renderUpdates(pixelScale) {
    const ctx = this._canvas.getContext('2d');
    const updatedTiles = this._gameDiv.hive.getUpdatedTiles();
    if (updatedTiles.length > 0) {
      updatedTiles.forEach((tile) => {
        ctx.clearRect(pixelScale * tile.x, pixelScale * tile.y, pixelScale, pixelScale);
        ctx.fillStyle = tile.color(this.state.shouldRenderTrails);
        ctx.fillRect(pixelScale * tile.x, pixelScale * tile.y, pixelScale, pixelScale);
      });
      this._gameDiv.hive.clearUpdatedTiles();
    }
  }
  renderAll = (pixelScale) => {
    pixelScale = this.state.pixelScale;
    const ctx = this._canvas.getContext('2d');
    ctx.clearRect(0, 0, this._gameDiv.width, this._gameDiv.height);
    for (var i = 0; i < this._gameDiv.hive.board.width; i++) {
      for (var j = 0; j < this._gameDiv.hive.board.height; j++) {
        ctx.fillStyle = this._gameDiv.hive.board.tiles[i][j].color(this.state.shouldRenderTrails);
        ctx.fillRect(pixelScale * i, pixelScale * j, pixelScale, pixelScale);
      }
    }
  }
  handlePixelScaleChange = (evt) => {
    this.setState({
      pixelScale : parseInt(evt.target.value),
      shouldRenderAll: true,
    });
    if (this.state.isPaused) {
      this.stepTimeout = setTimeout(this.renderAll, 50, parseInt(evt.target.value));
    }
  }
  handleUpdatesPerStepChange = (evt) => {
    this.setState({ updatesPerStep: parseInt(evt.target.value) });
  }
  handleDelayPerUpdateChange = (evt) => {
    this.setState({ delayPerUpdate: parseInt(evt.target.value) });
  }
  handlePause = () => {
    if (!this.state.newGame && this.state.isPaused) {
      this.stepTimeout = setTimeout(this.step, 50);
    }
    this.setState({ isPaused: !this.state.isPaused });
  }
  handleStep = () => {
    if (!this.state.newGame && this.state.isPaused) {
      this.stepTimeout = setTimeout(this.step, 10);
    }
  }
  handleRenderTrails = () => {
    this.setState({ shouldRenderTrails: !this.state.shouldRenderTrails });
    if (!this.state.newGame) {
      this.stepTimeout = setTimeout(this.renderAll, 50, this.state.pixelScale);
    }
  }
  changeHandler = (value, key) => {
    const newState = {};
    newState[key] = value;
    this.setState(newState);
  }
  handleCreateNewGame = () => {
    clearTimeout(this.stepTimeout);
    delete this._gameDiv.hive;
    this.setState({ newGame: true, watchTile: null });
  }
  handleStart = () => {
    this._gameDiv.hive = new HiveGame(this.state);
    this._gameDiv.hive.init();
    this.setState({ newGame: false, shouldRenderAll: true });
    this.stepTimeout = setTimeout(this.step, 100);
  }
  render() {
    let watchTile;
    if (this._gameDiv && this.state.watchTile) {
      const tileCoords = this.state.watchTile;
      const tile = this._gameDiv.hive.board.tiles[tileCoords[0]][tileCoords[1]]
      watchTile = (<div style={ { 'text-align': "left", width: "150px", margin: "auto" } }>
        <pre>{ JSON.stringify(_.omitBy(_.omit(tile.toDataHash(), "ant"), (v) => _.isNull(v)), undefined, 2) }</pre>
        <pre>{ tile.ant ? JSON.stringify(_.omitBy(_.omit(tile.ant.toDataHash(), ['adjacentTiles', 'currentTile']), (v) => _.isNull(v)), undefined, 2) : "" }</pre>
      </div>);
    }
    const playerAntCounts = (<div className="PlayerAntCounts"> {
      this.state.players.map((p) => {
        return <div className="PlayerAntCount" style={ { background: p.color } } key={ p.id }>{ p.antCount }</div>;
      })
    }</div>);
    let gameArea;
    if (this.state.newGame) {
      gameArea = (
        <GameOptions
          width={ this.state.width }
          height={ this.state.height }
          numPlayers={ this.state.numPlayers }
          sparsity={ this.state.sparsity }
          density={ this.state.density }
          saturation={ this.state.saturation }
          changeHandler={ this.changeHandler }
        />
      );
    } else {
      gameArea = (
        <div>
          <canvas
            ref={ (c) => this._canvas = c }
            className="game_board"
            onMouseDown={ this.onMouseDown }
            width={ this.state.width * this.state.pixelScale }
            height={ this.state.height * this.state.pixelScale }>
          </canvas>
        </div>
      );
    }
    const gameControlsButtons = (
      <div className="GameControls">
        <button onClick={ this.state.newGame ? this.handleStart : this.handleCreateNewGame }>{ this.state.newGame ? "Start" : "New Game" }</button>
        <button onClick={ this.handlePause }>{ this.state.isPaused ? "Run" : "Pause" }</button>
        <button onClick={ this.handleStep }>Step</button>
        <input type="checkbox" id="renderTrails" onChange={ this.handleRenderTrails } />
        <label for="renderTrails">Trails</label>
      </div>
    );
    const gameControlsSliders = (
      <div className="GameControls">
        <div className="GameSlider">
          <span>Pixel Scale: { this.state.pixelScale }</span>
          <input type="range" min="1" max="10" step="1" value={ this.state.pixelScale.toString() || "1" } onChange={ this.handlePixelScaleChange } />
        </div>
        <div className="GameSlider">
          <span>Updates per step: { this.state.updatesPerStep }</span>
          <input type="range" min="1" max="100" step="1" value={ this.state.updatesPerStep.toString() || "1" } onChange={ this.handleUpdatesPerStepChange } />
        </div>
        <div className="GameSlider">
          <span>Delay per update: { this.state.delayPerUpdate }</span>
          <input type="range" min="10" max="1000" step="10" value={ this.state.delayPerUpdate.toString() || "1" } onChange={ this.handleDelayPerUpdateChange } />
        </div>
      </div>
    );
    return (
      <div ref={ (d) => this._gameDiv = d }>
        <SplitPane split="vertical" minSize={ 100 } defaultSize={ "25vw" }>
          <div className="EditorPane">
            <AceEditor
              width={ "100%" }
              height={ "100%" }
              mode="javascript"
              theme="monokai"
              onLoad={this.onLoad}
              onChange={this.onChange}
              fontSize={14}
              showPrintMargin={true}
              showGutter={true}
              highlightActiveLine={true}
              value={`function onLoad(editor) {\n  console.log("i've loaded");\n}`}
              setOptions={{
              enableBasicAutocompletion: false,
              enableLiveAutocompletion: false,
              enableSnippets: false,
              showLineNumbers: true,
              tabSize: 2,
            }}
            />
          </div>
          <div>
            <SplitPane split="horizontal" minSize={ 100 } defaultSize={ "75vh" }>
              <div className="GamePane">
                { gameControlsButtons }
                { gameControlsSliders }
                { gameArea }
              </div>
              <div>
                { playerAntCounts }
                { watchTile }
              </div>
            </SplitPane>
          </div>
        </SplitPane>
      </div>
    );
  }
}

export default Hive;
