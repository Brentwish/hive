function Ant(props) {
  this.type = props.type;
  this.owner = props.owner;
  this.tile = props.tile;
}

Ant.prototype.toDataHash = function(dir) {
  return {
    x: this.tile.x,
    y: this.tile.y
  }
}

export default Ant;
