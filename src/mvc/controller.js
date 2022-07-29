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
const pickComputerMove = (player, enemy) => {
  const { grid } = enemy.gameboard;
  const moves = player.hitMoves;
  const firstUnsunkHitLoc = moves.findIndex((move) => !grid[move.row][move.col].ship.isSunk());
  if (firstUnsunkHitLoc === -1) {
    const row = Math.floor(Math.random() * grid.length);
    const col = Math.floor(Math.random() * grid.length);
    if (grid[row][col].hasBeenHit) {
      return pickComputerMove(player, enemy);
    }
    if (isGuessPossible(enemy, row, col)) {
      return [row, col];
    }
    return pickComputerMove(player, enemy);
  }
  const originalHitCoords = [moves[firstUnsunkHitLoc].row, moves[firstUnsunkHitLoc].col];
  const hitShip = grid[moves[firstUnsunkHitLoc].row][moves[firstUnsunkHitLoc].col].ship;
  const numOfHits = hitShip.hitSpaces.reduce((prev, current) => {
    if (current) {
      prev++;
    }
    return prev;
  }, 0);
  console.log(`numOfHits: ${numOfHits}`);

  let shift = [0, 0];
  for (let i = 0; i < 2; i++) {
    for (let n = 0; n < 2; n++) {
      if (i === n) {
        continue;
      }
      if (n === 1) {
        if (numOfHits === 1 && !canShipBeHorizontal(enemy, hitShip, ...originalHitCoords)) {
          continue;
        }
      }
      shift[0] = i;
      shift[1] = n;
      let checkBackwards = false;
      while (true) {
        const newMove = [...originalHitCoords];
        if (checkBackwards) {
          newMove[0] -= shift[0];
          newMove[1] -= shift[1];
        } else {
          newMove[0] += shift[0];
          newMove[1] += shift[1];
        }
        const space =
          newMove[0] < grid.length && newMove[1] < grid[0].length
            ? grid[newMove[0]][newMove[1]]
            : undefined;
        if (space && !space.hasBeenHit) {
          return newMove;
        }
        if (!space || (space.hasBeenHit && space.ship !== hitShip)) {
          if (checkBackwards) {
            break;
          }
          checkBackwards = true;
          shift[0] = i;
          shift[1] = n;
          continue;
        }
        shift = shift.map((num) => (num === 0 ? num + 0 : num + 1));
      }
    }
  }
};
const isGuessPossible = (enemy, y, x) => {
  const { grid } = enemy.gameboard;
  const unsunkShips = enemy.ships.filter((ship) => !ship.isSunk());
  const shortestUnsunkShip = unsunkShips.reduce((prev, current) =>
    prev.length < current.length ? prev : current
  );
  for (let i = 0; i < 2; i++) {
    for (let n = 0; n < 2; n++) {
      if (i === n) {
        continue;
      }
      let adjacentSpaceCounter = 0;
      let shift = [0 - i, 0 - n];
      const move = [y, x];
      let nextSpace;
      for (let t = 0; t < 2; t++) {
        if (t === 1) {
          shift = shift.map((num) => num * -1);
        }
        do {
          const nextRow = move[0] + shift[0];
          const nextCol = move[1] + shift[1];
          if (nextRow >= 0 && nextRow < grid.length && nextCol >= 0 && nextCol < grid[0].length) {
            nextSpace = grid[nextRow][nextCol];
          } else {
            nextSpace = undefined;
          }
          if (nextRow < grid.length && nextCol < grid[0].length) {
            move[0] += shift[0];
            move[1] += shift[1];
            if (shift[0] + shift[1] > 0 && !nextSpace.hasBeenHit) {
              adjacentSpaceCounter++;
            }
          }
        } while (nextSpace && !nextSpace.hasBeenHit);
        if (adjacentSpaceCounter >= shortestUnsunkShip.length) {
          return true;
        }
      }
    }
  }
  return false;
};
const canShipBeHorizontal = (enemy, hitShip, y, x) => {
  const { grid } = enemy.gameboard;
  const unsunkShips = enemy.ships.filter((ship) => !ship.isSunk());
  const shortestUnsunkShip = unsunkShips.reduce((prev, current) =>
    prev.length < current.length ? prev : current
  );
  const minWidth = shortestUnsunkShip.length;
  let spaceCounter = 1;
  let increment = 1;
  const row = y;
  let col = x;
  while (true) {
    col += increment;
    const space =
      row >= 0 && col >= 0 && row < grid.length && col < grid[0].length
        ? grid[row][col]
        : undefined;
    if (!space || col < 0 || col > grid[0].length || (space.hasBeenHit && space.ship !== hitShip)) {
      if (increment > 0) {
        col = x;
        increment *= -1;
        continue;
      }
      break;
    } else if (space.hasBeenHit && space.ship === hitShip) {
      return true;
    } else if (!grid[row][col].hasBeenHit) {
      spaceCounter++;
    }
  }
  return spaceCounter >= minWidth;
};
export {
  placeAllShips,
  randomlyPlaceShip,
  getRandomCoordinates,
  areSpacesAvailableForShip,
  pickComputerMove,
  isGuessPossible,
  canShipBeHorizontal,
};
