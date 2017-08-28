import { dirs } from "./constants.js";
import { ANT_HEALTH, QUEEN_HEALTH } from "./constants.js";

function Ant(props) {
  this.id = props.id;
  this.type = props.type;
  this.owner = props.owner;
  this.tile = props.tile;
  this.food = this.type == "queen" ? 25 : 0;
  this.eggTimer = props.eggTimer;
  this.moves = {
    left: 0,
    right: 0,
    up: 0,
    down: 0,
  },
  this.health = this.type == "queen" ? QUEEN_HEALTH : ANT_HEALTH;
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
    health: this.health,
  }
}

Ant.prototype.simpleDataHash = function() {
  return {
    ownerId: this.owner.id,
    type: this.type,
    carrying: this.food > 0 ? "food" : null,
    carryingAmount: this.food,
    health: this.health,
  }
}

export default Ant;
