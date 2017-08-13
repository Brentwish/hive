import Hive from "./Hive.js";

function Player(props) {
  this.id = props.id;
  this.board = props.board;
  this.ants = new Array();
}

Player.prototype.init = function() {
  this.hive = new Hive({
    health: 10,
    player: this
  });
}


Player.prototype.updateHive = function(hive) {
  //update hive ai
}

Player.prototype.updateAnt = function(ant) {
  this.board.squares[ant.position.x][ant.position.y] = ant.color;
  //update ant ai
}

export default Player;
