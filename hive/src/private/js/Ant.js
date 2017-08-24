import { dirs } from "./constants.js";

function Ant(props) {
  this.id = props.id;
  this.type = props.type;
  this.owner = props.owner;
  this.tile = props.tile;
  this.food = props.food;
  this.eggTimer = props.eggTimer;
  this.moves = props.moves;
}

Ant.prototype.toDataHash = function() {
  const tiles = {};
  const adjacentTiles = this.owner.board.adjacentTiles(this.tile);
  dirs.forEach((dir) => {
    const tile = this.owner.board.tileFromDirection(this.tile.x, this.tile.y, dir);
    tiles[dir] = (tile ? tile.toDataHash() : null);
  });
  return {
    ownerId: this.owner.id,
    type: this.type,
    carrying: this.food > 0 ? "food" : null,
    carryingAmount: this.food,
    currentTile: {
      type: this.tile.type,
      food: this.food,
    },
    adjacentTiles: tiles,
    moves: this.moves,
  }
}

Ant.prototype.simpleDataHash = function() {
  return {
    ownerId: this.owner.id,
    type: this.type,
    carrying: this.food > 0 ? "food" : null,
    carryingAmount: this.food,
  }
}

export default Ant;
