function Ant(props) {
  this.type = props.type;
  this.owner = props.owner;
  this.tile = props.tile;
  this.prevTile = props.prevTile;
}

Ant.prototype.toDataHash = function(dir) {
  return {
    x: this.tile.x,
    y: this.tile.y,
    type: this.type,
    prevTile: this.prevTile,
    board: this.owner.board
  }
}

export default Ant;
