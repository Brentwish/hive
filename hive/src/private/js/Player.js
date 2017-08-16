//import Hive from "./Hive.js";
import Ant from "./Ant.js";

function Player(props) {
  this.id = props.id;
  this.ants = props.ants;
  this.board = props.board;
  this.hiveAction = props.playerGameActions.hiveAction;
  this.antAction = props.playerGameActions.antAction;
}

export default Player;
