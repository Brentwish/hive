import Board from "./Board.js";
import Player from "./Player.js";
import Ant from "./Ant.js";
import playerGameActions from "./playerGameActions.js";
import { randomInt, playerColors, dirs } from "./constants.js";
import { MAX_FOOD, NEW_ANT_COST, NEW_QUEEN_COST, EGG_TIMER, MAX_TRAIL, ANT_ATTACK_POWER, ANT_HEALTH, QUEEN_HEALTH } from "./constants.js";
import _ from "lodash";

function HiveGame(props) {
  this.board = new Board(props.width, props.height);
  this.players = [];
  this.turn = 0;
  this.numPlayers = props.numPlayers;
  this.foodProps = props.foodProps;
}

HiveGame.prototype.init = function() {
  this.board.borderedBoard();
  this.board.addRandomFood(this.foodProps.sparsity, this.foodProps.density, this.foodProps.saturation);
  for (let i = 0; i < this.numPlayers; i++) {
    this.players.push(new Player({
      id: i + 1,
      color: playerColors[i],
      ants: [],
      board: this.board,
      playerGameActions: playerGameActions,
    }));
  }

  for (var i = 0; i < this.players.length; i++) {
    var queen = new Ant({
      id: 1,
      type: 'queen',
      owner: this.players[i],
      tile: this.board.getRandomVacantTile(),
      food: 35,
      eggTimer: 0,
    });
    this.players[i].ants.push(queen);
    queen.tile.ant = queen;
  }
  this.coordsToRender = new Set();
}

HiveGame.prototype.update = function() {
  this.turn += 1;
  this.updatePlayers();
  const trailsToRender = this.board.updateTrails();
  trailsToRender.forEach((tile) => {
    this.pushCoordToRender(tile.coords());
  });
}

HiveGame.prototype.pushCoordToRender = function(coord) {
  this.coordsToRender.add(JSON.stringify(coord));
}

HiveGame.prototype.getUpdatedTiles = function() {
  return [...this.coordsToRender].map((coordJson) => {
    const coord = JSON.parse(coordJson);
    return this.board.getTileFromCoords(coord);
  });
}

HiveGame.prototype.clearUpdatedTiles = function() {
  this.coordsToRender.clear();
}

HiveGame.prototype.updatePlayers = function() {
  for (var i = 0; i < this.players.length; i++) {
    const ants = this.players[i].ants;
    const actionFunction = this.players[i].antAction;
    for (var j = 0; j < ants.length; j++) {
      const ant = ants[j];
      if (ant.eggTimer === 0) {
        const action = actionFunction(ant.toDataHash());
        this.performAction(ant, action);
        ant.age += 1;
      } else {
        ant.eggTimer -= 1;
      }
    }
  }
}

HiveGame.prototype.isLegalAction = function(entity, action) {
  let targetTile;
  if (action.direction && dirs.includes(action.direction)) {
    targetTile = this.board.tileFromDirection(entity.tile.x, entity.tile.y, action.direction);
    if (!targetTile) return false;
  } else {
    return false;
  }
  switch (action.type) {
    case "move":
      let trailCond = true;
      if (action.trail) {
        trailCond = action.trail.name.length > 1 && _.isInteger(action.trail.strength);
      }
      let eggCond = true;
      if (action.layEgg) {
        eggCond = (
          entity.type === "queen" &&
          entity.food >= (action.layEgg === "queen" ? NEW_QUEEN_COST: NEW_ANT_COST)
        );
      }
      return targetTile.isVacant() && trailCond && eggCond;
    case "gather":
      return targetTile.isFood() && targetTile.food > 0 && entity.food < MAX_FOOD;
    case "transfer":
      return _.isInteger(action.amount) && targetTile.hasAnt() && entity.food >= action.amount;
    case "drop":
      return _.isInteger(action.amount) && entity.food >= action.amount;
    case "layEgg":
      return (
        targetTile.isVacant() &&
        entity.type === "queen" &&
        entity.food >= (action.antType === "queen" ? NEW_QUEEN_COST: NEW_ANT_COST)
      );
    case "attack":
      return targetTile.ant;
    default:
      return false;
  }
}

HiveGame.prototype.performAction = function(entity, action) {
  if (this.isLegalAction(entity, action)) {
    let targetTile;
    if (action.direction) {
      targetTile = this.board.tileFromDirection(entity.tile.x, entity.tile.y, action.direction);
    }
    switch (action.type) {
      case "move":
        if (action.trail) {
          this.layTrailOnTile(entity, action.trail.name, action.trail.strength);
        }
        const previousTile = entity.tile;
        this.move(entity, targetTile, action.direction, null);
        if (action.layEgg) {
          this.layEggOnTile(entity, previousTile, action.layEgg);
        }
        break;
      case "gather":
        targetTile.food -= 1;
        entity.food += 1;
        if (targetTile.food === 0) {
          targetTile.type = "empty";
          targetTile.food = null;
          this.pushCoordToRender(targetTile.coords());
        }
        break;
      case "transfer":
        const quantToTransfer = targetTile.ant.type === "queen" ? action.amount : Math.min(MAX_FOOD - targetTile.ant.food, action.amount);
        entity.food -= quantToTransfer;
        targetTile.ant.food += quantToTransfer;
        break;
      case "drop":
        const quantToDrop = Math.min(MAX_FOOD, action.amount);
        entity.food -= quantToDrop;
        targetTile.food += quantToDrop;
        if (targetTile.food > 0) {
          targetTile.type = "food";
        }
        this.pushCoordToRender(targetTile.coords());
        break;
      case "layEgg":
        this.layEggOnTile(entity, targetTile, action.antType);
        break;
      case "attack":
        targetTile.ant.health -= ANT_ATTACK_POWER;
        if (targetTile.ant.health <= 0) {
          targetTile.ant.owner.ants.splice(_.indexOf(targetTile.ant.owner.ants, targetTile.ant), 1);
          delete targetTile.ant;
          this.pushCoordToRender(targetTile.coords());
        }
        break;
    }
    if (action.resetMoves) {
      entity.moves = {
        left: 0,
        right: 0,
        up: 0,
        down: 0,
      };
    }
  }
}

HiveGame.prototype.layTrailOnTile = function(entity, name, qty) {
  const trails = entity.tile.trails || {};
  const trailName = `${entity.owner.id}_${name}`;
  if (_.isEmpty(trails)) {
    this.board.pushNewTrailCoord(entity.tile);
  }
  const trail = trails[trailName];
  if (!trail) {
    trails[trailName] = 0;
  }
  trails[trailName] += qty;
  trails[trailName] = Math.min(trails[trailName], MAX_TRAIL);
  entity.tile.trails = trails;
}

HiveGame.prototype.layEggOnTile = function(entity, tile, type) {
  const antType = (type === "queen" ? "queen" : "worker");
  const newAnt = new Ant({
    id: entity.owner.ants.length + 1,
    type: antType,
    owner: entity.owner,
    tile: tile,
    eggTimer: EGG_TIMER,
    food: 0,
  });
  entity.owner.ants.push(newAnt);
  entity.food -= (antType === "queen" ? NEW_QUEEN_COST : NEW_ANT_COST);
  tile.ant = newAnt;
  entity.eggsLaid[antType] += 1;
  this.pushCoordToRender(tile.coords());
}

HiveGame.prototype.move = function(entity, targetTile, direction, lay) {
  this.pushCoordToRender(entity.tile.coords());
  entity.moves[direction] += 1;
  entity.tile.ant = lay; //lay is either null or a new worker
  targetTile.ant = entity;
  entity.tile = targetTile;
  this.pushCoordToRender(targetTile.coords());
}

export default HiveGame;
