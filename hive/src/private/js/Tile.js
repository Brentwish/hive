const tileColors = {
  "empty": "#F6DDCC",
  "wall": "#424949",
  "food": "#2ECC71",
  "water": "#5DADE2"
};

const antColors = {
  "queen": "#7D6608",
  "worker": "#0B5345",
  "scout": "#424949",
  "fighter": "#C0392B"
};

function Tile(props) {
  this.x = props.x;
  this.y = props.y;
  this.type = props.type;
  this.ant = props.ant;
}

Tile.prototype.color = function() {
  return this.hasAnt() ? antColors[this.ant.type] : tileColors[this.type];
}

Tile.prototype.isVacant = function() {
  return !this.isWall() && !this.hasAnt();
}

Tile.prototype.isWall = function() {
  return this.type == "wall";
}

Tile.prototype.hasAnt = function() {
  return this.ant;
}

export default Tile;
