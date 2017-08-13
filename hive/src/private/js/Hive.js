import Ant from "./Ant.js";

function Hive(props) {
  this.health = props.health;
  this.player = props.player;

  this.player.ants.push(new Ant({
    type: 'queen',
    color: 4,
    position: this.player.board.getRandomPosition(),
    owner: this.player
  }));
}
export default Hive;
