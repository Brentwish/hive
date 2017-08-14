import Board from "./Board.js";
import Player from "./Player.js";
import Ant from "./Ant.js";

function HiveGame(props) {
  this.board = new Board(props.width, props.height);
  this.players = [];
}

HiveGame.prototype.init = function() {
  this.board.borderedBoard();
  var playerProps = {
    id: 'player_1',
    board: this.board
  };
  this.players.push(new Player(playerProps));
  for (var i = 0; i < this.players.length; i++) {
    var pos = this.board.getRandomPosition();
    this.players[i].ants.push(new Ant({
      type: 'queen',
      color: 4,
      position: pos,
      squareType: this.board.squares[pos.x][pos.y],
      owner: this.players[i]
    }));
  }
}

HiveGame.prototype.update = function() {
  //this.board.borderedBoard();
  this.updatePlayers();
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
    if (this.isLegalMove(entity, action.dir)) {
      this.board.squares[entity.position.x][entity.position.y] = entity.squareType;
      this.move(entity, action.dir);
      entity.squareType = this.board.squares[entity.position.x][entity.position.y];
      this.board.squares[entity.position.x][entity.position.y] = entity.color;
    }
  }
}

HiveGame.prototype.isLegalMove = function(entity, dir) {
  return this.board.isInBounds(entity.position, dir);
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
