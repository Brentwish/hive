function Ant(props) {
  this.id = props.id;
  this.type = props.type;
  this.owner = props.owner;
  this.tile = props.tile;
  this.prevTile = props.prevTile;
  this.food = props.food;
  this.eggTimer = props.eggTimer;
}

Ant.prototype.toDataHash = function(dir) {
  return {
    x: this.tile.x,
    y: this.tile.y,
    type: this.type,
    prevTile: this.prevTile,
    board: this.owner.board,
    food: this.food,
  }
}

export default Ant;
