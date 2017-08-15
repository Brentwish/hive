function Ant(props) {
  this.type = props.type;
  this.position = props.position;
  this.owner = props.owner;
  this.color = props.color;
  this.squareType = props.squareType;
  this.score = 0;
}

Ant.prototype.toDataHash = function(dir) {
  return {
    position: { x: this.position.x, y: this.position.y }
  }
}

export default Ant;
