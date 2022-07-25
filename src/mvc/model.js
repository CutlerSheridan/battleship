/* eslint-disable no-plusplus */
const Ship = (length, name = 'unnamed') => {
  let isHorizontal = true;
  const turnShip = () => {
    isHorizontal = !isHorizontal;
  };
  const hitSpaces = [];
  for (let i = 0; i < length; i++) {
    hitSpaces.push(false);
  }
  const coordinates = [];
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
    get isHorizontal() {
      return isHorizontal;
    },
    turnShip,
    length,
    name,
    coordinates,
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
      ship.coordinates.push({ row, col });
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
  let currentTurn = false;
  const changeTurn = () => {
    currentTurn = !currentTurn;
  };
  const ships = [
    Ship(5, 'Aircraft Carrier'),
    Ship(4, 'Battleship'),
    Ship(3, 'Cruiser'),
    Ship(3, 'Submarine'),
    Ship(2, 'Destroyer'),
  ];
  const attack = (enemy, y, x) => {
    const enemyBoard = enemy.gameboard;
    enemyBoard.receiveAttack(y, x);
  };

  return {
    gameboard,
    name,
    togglePlayerController,
    get isHuman() {
      return isHuman;
    },
    changeTurn,
    get currentTurn() {
      return currentTurn;
    },
    ships,
    attack,
  };
};

export { Ship, Gameboard, Player };
