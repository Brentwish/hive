import Board from "./Board.js";
import Player from "./Player.js";
import Ant from "./Ant.js";
import playerGameActions from "./playerGameActions.js";

import { dirs } from "./constants.js";

function HiveGame(props) {
  this.board = new Board(props.width, props.height);
  this.players = [];
  this.turn = 0;
}

HiveGame.prototype.init = function() {
  this.board.borderedBoard();
  this.board.addRandomFood();
  this.players.push(new Player({
    id: 'player_1',
    ants: [],
    playerGameActions: playerGameActions
  }));

  for (var i = 0; i < this.players.length; i++) {
    var ant = new Ant({
      type: 'queen',
      owner: this.players[i],
      tile: this.board.getRandomVacantTile()
    });
    this.players[i].ants.push(ant);
    ant.tile.ant = ant;
  }
}

HiveGame.prototype.update = function() {
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
  if (action.type == "move") {
    var newTile = this.board.tileFromDirection(entity.tile.x, entity.tile.y, action.dir);
    if (newTile && this.isLegalMove(newTile)) {
      entity.tile.ant = null;
      newTile.ant = entity;
      entity.tile = newTile;
    }
  }
}

HiveGame.prototype.isLegalMove = function(tile) {
  return tile.isVacant();
}

export default HiveGame;
