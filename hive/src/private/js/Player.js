//import Hive from "./Hive.js";

function Player(props) {
  this.id = props.id;
  this.ants = props.ants;
  this.board = props.board;
  this.hiveAction = props.playerGameActions.hiveAction;
  this.antAction = props.playerGameActions.antAction;
  this.color = props.color;
}

Player.prototype.getQueenTile = function() {
  for (var i = 0; i < this.ants.length; i++) {
    if (this.ants[i].type === "queen") { return this.ants[i].tile; }
  }
}

export default Player;
