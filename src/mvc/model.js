const Ship = (length) => {
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
  const placeShip = (ship, [x, y]) => {
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
  const receiveAttack = ([x, y]) => {
    const target = board[y][x];
    if (target.ship) {
      target.ship.hit(target.position);
    }
    target.hasBeenHit = true;
  };
  return { board, placeShip, receiveAttack };
};

export { Ship, Gameboard };
