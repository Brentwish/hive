import React, { Component } from 'react';
import GameOptions from "./GameOptions.js";
import GameDisplay from "./GameDisplay.js";
import GameControls from "./GameControls.js";
import EditorControls from "./EditorControls.js";
import InfoPane from "./InfoPane.js";
import FileSaver from "file-saver";
import EditorPane from "./EditorPane.js";
import GamePane from "./GamePane.js";
import ReferencePane from "./ReferencePane.js";
import HiveGame from "../js/HiveGame.js";
import { LintOptions, LintGlobals } from "../js/constants.js";
import { UPDATE_PERIOD, playerColors, foodGrades, graphTypes } from "../js/constants.js";
import { defaultPlayerFunction } from "../js/constants.js";
import {
  MIN_NUM_PLAYERS, MAX_NUM_PLAYERS, MIN_BOARD_WIDTH,
  MAX_BOARD_WIDTH, MIN_BOARD_HEIGHT, MAX_BOARD_HEIGHT
} from "../js/constants.js";
import _ from "lodash";
import SplitPane from "react-split-pane";
import "./Hive.css";

let Lint = require('jshint').JSHINT;

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
      delayPerUpdate: 1,
      pixelScale: 5,
      width: 200,
      height: 100,
      gameWidth: 200,
      gameHeight: 100,
      shouldRenderAll: true,
      shouldRenderTrails: false,
      players: [],
      graphDimensions: { width: 0, height: 0 },
      watchTile: [null, null],
      isAntWatched: false,
      watchAnt: "",
      paused: false,
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
      playerAIs: JSON.parse(localStorage.getItem("playerAIs") || '""') || [ { AIid: "new_1", color: playerColors[0] } ],
      editingAIid: localStorage.getItem("editingAIid") || "new_1",
      playerCode: localStorage.getItem("playerCode") || defaultPlayerFunction,
      showApi: false,
      lintErrors: [],
    };
  }

  componentDidMount() {
    if (!this.state.showApi) {
      this.handleStart()
    }
  }
  hiveGameOptions() {
    const players = [];
    _.each(this.state.playerAIs, (playerAI) => {
      if (!_.isEmpty(this.state.AIs[playerAI.AIid])) {
        players.push({
          name: this.state.AIs[playerAI.AIid].name,
          code: this.state.AIs[playerAI.AIid].AICode,
          color: playerAI.color,
        });
      }
    });
    return _.merge(_.omit(this.state, "players"), { players });
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
  getPlayersFromGame = () => {
    return window.hive.players.map((p) => {
      const numQueens = _.countBy(p.ants, (ant) => { return ant.type; }).queen || 0;
      const numWorkers = p.ants.length - numQueens;
      return {
        identifiers: {
          id: p.id,
          name: p.name,
          color: p.color,
        },
        antCounts: {
          numQueens,
          numWorkers,
        },
        combatCounts: {
          numDead: p.numDead,
          numKilled: p.numKilled,
        },
        foodCounts: {
          totalFood: p.totalFood,
          currentFood: p.currentFood,
        },
      }
    });
  }
  step = () => {
    if (!window.hive || window.hive.isGameOver) {
      return;
    }
    const newState = {};
    const updateStartTime = new Date().getTime();
    for (let i = 0; i < this.state.updatesPerStep; i++) {
      window.hive.update();
    }
    const updateTime = (new Date().getTime()) - updateStartTime;
    const renderStartTime = new Date().getTime();
    if (this._game && this._game._display) {
      if (this.state.shouldRenderAll) {
        this._game._display.renderAll(this.state.pixelScale);
        newState.shouldRenderAll = false;
      } else {
        this._game._display.renderUpdates(this.state.pixelScale);
      }
    }
    const renderTime = (new Date().getTime()) - renderStartTime;
    //logTime(updateTime, renderTime);
    newState.players = this.getPlayersFromGame();
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
  handleZoomIn = () => {
    const newPixelScale = Math.min(this.state.pixelScale + 1, 10);
    this.setState({
      pixelScale: newPixelScale,
      shouldRenderAll: true,
    });
    if (this.state.isPaused) {
      this.stepTimeout = setTimeout(this._game._display.renderAll, 50, parseInt(newPixelScale));
    }
  }
  handleZoomOut = () => {
    const newPixelScale = Math.max(this.state.pixelScale - 1, 1);
    this.setState({
      pixelScale: newPixelScale,
      shouldRenderAll: true,
    });
    if (this.state.isPaused) {
      this.stepTimeout = setTimeout(this._game._display.renderAll, 50, parseInt(newPixelScale));
    }
  }
  handleSpeedChange = (delay) => {
    const newState = { delayPerUpdate: delay };
    if (!this.state.showApi && this.state.isPaused) {
      this.stepTimeout = setTimeout(this.step, 50);
      newState.isPaused = false;
    }
    this.setState(newState);
  }
  handlePause = () => {
    this.setState({ isPaused: true });
  }
  handleStep = () => {
    if (!this.state.showApi && this.state.isPaused) {
      this.stepTimeout = setTimeout(this.step, 10);
    }
  }
  handleToggleTrails = () => {
    this.setState({ shouldRenderTrails: !this.state.shouldRenderTrails });
    if (!this.state.showApi) {
      this.stepTimeout = setTimeout(this._game._display.renderAll, 50, this.state.pixelScale);
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
    this.setState({ showApi: true, watchTile: [null, null] });
  }
  handleStart = () => {
    window.hive = new HiveGame(this.hiveGameOptions());
    window.hive.init();
    this.setState({
      showApi: false,
      shouldRenderAll: true,
      graphs: this.initGraphs(),
      gameWidth: this.state.width,
      gameHeight: this.state.height,
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
    this._game._display._div.scrollLeft += Math.floor(dX/10);
    this._game._display._div.scrollTop += Math.floor(dY/10);
  }
  currentAIcode = () => {
    const ai = this.state.AIs[this.state.editingAIid];
    return ai ? ai.AICode : "";
  }
  handleEditorSubmit = () => {
    const lintErrors = this.lintCode(this.currentAIcode());
    const newState = {};
    if (lintErrors.length > 0) {
      if (this._refPane) {
        this._refPane.togglePane(2);
      }
      newState.lintErrors = lintErrors;
      newState.showApi = true;
    } else {
      newState.lintErrors = [];
      newState.showApi = false;
      this.handleCreateNewGame();
      this.handleStart();
    }
    this.setState(newState);
  }
  setGraphDimensions = () => {
    if (this._game && this._game._infoPane &&
        this._game._infoPane._playerInfo &&
        this._game._infoPane._playerInfo._graph &&
        this._game._infoPane._playerInfo._graph._graphContainer) {
      const div = this._game._infoPane._playerInfo._graph._graphContainer;
      this.setState({
        graphDimensions: { width: div.offsetWidth, height: div.offsetHeight }
      });
    }
  }
  handleDownload = () => {
    var blob = new Blob([this.currentAIcode()], {type: "text/plain;charset=utf-8"});
    FileSaver.saveAs(blob, "HiveAI.js");
  }
  lintCode = (code) => {
    Lint(code, LintOptions, LintGlobals);
    return Lint.errors;
  }
  updatePlayerCode = (newCode) => {
    this.lintCode(newCode);
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
    const otherAINames = _.map(_.values(this.state.AIs), "name");
    let newName = "New Hive AI"
    if (_.includes(otherAINames, newName)) {
      let i = 1;
      while (_.includes(otherAINames, `${newName} (${i})`)) {
        i++;
      }
      newName = `${newName} (${i})`;
    }
    const newAIs = this.state.AIs;
    newAIs[newId] = {
      id: newId,
      name: newName,
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
      const newAIs = _.omit(this.state.AIs, id);
      const keys = _.keys(newAIs);
      let updatedPlayerAIs = _.filter(this.state.playerAIs, (playerAI) => { return playerAI.AIid === id });
      if (keys.length > 0) {
        const selectedAI = keys[0];
        if (_.isEmpty(updatedPlayerAIs)) {
          updatedPlayerAIs = [{ AIid: selectedAI, color: this.getUnusedColor() }];
        }
        this.setState({
          AIs: _.omit(this.state.AIs, id),
          editingAIid: selectedAI,
          playerAIs: updatedPlayerAIs,
        });
        localStorage.setItem("AIs", JSON.stringify(_.omit(this.state.AIs, id)));
        localStorage.setItem("editingAIid", selectedAI);
        localStorage.setItem("playerAIs", JSON.stringify(updatedPlayerAIs));
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
  handleShowApi = () => {
    this.setState({ showApi: !this.state.showApi, shouldRenderAll: true });
  }
  getUnusedColor = () => {
    const currentColors = _.map(this.state.playerAIs, "color");
    return _.sample(_.difference(playerColors, currentColors));
  }
  addPlayer = () => {
    const newPlayers = _.concat(this.state.playerAIs, { AIid: this.state.editingAIid, color: this.getUnusedColor() });
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
    newPlayers[index][key] = value;
    this.setState({ playerAIs: newPlayers });
    localStorage.setItem("playerAIs", JSON.stringify(newPlayers));
  }
  renderGamePane() {
    return (
      <GamePane
        ref={ (g) => this._game = g }

        gameWidth={ this.state.gameWidth }
        gameHeight={ this.state.gameHeight }
        pixelScale={ this.state.pixelScale }
        onTileSelect={ this.handleTileSelect }
        showTrails={ this.state.shouldRenderTrails }
        onZoomIn={ this.handleZoomIn }
        onZoomOut={ this.handleZoomOut }
        onPan={ this.handleGamePan }

        isPaused={ this.state.isPaused }
        gameSpeed={ this.state.delayPerUpdate }
        onPause={ this.handlePause }
        onSpeedChange={ this.handleSpeedChange }
        onToggleTrails={ this.handleToggleTrails }
        handleStopGame={ this.handleCreateNewGame }
        handleStep={ this.handleStep }

        watchTile={ this.state.watchTile }
        onTrackAnt={ this.handleTrackAnt }
        isAntWatched={ this.state.isAntWatched }
        players={ this.state.players }
        graphs={ this.state.graphs }
        graphDimensions={ this.state.graphDimensions }
        setGraphDimensions={ this.setGraphDimensions }
      />
    );
  }
  render() {
    let leftPane;
    let rightPane;
    if (this.state.showApi) {
      rightPane = (
        <ReferencePane
          ref={ (r) => this._refPane = r }
          onRun={ this.handleEditorSubmit }
          lintErrors={ this.state.lintErrors }
        />
      );
    } else {
      rightPane = this.renderGamePane();
    }
    const editorPane = (
      <EditorPane
        playerCode={ this.currentAIcode() }
        updatePlayerCode={ this.updatePlayerCode }
        onRun={ this.handleEditorSubmit }
        onDownload={ this.handleDownload }
        AIs={ _.values(this.state.AIs) }
        selectAI={ this.selectAI }
        addAI={ this.addAI }
        updateAI={ this.updateAI }
        deleteAI={ this.deleteAI }

        width={ this.state.width }
        height={ this.state.height }
        sparsity={ this.state.sparsity }
        density={ this.state.density }
        saturation={ this.state.saturation }
        changeHandler={ this.changeHandler }
        players={ this.state.playerAIs }
        AIs={ this.state.AIs }
        onAddPlayer={ this.addPlayer }
        removePlayer={ this.removePlayer }
        updatePlayer={ this.updatePlayer }
        changeHandler={ this.changeHandler }
      />
    );
    return (
      <div>
        <SplitPane split="vertical" minSize={ 100 } defaultSize={ "670px" } onChange={ this.setGraphDimensions}>
          { editorPane }
          { rightPane }
        </SplitPane>
      </div>
    );
  }
}

export default Hive;
