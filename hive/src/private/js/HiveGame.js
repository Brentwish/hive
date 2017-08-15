import Board from "./Board.js";
import Player from "./Player.js";
import Ant from "./Ant.js";

function HiveGame(props) {
  this.board = new Board(props.width, props.height);
  this.players = [];
  this.turn = 0;
}

HiveGame.prototype.init = function() {
  this.board.borderedBoard();
  this.players.push(new Player({
    id: 'player_1',
    ants: []
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
  this.updatePlayers();
  this.turn += 1;
}

HiveGame.prototype.updatePlayers = function() {
  for (var i = 0; i < this.players.length; i++) {
    this.players[i].updateHive();
    for (var j = 0; j < this.players[i].ants.length; j++) {
      var action = this.players[i].antAction(this.players[i].ants[j].toDataHash());
      this.performAction(this.players[i].ants[j], action);
    }
  }
}

HiveGame.prototype.performAction = function(entity, action) {
  if (action.type == "move") {
    var newTile = this.board.tileFromDirection(entity.tile.x, entity.tile.y, action.dir);
    if (this.isLegalMove(newTile)) {
      entity.tile.ant = null;
      newTile.ant = entity;
      entity.tile = newTile;
    }
  }
}

HiveGame.prototype.isLegalMove = function(tile) {
  return tile.isVacant() && this.board.isInBounds(tile.x, tile.y);
}

HiveGame.prototype.move = function(entity, dir) {
  if (dir == "left") {
    entity.position.x -= 1;
  } else if (dir == "right") {
    entity.position.x += 1;
  } else if (dir == "up") {
    entity.position.y -= 1;
  } else if (dir == "down") {
    entity.position.y += 1;
  } else {
    //
  }
}

export default HiveGame;
