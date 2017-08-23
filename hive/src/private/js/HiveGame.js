import Board from "./Board.js";
import Player from "./Player.js";
import Ant from "./Ant.js";
import playerGameActions from "./playerGameActions.js";
import { randomInt } from "./constants.js";
import { MAX_FOOD } from "./constants.js";
import { NEW_ANT_COST } from "./constants.js";
import { EGG_TIMER } from "./constants.js";

function HiveGame(props) {
  this.board = new Board(props.width, props.height);
  this.players = [];
  this.turn = 0;
  this.coordsToRender = [];
}

HiveGame.prototype.init = function() {
  this.board.borderedBoard();
  this.board.addRandomFood();
  for (let i = 0; i < 5; i++) {
    this.players.push(new Player({
      id: 'player_' + (i + 1),
      ants: [],
      board: this.board,
      playerGameActions: playerGameActions,
    }));
  }

  for (var i = 0; i < this.players.length; i++) {
    var queen = new Ant({
      id: 1,
      type: 'queen',
      owner: this.players[i],
      tile: this.board.getRandomVacantTile(),
      food: 35,
      eggTimer: 0,
    });
    this.players[i].ants.push(queen);
    queen.tile.ant = queen;
  }
  this.coordsToRender = new Set();
}

HiveGame.prototype.update = function() {
  this.turn += 1;
  this.updatePlayers();
}

HiveGame.prototype.pushCoordToRender = function(coord) {
  this.coordsToRender.add(JSON.stringify(coord));
}

HiveGame.prototype.getUpdatedTiles = function() {
  return [...this.coordsToRender].map((coordJson) => {
    const coord = JSON.parse(coordJson);
    return this.board.getTileFromCoords(coord);
  });
}

HiveGame.prototype.clearUpdatedTiles = function() {
  this.coordsToRender.clear();
}

HiveGame.prototype.updatePlayers = function() {
  for (var i = 0; i < this.players.length; i++) {
    this.players[i].hiveAction();
    for (var j = 0; j < this.players[i].ants.length; j++) {
      if (this.players[i].ants[j].eggTimer === 0) {
        var action = this.players[i].antAction(this.players[i].ants[j].toDataHash());
        this.performAction(this.players[i].ants[j], action);
      } else {
        this.players[i].ants[j].eggTimer -= 1;
      }
    }
  }
}

HiveGame.prototype.performAction = function(entity, action) {
  if (action.type === "move") {
    if (this.isLegalMove(action.tile)) {
      this.pushCoordToRender(entity.tile.coords());
      action.prevTile = entity.tile;
      entity.prevTile = entity.tile;
      entity.tile.ant = null;
      action.tile.ant = entity;
      entity.tile = action.tile;
      this.pushCoordToRender(entity.tile.coords());
    }
  } else if (action.type === "gather") {
    if (this.isLegalGather(action.tile) && entity.food < MAX_FOOD) {
      action.tile.food -= 1;
      entity.food += 1;
      if (action.tile.food === 0) {
        action.tile.type = "empty";
        action.tile.food = null;
        this.pushCoordToRender(action.tile.coords());
      }
    }
  } else if (action.type === "transfer") {
    if (this.isLegalTransfer(action.from, action.to, action.amount)) {
      action.from.food -= action.amount;
      action.to.food += action.amount;
    }
  } else if (action.type === "layEgg") {
    if (this.canLayEgg(entity)) {
      this.layEgg(entity);
    }
  }
  var prevTile = action.prevTile ? action.prevTile.str() : "";
  //this.log({
  //  message: entity.type + entity.id + " " + action.type + ": " + prevTile + " -> " + action.tile.str(),
  //  ant: entity,
  //  action: action,
  //});
}

HiveGame.prototype.layEgg = function(ant) {
  let emptyTiles = this.board.adjacentTiles(ant.tile).filter((t) => { return !t.hasAnt() });
	if (emptyTiles.length === 0) {
    return;
  }
  let tile = emptyTiles[randomInt(emptyTiles.length)];
  let worker = new Ant({
    id: ant.owner.ants.length + 1,
    type: 'worker',
    owner: ant.owner,
    tile: tile,
    food: 0,
    eggTimer: EGG_TIMER,
  });
  tile.ant = worker;
  ant.owner.ants.push(worker);
  ant.food -= NEW_ANT_COST;
  this.pushCoordToRender(tile.coords());
}

HiveGame.prototype.log = function(data) {
  console.log(data);
}

HiveGame.prototype.isLegalMove = function(tile) {
  return tile.isVacant();
}

HiveGame.prototype.isLegalGather = function(tile) {
  return tile.isFood() && tile.food > 0;
}

HiveGame.prototype.isLegalTransfer = function(from, to, amount) {
  //check from is adjacent to to
  //check from doesnt have an illegal amount of food
  return true;
}

HiveGame.prototype.canLayEgg = function(ant) {
  return ant.type === "queen" && ant.food >= NEW_ANT_COST;
}

export default HiveGame;
