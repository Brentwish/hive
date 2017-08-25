import { antColors, tileColors } from "./constants.js";

function Tile(props) {
  this.x = props.x;
  this.y = props.y;
  this.type = props.type;
  this.ant = props.ant;
  this.food = props.food;
  this.trails = props.trails;
}

Tile.prototype.str = function() {
  return "{x: " + this.x + ", y: " + this.y + "}";
}

Tile.prototype.toDataHash = function() {
  return {
    type: this.type,
    food: this.food,
    trails: this.trails ? Object.assign({}, this.trails) : null,
    ant: this.hasAnt() ? this.ant.simpleDataHash() : null,
  }
}

Tile.prototype.color = function() {
  let color;
  if (this.hasAnt()) {
    color = (this.ant.eggTimer > 0 ? antColors["egg"] : this.ant.owner.color);
  } else {
    color = tileColors[this.type];
  }
  return color;
}

Tile.prototype.isVacant = function() {
  return !this.isWall() && !this.hasAnt();
}

Tile.prototype.hasAnt = function() {
  return this.ant;
}

Tile.prototype.hasTrail = function() {
  return this.trail;
}

Tile.prototype.isWall = function() {
  return this.type === "wall";
}

Tile.prototype.isEmpty = function() {
  return this.type === "empty";
}

Tile.prototype.isFood = function() {
  return this.type === "food";
}

Tile.prototype.coords = function() {
  return { x: this.x, y: this.y };
}

export default Tile;
