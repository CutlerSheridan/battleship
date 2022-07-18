/* eslint-disable no-plusplus */
const Ship = (length, shipName = 'unnamed') => {
  const isHorizontal = true;
  const hitSpaces = [];
  for (let i = 0; i < length; i++) {
    hitSpaces.push(false);
  }
  const hit = (position) => {
    hitSpaces[position] = true;
  };
  const isSunk = () => {
    if (hitSpaces.indexOf(false) === -1) {
      return true;
    }
    return false;
  };
  return {
    isHorizontal,
    length,
    shipName,
    hitSpaces,
    hit,
    isSunk,
  };
};

const Gameboard = () => {
  const grid = [];
  for (let i = 0; i < 10; i++) {
    grid.push([]);
    for (let n = 0; n < 10; n++) {
      grid[i].push({ hasBeenHit: false });
    }
  }
  const placeShip = (ship, y, x) => {
    let row = y;
    let col = x;
    for (let i = 0; i < ship.length; i++) {
      if (ship.isHorizontal) {
        col = x + i;
      } else {
        row = y + i;
      }
      grid[row][col] = { ship, position: i, hasBeenHit: false };
    }
  };
  const receiveAttack = (y, x) => {
    const target = grid[y][x];
    if (target.ship) {
      target.ship.hit(target.position);
    }
    target.hasBeenHit = true;
  };
  const allShipsAreSunk = () => {
    const ships = [];
    grid.forEach((row) => {
      row.forEach((space) => {
        if (space.position === 0) {
          ships.push(space.ship);
        }
      });
    });
    return ships.every((ship) => ship.isSunk());
  };
  return {
    grid,
    placeShip,
    receiveAttack,
    allShipsAreSunk,
  };
};
const Player = (name) => {
  const gameboard = Gameboard();
  let isHuman = true;
  const togglePlayerController = () => {
    isHuman = !isHuman;
  };
  const ships = [
    Ship(5, 'aircraft carrier'),
    Ship(4, 'battleship'),
    Ship(3, 'cruiser'),
    Ship(3, 'submarine'),
    Ship(2, 'destroyer'),
  ];
  const pickComputerSpace = (enemyGrid) => {
    const y = Math.floor(Math.random() * 10);
    const x = Math.floor(Math.random() * 10);
    if (enemyGrid[y][x].hasBeenHit) {
      return pickComputerSpace(enemyGrid);
    }
    return [y, x];
  };
  const attack = (enemy, y, x) => {
    const enemyBoard = enemy.gameboard;
    if (isHuman) {
      enemyBoard.receiveAttack(y, x);
    } else {
      enemyBoard.receiveAttack(...pickComputerSpace(enemyBoard.grid));
    }
  };

  return {
    gameboard,
    name,
    togglePlayerController,
    get isHuman() {
      return isHuman;
    },
    ships,
    attack,
  };
};

export { Ship, Gameboard, Player };
