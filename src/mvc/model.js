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
  const heldPos = null;
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
    heldPos,
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
    const heldPos = ship.heldPos ? ship.heldPos : 1;
    const spacesBefore = heldPos - 1;
    const spacesAfter = ship.length - heldPos;
    let counter = 0;
    for (let i = spacesBefore; i >= -1 * spacesAfter; i--) {
      const newCoord = (ship.isHorizontal ? x : y) - i;
      const row = ship.isHorizontal ? y : newCoord;
      const col = ship.isHorizontal ? newCoord : x;
      grid[row][col] = { ship, position: counter++, hasBeenHit: false };
      ship.coordinates.push({ row, col });
    }
    ship.heldPos = null;
  };
  const removeShip = (ship) => {
    for (let i = 0; i < ship.coordinates.length; i++) {
      grid[ship.coordinates[i].row][ship.coordinates[i].col] = { hasBeenHit: false };
    }
    ship.coordinates.splice(0);
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
    removeShip,
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
  let turnNum = 0;
  const incrementTurn = () => {
    turnNum++;
  };
  const ships = [
    Ship(5, 'Aircraft Carrier'),
    Ship(4, 'Battleship'),
    Ship(3, 'Cruiser'),
    Ship(3, 'Submarine'),
    Ship(2, 'Destroyer'),
  ];
  const removeAllShipsFromBoard = () => {
    ships.forEach((ship) => gameboard.removeShip(ship));
  };
  const hitMoves = [];
  const moves = [];
  const attack = (enemy, y, x) => {
    const enemyBoard = enemy.gameboard;
    enemyBoard.receiveAttack(y, x);
    if (enemyBoard.grid[y][x].ship) {
      hitMoves.push({ row: y, col: x });
    }
    moves.push({ row: y, col: x });
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
    get turnNum() {
      return turnNum;
    },
    incrementTurn,
    ships,
    removeAllShipsFromBoard,
    attack,
    hitMoves,
    moves,
  };
};

export { Ship, Gameboard, Player };
