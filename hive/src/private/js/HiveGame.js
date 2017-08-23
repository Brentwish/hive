import Board from "./Board.js";
import Player from "./Player.js";
import Ant from "./Ant.js";
import playerGameActions from "./playerGameActions.js";
import { MAXFOOD } from "./constants.js";

function HiveGame(props) {
  this.board = new Board(props.width, props.height);
  this.players = [];
  this.turn = 0;
  this.toRender = [];
}

HiveGame.prototype.init = function() {
  this.board.borderedBoard();
  this.board.addRandomFood();
  this.players.push(new Player({
    id: 'player_1',
    ants: [],
    board: this.board,
    playerGameActions: playerGameActions,
  }));

  for (var i = 0; i < this.players.length; i++) {
    var queen = new Ant({
      id: 1,
      type: 'queen',
      owner: this.players[i],
      tile: this.board.getRandomVacantTile(),
      food: 0,
    });
    this.players[i].ants.push(queen);
    queen.tile.ant = queen;

    for (var j = 0; j < 1; j++) {
      var worker = new Ant({
        id: i + 1,
        type: 'worker',
        owner: this.players[i],
        tile: this.board.getRandomVacantTile(),
        food: 0,
      });
      worker.tile.ant = worker;
      this.players[i].ants.push(worker);
    }
  }
}

HiveGame.prototype.update = function() {
  this.toRender = [];
  this.turn += 1;
  this.updatePlayers();
}

HiveGame.prototype.updatePlayers = function() {
  for (var i = 0; i < this.players.length; i++) {
    this.players[i].hiveAction();
    for (var j = 0; j < this.players[i].ants.length; j++) {
      var action = this.players[i].antAction(this.players[i].ants[j].toDataHash());
      this.performAction(this.players[i].ants[j], action);
    }
  }
}

HiveGame.prototype.performAction = function(entity, action) {
  if (action.type === "move") {
    if (this.isLegalMove(action.tile)) {
      this.toRender.push(entity.tile);
      action.prevTile = entity.tile;
      entity.prevTile = entity.tile;
      entity.tile.ant = null;
      action.tile.ant = entity;
      entity.tile = action.tile;
      this.toRender.push(entity.tile);
    }
  } else if (action.type === "gather") {
    if (this.isLegalGather(action.tile) && entity.food < MAXFOOD) {
      action.tile.food -= 1;
      entity.food += 1;
      if (action.tile.food === 0) {
        action.tile.type = "empty";
        action.tile.food = null;
        this.toRender.push(action.tile);
      }
    }
  }
  var prevTile = action.prevTile ? action.prevTile.str() : "";
  this.log({
    message: entity.type + entity.id + " " + action.type + ": " + prevTile + " -> " + action.tile.str(),
    ant: entity,
    action: action,
  });
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

export default HiveGame;
