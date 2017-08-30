import React, { Component } from 'react';
import GameOptions from "./GameOptions.js";
import GameDisplay from "./GameDisplay.js";
import GameControls from "./GameControls.js";
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

  componentDidMount() {
    if (!this.state.newGame) {
      window.hive = new HiveGame(this.state);
      window.hive.init();
      this.stepTimeout = setTimeout(this.step, 100);
    }
  }

  step = () => {
    const newState = {};
    const updateStartTime = new Date().getTime();
    for (let i = 0; i < this.state.updatesPerStep; i++) {
      window.hive.update();
    }
    const updateTime = (new Date().getTime()) - updateStartTime;
    const renderStartTime = new Date().getTime();
    if (this.state.shouldRenderAll) {
      this._display.renderAll(this.state.pixelScale);
      newState.shouldRenderAll = false;
    } else {
      this._display.renderUpdates(this.state.pixelScale);
    }
    const renderTime = (new Date().getTime()) - renderStartTime;
    //logTime(updateTime, renderTime);
    newState.players = window.hive.players.map((p) => {
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
  handleZoomIn = () => {
    const newPixelScale = Math.min(this.state.pixelScale + 1, 10);
    this.setState({
      pixelScale: newPixelScale,
      shouldRenderAll: true,
    });
    if (this.state.isPaused) {
      this.stepTimeout = setTimeout(this._display.renderAll, 50, parseInt(newPixelScale));
    }
  }
  handleZoomOut = () => {
    const newPixelScale = Math.max(this.state.pixelScale - 1, 1);
    this.setState({
      pixelScale: newPixelScale,
      shouldRenderAll: true,
    });
    if (this.state.isPaused) {
      this.stepTimeout = setTimeout(this._display.renderAll, 50, parseInt(newPixelScale));
    }
  }
  handleSpeedChange = (delay) => {
    const newState = { delayPerUpdate: delay };
    if (!this.state.newGame && this.state.isPaused) {
      this.stepTimeout = setTimeout(this.step, 50);
      newState.isPaused = false;
    }
    this.setState(newState);
  }
  handlePause = () => {
    this.setState({ isPaused: true });
  }
  handleStep = () => {
    if (!this.state.newGame && this.state.isPaused) {
      this.stepTimeout = setTimeout(this.step, 10);
    }
  }
  handleToggleTrails = () => {
    this.setState({ shouldRenderTrails: !this.state.shouldRenderTrails });
    if (!this.state.newGame) {
      this.stepTimeout = setTimeout(this._display.renderAll, 50, this.state.pixelScale);
    }
  }
  changeHandler = (value, key) => {
    const newState = {};
    newState[key] = value;
    this.setState(newState);
  }
  handleCreateNewGame = () => {
    clearTimeout(this.stepTimeout);
    delete window.hive;
    this.setState({ newGame: true, watchTile: null });
  }
  handleStart = () => {
    window.hive = new HiveGame(this.state);
    window.hive.init();
    this.setState({ newGame: false, shouldRenderAll: true });
    this.stepTimeout = setTimeout(this.step, 100);
  }
  handleTileSelect = (x, y) => {
    this.setState({ watchTile: [x, y] });
  }
  render() {
    let watchTile;
    if (window.hive && this.state.watchTile) {
      const tileCoords = this.state.watchTile;
      const tile = window.hive.board.tiles[tileCoords[0]][tileCoords[1]]
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
          startGame={ this.handleStart }
        />
      );
    } else {
      gameArea = <GameDisplay
        ref={ (d) => this._display = d }
        gameWidth={ this.state.width }
        gameHeight={ this.state.height }
        pixelScale={ this.state.pixelScale }
        onTileSelect={ this.handleTileSelect }
        showTrails={ this.state.shouldRenderTrails }
      />
    }
    const gameControls = <GameControls
      onPause={ this.handlePause }
      onSpeedChange={ this.handleSpeedChange }
      onToggleTrails={ this.handleToggleTrails }
      handleStopGame={ this.handleCreateNewGame }
      handleZoomOut={ this.handleZoomOut }
      handleZoomIn={ this.handleZoomIn }
      handleStep={ this.handleStep }
    />;
    return (
      <div>
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
                { gameControls }
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
