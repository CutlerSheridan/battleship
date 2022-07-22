/* eslint-disable no-use-before-define */
const placeAllShips = (player) => {
  player.ships.forEach((ship) => {
    assignShipOrientation(ship);
    randomlyPlaceShip(player, ship);
  });
};
const randomlyPlaceShip = (player, ship) => {
  let coords = getRandomCoordinates();
  while (!areSpacesAvailableForShip(player, ship, ...coords)) {
    coords = getRandomCoordinates();
  }
  player.gameboard.placeShip(ship, ...coords);
};
const assignShipOrientation = (ship) => {
  const direction = Math.floor(Math.random() * 2);
  if (direction === 0) {
    ship.turnShip();
  }
};
const getRandomCoordinates = () => {
  const y = Math.floor(Math.random() * 10);
  const x = Math.floor(Math.random() * 10);
  return [y, x];
};
const areSpacesAvailableForShip = (player, ship, y, x) => {
  let row = y;
  let col = x;
  const { grid } = player.gameboard;
  for (let i = 0; i < ship.length; i++) {
    if (ship.isHorizontal) {
      col = x + i;
    } else {
      row = y + i;
    }
    if (col >= grid.length || row >= grid[0].length) {
      return false;
    }
    if (grid[row][col].ship) {
      return false;
    }
  }
  return true;
};
const pickComputerMove = (enemy) => {
  const row = Math.floor(Math.random() * enemy.gameboard.grid.length);
  const col = Math.floor(Math.random() * enemy.gameboard.grid.length);
  if (enemy.gameboard.grid[row][col].hasBeenHit) {
    return pickComputerMove(enemy);
  }
  return [row, col];
};
export {
  placeAllShips,
  randomlyPlaceShip,
  getRandomCoordinates,
  areSpacesAvailableForShip,
  pickComputerMove,
};
