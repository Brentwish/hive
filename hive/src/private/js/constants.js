export const dirs = ["left", "right", "up", "down"];
export const UPDATE_PERIOD = 42;
export const MAX_FOOD = 5;
export const MAX_TRAIL = 1000;
export const NEW_ANT_COST = 25;
export const NEW_QUEEN_COST = 500;
export const EGG_TIMER = 100;
export const ANT_ATTACK_POWER = 10;
export const ANT_HEALTH = 100;
export const QUEEN_HEALTH = 500;
export const MIN_BOARD_WIDTH = 20;
export const MAX_BOARD_WIDTH = 800;
export const MIN_BOARD_HEIGHT = 20;
export const MAX_BOARD_HEIGHT = 600;
export const MIN_NUM_PLAYERS = 1;
export const MAX_NUM_PLAYERS = 10;
export const STARTING_FOOD = 35;
export const MAX_TRAIL_CHANNELS = 16;
export const tileColors = {
  "empty": "#E4AF77",
  "wall": "#424949",
  "food": "#2ECC71",
  "water": "#5DADE2",
};

export const antColors = {
  "queen": "#7D6608",
  "worker": "#0B5345",
  "scout": "#424949",
  "fighter": "#C0392B",
  "egg": "#E8E5E1",
};

export const playerColors = [
  '#B80000',
  '#DB3E00',
  '#FCCB00',
  '#008B02',
  '#006B76',
  '#1273DE',
  '#004DCF',
  '#5300EB',
  '#EB9694',
  '#FAD0C3',
  '#FEF3BD',
  '#C1E1C5',
  '#BEDADC',
  '#C4DEF6',
  '#BED3F3',
  '#D4C4FB'
]

export const foodGrades = {
  "very high": 1,
  "high": 0.8,
  "medium": 0.6,
  "low": 0.4,
  "very low": 0.2,
  "none": 0,
}

export const keysToTitles = {
  antCounts: "Ants",
  numQueens: "Queens",
  numWorkers: "Workers",
  combatCounts: "Combat",
  numDead: "Dead",
  numKilled: "Killed",
  foodCounts: "Food",
  totalFood: "Total",
  currentFood: "Current",
  identifiers: "Player",
  name: "Name",
  id: "ID",
  color: "Color",
};

export const listOfNames = [
  "Bob Jenkins", "LeeRoy Jenkins",
  "Cassy Jenkins", "Alexander Jenkins",
  "Flarfalarf Jenkins", "And sometimes 'Y' Jenkins",
  "BoJack Jenkins", "Tubby Jenkins",
  "PhoLin Jenkins", "Tarloc Jenkins"
];

export const graphTypes = ["TotalAnts", "DeadAnts", "AntsKilled", "TotalFood"];

export const LintOptions = {
  esversion: 6,
  undef: true,
  debug: true,
  devel: true,
};

export const LintGlobals = {
  "_": false,
  "constants": false,
  "Math": false,
};

export function randomInt(upper = 1, lower = 0) {
  return Math.floor(Math.random() * upper + lower);
}

export function distance(p1, p2) {
  return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}

export function findKey(hash, value) {
  return Object.keys(hash).find((key) => { return hash[key] === value; });
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const defaultPlayerFunction = `return (antData) => {
  return {
    type: "move",
    direction: _.sample(["up", "right"]),
  };
}`;

export default {
  randomInt,
  distance,
  findKey,
  dirs,
  UPDATE_PERIOD,
  MAX_FOOD,
  MAX_TRAIL,
  NEW_ANT_COST,
  NEW_QUEEN_COST,
  EGG_TIMER,
  ANT_ATTACK_POWER,
  ANT_HEALTH,
  QUEEN_HEALTH,
  MIN_BOARD_WIDTH,
  MAX_BOARD_WIDTH,
  MIN_BOARD_HEIGHT,
  MAX_BOARD_HEIGHT,
  MIN_NUM_PLAYERS,
  MAX_NUM_PLAYERS,
};
