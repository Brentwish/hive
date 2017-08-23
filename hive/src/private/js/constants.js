export const dirs = ["left", "right", "up", "down"];
export const MAXFOOD = 5;
export const tileColors = {
  "empty": "#F6DDCC",
  "wall": "#424949",
  "food": "#2ECC71",
  "water": "#5DADE2"
};

export const antColors = {
  "queen": "#7D6608",
  "worker": "#0B5345",
  "scout": "#424949",
  "fighter": "#C0392B"
};

export function randomInt(upper = 1, lower = 0) {
  return Math.floor(Math.random() * upper + lower);
}

export function distance(p1, p2) {
  return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
}
