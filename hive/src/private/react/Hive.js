import React, { Component } from 'react';
import GameOptions from "./GameOptions.js";
import GameDisplay from "./GameDisplay.js";
import GameControls from "./GameControls.js";
import InfoPane from "./InfoPane.js";
import FileSaver from "file-saver";
import EditorPane from "./EditorPane.js";
import HiveGame from "../js/HiveGame.js";
import { UPDATE_PERIOD, foodGrades, graphTypes } from "../js/constants.js";
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
      players: [],
      graphDimensions: { width: 0, height: 0 },
      watchTile: [null, null],
      isAntWatched: false,
      watchAnt: "",
      paused: false,
      newGame: true,
      sparsity: "medium",
      density: "medium",
      saturation: "very low",
      AIs: JSON.parse(localStorage.getItem("AIs") || '""') || {
        new_1: {
          id: "new_1",
          name: "My Hive AI",
          AICode: localStorage.getItem("playerCode") || defaultPlayerFunction
        }
      },
      playerAIs: JSON.parse(localStorage.getItem("playerAIs") || '""') || [ "new_1" ],
      editingAIid: localStorage.getItem("editingAIid") || "new_1",
    };
  }

  componentDidMount() {
    if (!this.state.newGame) {
      window.hive = new HiveGame(this.hiveGameOptions());
      window.hive.init();
      this.setState({ graphs: this.initGraphs() });
      this.stepTimeout = setTimeout(this.step, 100);
    }
  }

  hiveGameOptions() {
    return _.merge(_.omit(this.state, "players"), {
      players: _.map(this.state.playerAIs, (ai) => this.state.AIs[ai]),
    });
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
    if (window.hive.turn % 10 === 0) newState.graphs = this.updateGraphs(newState.players);
    this.setState(newState);

    // Schedule next step
    if (!this.state.isPaused) {
      this.stepTimeout = setTimeout(this.step, this.state.delayPerUpdate);
    }
  }
  initGraphs = () => {
    const graphs = {};
    const colors = graphs["playerColors"] = [];
    _.forEach(graphTypes, (type) => {
      const graph = graphs[type] = []; //Array of players' data
      _.forEach(window.hive.players, (player, i) => {
        graph.push([]); //Array of player's data
        colors.push(player.color);
      });
    });
    return graphs;
  }
  updateGraphs = (players) => {
    const graphs = this.state.graphs;
    _.forEach(graphTypes, (type) => {
      const graph = graphs[type];
      _.forEach(players, (player, i) => {
        const data = graph[i];
        if (data.length > 100) data.shift();
        switch (type) {
          case "TotalAnts":
            data.push({
              x: window.hive.turn,
              y: player.antCounts.numQueens + player.antCounts.numWorkers,
            });
            break;
          case "DeadAnts":
            data.push({
              x: window.hive.turn,
              y: player.combatCounts.numDeadAnts,
            });
            break;
          case "AntsKilled":
            data.push({
              x: window.hive.turn,
              y: player.combatCounts.numAntsKilled,
            });
            break;
          case "TotalFood":
            data.push({
              x: window.hive.turn,
              y: player.foodCounts.totalFood,
            });
            break;
        }
      });
    });
    return graphs;
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
  changeHandler = (key, value) => {
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
    window.hive = new HiveGame(this.hiveGameOptions());
    window.hive.init();
    this.setState({
      newGame: false,
      shouldRenderAll: true,
      graphs: this.initGraphs(),
    });
    this.stepTimeout = setTimeout(this.step, 100);
  }
  handleTileSelect = (x, y) => {
    this.setState({ watchTile: [x, y] });
  }
  handleTrackAnt = (a) => {
    if (this.state.watchTile[0]) {
      const ant = window.hive.board.getTileFromCoords({ x: this.state.watchTile[0], y: this.state.watchTile[1] }).ant;
      if (ant) {
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
  currentAIcode = () => {
    const ai = this.state.AIs[this.state.editingAIid];
    return ai ? ai.AICode : "";
  }
  handleEditorSubmit = () => {
    try {
      eval(`(() => { ${this.currentAIcode()} })`);
      this.handleCreateNewGame();
      this.handleStart();
    } catch (error) {
      window.hive.consoleLogs.push({ type: "error", message: error.message });
    }
  }
  setGraphDimensions = () => {
    if (this._infoPane && this._infoPane._playerInfo && this._infoPane._playerInfo._graphContainer) {
      const div = this._infoPane._playerInfo._graphContainer
      this.setState({
        graphDimensions: { width: div.offsetWidth, height: div.offsetHeight }
      });
    }
  }
  handleDownload = () => {
    var blob = new Blob([this.currentAIcode()], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "HiveAI.js");
  }
  updatePlayerCode = (newCode) => {
    this.updateAI(this.state.editingAIid, "AICode", newCode);
  }
  addAI = () => {
    const ids = _.keys(this.state.AIs);
    let nextId;
    let count = 1;
    while (_.indexOf(ids, `new_${count}`) !== -1) {
      count++;
    }
    const newId = `new_${count}`;
    const newAIs = this.state.AIs;
    newAIs[newId] = {
      id: newId,
      name: "My Hive AI",
      AICode: defaultPlayerFunction,
    };
    this.setState({ AIs: newAIs });
    localStorage.setItem("AIs", JSON.stringify(newAIs));
  }
  updateAI = (id, key, value) => {
    const newAIs = this.state.AIs;
    const oldAI = newAIs[id];
    if (oldAI) {
      oldAI[key] = value;
      newAIs[id] = oldAI;
      this.setState({ AIs: newAIs });
      localStorage.setItem("AIs", JSON.stringify(newAIs));
    } else {
      console.log("Couldn't find AI with id", id);
    }
  }
  deleteAI = (id) => {
    if (this.state.AIs[id]) {
      const newAIs =_.omit(this.state.AIs, id);
      const keys = _.keys(newAIs);
      if (keys.length > 0) {
        const selectedAI = keys[0];
        this.setState({ AIs: _.omit(this.state.AIs, id), editingAIid: selectedAI });
        localStorage.setItem("AIs", JSON.stringify(_.omit(this.state.AIs, id)));
        localStorage.setItem("editingAIid", selectedAI);
      }
    } else {
      console.log("Couldn't find AI with id", id);
    }
  }
  selectAI = (id) => {
    if (this.state.AIs[id]) {
      this.setState({ editingAIid: id });
      localStorage.setItem("editingAIid", id);
    } else {
      console.log("Couldn't find AI with id", id);
    }
  }
  addPlayer = () => {
    const newPlayers = _.concat(this.state.playerAIs, this.state.editingAIid);
    this.setState({ playerAIs: newPlayers });
    localStorage.setItem("playerAIs", JSON.stringify(newPlayers));
  }
  removePlayer = (index) => {
    const newPlayers = _.clone(this.state.playerAIs);
    newPlayers.splice(index, 1);
    this.setState({ playerAIs: newPlayers });
    localStorage.setItem("playerAIs", JSON.stringify(newPlayers));
  }
  updatePlayer = (index, key, value) => {
    const newPlayers = _.clone(this.state.playerAIs);
    newPlayers[index] = value;
    this.setState({ playerAIs: newPlayers });
    localStorage.setItem("playerAIs", JSON.stringify(newPlayers));
  }
  render() {
    let gameArea;
    if (this.state.newGame) {
      gameArea = (
        <GameOptions
          width={ this.state.width }
          height={ this.state.height }
          sparsity={ this.state.sparsity }
          density={ this.state.density }
          saturation={ this.state.saturation }
          changeHandler={ this.changeHandler }
          startGame={ this.handleStart }

          players={ this.state.playerAIs }
          AIs={ this.state.AIs }
          onAddPlayer={ this.addPlayer }
          removePlayer={ this.removePlayer }
          updatePlayer={ this.updatePlayer }
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
      ref={ (i) => this._infoPane = i }
      watchTile={ this.state.watchTile }
      onTrackAnt={ this.handleTrackAnt }
      isAntWatched={ this.state.isAntWatched }
      players={ this.state.players }
      graphs={ this.state.graphs }
      graphDimensions={ this.state.graphDimensions }
      setGraphDimensions={ this.setGraphDimensions }
    />
    const editorPane = (
      <EditorPane
        playerCode={ this.currentAIcode() }
        updatePlayerCode={ this.updatePlayerCode }
        onRun={ this.handleEditorSubmit }
        onFileWatch={ this.handleFileWatch }
        onDownload={ this.handleDownload }

        AIs={ _.values(this.state.AIs) }
        selectAI={ this.selectAI }
        addAI={ this.addAI }
        updateAI={ this.updateAI }
        deleteAI={ this.deleteAI }
      />
    );
    let gameEndMessage;
    if (window.hive && window.hive.isGameOver) {
      gameEndMessage = <div>Player { window.hive.winningPlayer } wins!</div>;
    }
    return (
      <div>
        <SplitPane split="vertical" minSize={ 100 } defaultSize={ "670px" } onChange={ this.setGraphDimensions}>
          { editorPane }
          <div>
            <SplitPane split="horizontal" minSize={ 100 } defaultSize={ "69vh" } onChange={ this.setGraphDimensions }>
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
