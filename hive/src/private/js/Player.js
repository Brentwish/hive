//import Hive from "./Hive.js";
import Ant from "./Ant.js";

const dirs = ["left", "right", "up", "down"];

function Player(props) {
  this.id = props.id;
  this.ants = props.ants;
}

Player.prototype.updateHive = function(hive) {
  //update hive ai
}

Player.prototype.antAction = function(antData) {
  var action = {};
  action.type = "move";
  action.dir = dirs[Math.floor(Math.random() * dirs.length)];
  return action;
}

export default Player;
