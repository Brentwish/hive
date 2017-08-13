import Board from "./Board.js";
import Player from "./Player.js";

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
    this.players[i].init();
  }
}

HiveGame.prototype.update = function() {
  this.board.borderedBoard();
  this.updatePlayers();
}

//update players should merge and shuffle their ant arrays
HiveGame.prototype.updatePlayers = function() {
  for (var i = 0; i < this.players.length; i++) {
    var player = this.players[i];
    player.updateHive();
    for (var j = 0; j < player.ants.length; j++) {
      player.updateAnt(player.ants[j]);
    }
  }
}

export default HiveGame;
