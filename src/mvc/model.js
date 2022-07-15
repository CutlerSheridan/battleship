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
  const board = [];
  for (let i = 0; i < 10; i++) {
    board.push([]);
    for (let n = 0; n < 10; n++) {
      board[i].push({ hasBeenHit: false });
    }
  }
  const placeShip = (ship, [y, x]) => {
    let row = y;
    let col = x;
    for (let i = 0; i < ship.length; i++) {
      if (ship.isHorizontal) {
        col = x + i;
      } else {
        row = y + i;
      }
      board[row][col] = { ship, position: i, hasBeenHit: false };
    }
  };
  const receiveAttack = ([y, x]) => {
    const target = board[y][x];
    if (target.ship) {
      target.ship.hit(target.position);
    }
    target.hasBeenHit = true;
  };
  const allShipsAreSunk = () => {
    const ships = [];
    board.forEach((row) => {
      row.forEach((item) => {
        if (item.position === 0) {
          ships.push(item.ship);
        }
      });
    });
    return ships.every((ship) => ship.isSunk());
  };
  return {
    board,
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
  const attack = (enemyBoard, [y, x]) => {
    enemyBoard.receiveAttack([y, x]);
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
