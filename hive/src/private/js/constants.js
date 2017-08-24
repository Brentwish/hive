export const dirs = ["left", "right", "up", "down"];
export const UPDATE_PERIOD = 42;
export const MAX_FOOD = 5;
export const NEW_ANT_COST = 25;
export const EGG_TIMER = 100;
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
  "red",
  "blue",
  "yellow",
  "black",
  "purple",
];

export function randomInt(upper = 1, lower = 0) {
  return Math.floor(Math.random() * upper + lower);
}

export function distance(p1, p2) {
  return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}
