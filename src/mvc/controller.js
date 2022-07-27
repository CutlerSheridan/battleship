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
const pickComputerMove = (pastMoves, enemy, player) => {
  const { grid } = enemy.gameboard;
  let lastMoveLoc;
  let lastTarget;
  if (pastMoves.length > 0) {
    lastMoveLoc = pastMoves.length - 1;
    lastTarget = grid[pastMoves[lastMoveLoc].row][pastMoves[lastMoveLoc].col];
  }
  let targetBeforeLast;
  if (pastMoves.length > 1) {
    targetBeforeLast = grid[pastMoves[lastMoveLoc - 1].row][pastMoves[lastMoveLoc - 1].col];
  }
  if (!lastTarget || !lastTarget.ship || lastTarget.ship.isSunk()) {
    if (!targetBeforeLast || !targetBeforeLast.ship || targetBeforeLast.ship.isSunk()) {
      if (player) {
        if (player.savedMove.length > 0) {
          // const savedMoveLoc = pastMoves.findIndex(
          //   (move) => move.row === player.savedMove[0].row && move.col === player.savedMove[0].col
          // );
          // player.savedMove.splice(0);
          // const movesUpToSavedMove = Array.from(pastMoves);
          // movesUpToSavedMove.splice(savedMoveLoc + 1);
          player.moves.push(player.savedMove[0]);
          player.savedMove.splice(0);
          return pickComputerMove(player.moves, enemy);
        }
      }
      const row = Math.floor(Math.random() * grid.length);
      const col = Math.floor(Math.random() * grid.length);
      if (grid[row][col].hasBeenHit) {
        return pickComputerMove(pastMoves, enemy);
      }
      return [row, col];
    }
  }

  if (!targetBeforeLast || !targetBeforeLast.ship || targetBeforeLast.ship.isSunk()) {
    const { row, col } = pastMoves[lastMoveLoc];
    for (let i = 0; i < 2; i++) {
      for (let n = 0; n < 2; n++) {
        if (i === n) {
          continue;
        }
        if (grid[row + i][col + n] && !grid[row + i][col + n].hasBeenHit) {
          return [row + i, col + n];
        }
        if (grid[row - i][col - n] && !grid[row - i][col - n].hasBeenHit) {
          return [row - i, col - n];
        }
      }
    }
  } else if (targetBeforeLast.ship === lastTarget.ship) {
    let { row, col } = pastMoves[lastMoveLoc];
    let shift = findDirectionalIncrement(pastMoves);
    row += shift[0];
    col += shift[1];
    if (grid[row][col] && !grid[row][col].hasBeenHit) {
      return [row, col];
    }
    shift = shift.map((num) => num * -1);
    do {
      row += shift[0];
      col += shift[1];
    } while (!grid[row][col] || grid[row][col].hasBeenHit);
    return [row, col];
  } else if (lastTarget.ship && targetBeforeLast.ship !== lastTarget.ship) {
    player.savedMove.push({ row: pastMoves[lastMoveLoc].row, col: pastMoves[lastMoveLoc].col });
    const movesArrayWithoutLastMove = pastMoves.filter((move, ind) => ind !== lastMoveLoc);
    return pickComputerMove(movesArrayWithoutLastMove, enemy, player);
  } else {
    // const movesArrayWithoutLastMove = pastMoves.filter((move, ind) => ind !== lastMoveLoc);
    // return pickComputerMove(movesArrayWithoutLastMove, enemy, player);
    player.moves.push({ row: pastMoves[lastMoveLoc - 1].row, col: pastMoves[lastMoveLoc - 1].col });
    return pickComputerMove(player.moves, enemy, player);
  }
};
const findDirectionalIncrement = (pastMoves) => {
  const lastMove = pastMoves[pastMoves.length - 1];
  const moveBeforeLast = pastMoves[pastMoves.length - 2];
  return [lastMove.row - moveBeforeLast.row, lastMove.col - moveBeforeLast.col];
};
export {
  placeAllShips,
  randomlyPlaceShip,
  getRandomCoordinates,
  areSpacesAvailableForShip,
  pickComputerMove,
  findDirectionalIncrement,
};
