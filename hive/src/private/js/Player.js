//import Hive from "./Hive.js";

function Player(props) {
  this.id = props.id;
  this.name = props.name;
  this.ants = props.ants;
  this.numDeadAnts = 0;
  this.numAntsKilled = 0;
  this.totalFood = 0;
  this.currentFood = 0;
  this.board = props.board;
  this.color = props.color;
}

Player.prototype.getQueenTile = function() {
  for (var i = 0; i < this.ants.length; i++) {
    if (this.ants[i].type === "queen") { return this.ants[i].tile; }
  }
}

export default Player;
