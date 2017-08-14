//import Hive from "./Hive.js";
import Ant from "./Ant.js";

function Player(props) {
  this.id = props.id;
  this.board = props.board;
  this.ants = [];
  this.dirs = ["left", "right", "up", "down"];
}

Player.prototype.updateHive = function(hive) {
  //update hive ai
}

Player.prototype.antAction = function(antData) {
  var action = {};
  action.type = "move";
  action.dir = this.dirs[Math.floor(Math.random() * this.dirs.length)];
  return action;
}

export default Player;
