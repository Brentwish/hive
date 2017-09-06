import React, { Component } from 'react';
import GameOptions from "./GameOptions.js";
import GameDisplay from "./GameDisplay.js";
import GameControls from "./GameControls.js";
import InfoPane from "./InfoPane.js";
import FileSaver from "file-saver";
import EditorPane from "./EditorPane.js";
import HiveGame from "../js/HiveGame.js";
import { UPDATE_PERIOD, foodGrades } from "../js/constants.js";
import { defaultPlayerFunction } from "../js/constants.js";
import {
  MIN_NUM_PLAYERS, MAX_NUM_PLAYERS, MIN_BOARD_WIDTH,
  MAX_BOARD_WIDTH, MIN_BOARD_HEIGHT, MAX_BOARD_HEIGHT
} from "../js/constants.js";
import _ from "lodash";
import SplitPane from "react-split-pane";
import "./Hive.css";

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
      watchTile: [null, null],
      isAntWatched: false,
      watchAnt: "",
      paused: false,
      newGame: false,
      sparsity: "medium",
      density: "medium",
      saturation: "very low",
      playerCode: localStorage.getItem("playerCode") || defaultPlayerFunction,
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
      const numQueens = _.countBy(p.ants, (ant) => { return ant.type; }).queen || 0;
      const numWorkers = p.ants.length - numQueens;
      return {
        playerIdentifiers: {
          id: p.id,
          name: p.name,
          color: p.color,
        },
        antCounts: {
          numQueens,
          numWorkers,
        },
        combatCounts: {
          numDeadAnts: p.numDeadAnts,
          numAntsKilled: p.numAntsKilled,
        },
        foodCounts: {
          totalFood: p.totalFood,
          currentFood: p.currentFood,
        },
      }
    });
    if (this.state.isAntWatched) {
      const ant = window.hive.findAnt(this.state.watchAnt);
      if (ant) {
        newState.watchTile = [ant.tile.x, ant.tile.y];
      } else {
        newState.isAntWatched = false;
        newState.watchAnt = "";
      }
    }
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
    this.setState({ newGame: true, watchTile: [null, null] });
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
  handleTrackAnt = (a) => {
    if (this.state.watchTile[0]) {
      const ant = window.hive.board.getTileFromCoords({ x: this.state.watchTile[0], y: this.state.watchTile[1] }).ant;
      if (ant) {
        debugger;
        this.setState({
          isAntWatched: !this.state.isAntWatched,
          watchAnt: (!this.state.isAntWatched ? ant.owner.id + "_" + ant.id : ""),
        });
      }
    }
  }
  handleGamePan = (dX, dY) => {
    this._gamePane.scrollLeft += Math.floor(dX/10);
    this._gamePane.scrollTop += Math.floor(dY/10);
  }
  handleEditorSubmit = () => {
    try {
      eval(`(() => { ${this.state.playerCode} })`);
      this.handleCreateNewGame();
      this.handleStart();
    } catch (error) {
      window.hive.consoleLogs.push({ type: "error", message: error.message });
    }
  }
  handleDownload = () => {
    var blob = new Blob([this.state.playerCode], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "HiveAI.js");
  }
  render() {
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
        onZoomIn={ this.handleZoomIn }
        onZoomOut={ this.handleZoomOut }
        onPan={ this.handleGamePan }
      />
    }
    let gameControls;
    if (!this.state.newGame) {
      gameControls = (
        <div className="GameControlsDiv">
          <div className="GameControlsInner">
            <GameControls
              isPaused={ this.state.isPaused }
              gameSpeed={ this.state.delayPerUpdate }
              onPause={ this.handlePause }
              onSpeedChange={ this.handleSpeedChange }
              onToggleTrails={ this.handleToggleTrails }
              handleStopGame={ this.handleCreateNewGame }
              handleZoomOut={ this.handleZoomOut }
              handleZoomIn={ this.handleZoomIn }
              handleStep={ this.handleStep }
            />
          </div>
        </div>
      );
    }
    const infoPane = <InfoPane
      watchTile={ this.state.watchTile }
      onTrackAnt={ this.handleTrackAnt }
      isAntWatched={ this.state.isAntWatched }
      players={ this.state.players }
    />
    const editorPane = (
      <EditorPane
        playerCode={ this.state.playerCode }
        changeHandler={ this.changeHandler }
        onRun={ this.handleEditorSubmit }
        onFileWatch={ this.handleFileWatch }
        changeHandler={ this.changeHandler }
        onDownload={ this.handleDownload }
      />
    );
    let gameEndMessage;
    if (window.hive && window.hive.isGameOver) {
      gameEndMessage = <div>Player { window.hive.winningPlayer } wins!</div>;
    }
    return (
      <div>
        <SplitPane split="vertical" minSize={ 100 } defaultSize={ "670px" }>
          { editorPane }
          <div>
            <SplitPane split="horizontal" minSize={ 100 } defaultSize={ "69vh" }>
              <div className="GamePane" ref={ (g) => this._gamePane = g }>
                { gameControls }
                { gameEndMessage }
                <div className="GameArea">
                  { gameArea }
                </div>
              </div>
              { infoPane }
            </SplitPane>
          </div>
        </SplitPane>
      </div>
    );
  }
}

export default Hive;
