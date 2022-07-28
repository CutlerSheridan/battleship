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
  let shift = [0, 0];
  for (let i = 0; i < 2; i++) {
    for (let n = 0; n < 2; n++) {
      if (i === n) {
        continue;
      }
      shift[0] = i;
      shift[1] = n;
      let checkBackwards = false;
      while (true) {
        const newMove = [moves[firstUnsunkHitLoc].row, moves[firstUnsunkHitLoc].col];
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
        if (
          !space ||
          (space.hasBeenHit &&
            space.ship !== grid[moves[firstUnsunkHitLoc].row][moves[firstUnsunkHitLoc].col].ship)
        ) {
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
  console.log(`ATTACKING ${enemy.name.toUpperCase()}
Attempted coord: [${y}, ${x}]
shortestUnsunkShip: ${shortestUnsunkShip.name}
grid.length: ${grid.length}
grid[0].length: ${grid[0].length}
`);
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
          //           console.log(`shift: [${shift[0]}, ${shift[1]}]
          // current space: [${move[0]}, ${move[1]}]
          // nextRow: ${nextRow}
          // nextCol: ${nextCol}
          // `);
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
              // console.log(`moving to space: [${move[0]}, ${move[1]}]
              // adjacentSpaceCounter: ${adjacentSpaceCounter}`);
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
export {
  placeAllShips,
  randomlyPlaceShip,
  getRandomCoordinates,
  areSpacesAvailableForShip,
  pickComputerMove,
  isGuessPossible,
};
