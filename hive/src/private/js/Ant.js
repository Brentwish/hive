import { dirs } from "./constants.js";
import { ANT_HEALTH, QUEEN_HEALTH } from "./constants.js";
import _ from "lodash";

function Ant(props) {
  this.id = props.id;
  this.type = props.type;
  this.owner = props.owner;
  this.tile = props.tile;
  this.food = props.food || (this.type === "queen" ? 25 : 0);
  this.eggTimer = props.eggTimer;
  this.age = 0;
  this.moves = {
    left: 0,
    right: 0,
    up: 0,
    down: 0,
  },
  this.health = this.type == "queen" ? QUEEN_HEALTH : ANT_HEALTH;
  if (this.type === "queen") {
    this.eggsLaid = {
      worker: 0,
      queen: 0,
    }
  }
}

Ant.prototype.toDataHash = function() {
  const tiles = {};
  const adjacentTiles = this.owner.board.adjacentTiles(this.tile);
  dirs.forEach((dir) => {
    const tile = this.owner.board.tileFromDirection(this.tile.x, this.tile.y, dir);
    tiles[dir] = (tile ? tile.toDataHash() : null);
  });
  const hash = {
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
    age: this.age,

  };
  if (this.type === "queen") {
    hash.eggsLaid = _.clone(this.eggsLaid);
  }
  return hash;
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
