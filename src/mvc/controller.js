/* eslint-disable no-use-before-define */
const placeAllShips = (player) => {
  player.ships.forEach((ship) => {
    if (player.isHuman) {
      neatlyPlaceShip(player, ship);
    } else {
      assignShipOrientation(ship);
      randomlyPlaceShip(player, ship);
    }
  });
};
const neatlyPlaceShip = (player, ship) => {
  for (let i = 0; i < player.ships.length; i++) {
    if (!player.gameboard.grid[i][0].ship) {
      player.gameboard.placeShip(ship, i, 0);
      break;
    }
  }
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
  const { grid } = player.gameboard;
  const potentialShipCoords = getPotentialShipCoords(ship, y, x);
  const changingAxis = ship.isHorizontal ? 'col' : 'row';
  for (let i = 0; i < potentialShipCoords.length; i++) {
    const coord = potentialShipCoords[i];
    if (coord[changingAxis] < 0 || coord[changingAxis] >= grid.length) {
      return false;
    }
    if (grid[coord.row][coord.col].ship) {
      return false;
    }
  }
  return true;
};
const getPotentialShipCoords = (ship, y, x) => {
  const heldPos = ship.heldPos ? ship.heldPos : 1;
  const spacesBefore = heldPos - 1;
  const spacesAfter = ship.length - heldPos;
  const potentialShipSpaces = [];
  for (let i = spacesBefore; i >= -1 * spacesAfter; i--) {
    const newCoord = (ship.isHorizontal ? x : y) - i;
    const row = ship.isHorizontal ? y : newCoord;
    const col = ship.isHorizontal ? newCoord : x;
    potentialShipSpaces.push({ row, col });
  }
  return potentialShipSpaces;
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

  let shift = [0, 0];
  for (let i = 0; i < 2; i++) {
    for (let n = 0; n < 2; n++) {
      if (i === n) {
        continue;
      }
      if (n === 1) {
        if (!canShipBeDirection(enemy, 'horizontal', ...originalHitCoords, player)) {
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
  if (canShipBeDirection(enemy, 'horizontal', y, x)) {
    return true;
  }
  return canShipBeDirection(enemy, 'vertical', y, x);
};
const canShipBeDirection = (enemy, direction, y, x, player) => {
  const { grid } = enemy.gameboard;
  const unsunkShips = enemy.ships.filter((ship) => !ship.isSunk());
  const shortestUnsunkShip = unsunkShips.reduce((prev, current) =>
    prev.length < current.length ? prev : current
  );
  let minWidth = shortestUnsunkShip.length;
  let firstUnsunkHitLoc;
  let firstHitShip;
  if (player) {
    const playerMoves = player.hitMoves;
    firstUnsunkHitLoc = playerMoves.findIndex((move) => !grid[move.row][move.col].ship.isSunk());
    if (firstUnsunkHitLoc !== -1) {
      firstHitShip =
        grid[playerMoves[firstUnsunkHitLoc].row][playerMoves[firstUnsunkHitLoc].col].ship;
    }
    minWidth = firstHitShip.length;
  } else {
    firstUnsunkHitLoc = -1;
  }
  const checkingHorizontal = direction === 'horizontal';
  let spaceCounter = 1;
  let increment = 1;
  let changingCoord = checkingHorizontal ? x : y;
  while (true) {
    changingCoord += increment;
    const space =
      changingCoord >= 0 && changingCoord < grid.length
        ? grid[checkingHorizontal ? y : changingCoord][checkingHorizontal ? changingCoord : x]
        : undefined;
    if (
      !space ||
      changingCoord < 0 ||
      changingCoord > grid.length ||
      (space.hasBeenHit &&
        (firstUnsunkHitLoc === -1 || (firstUnsunkHitLoc !== -1 && space.ship !== firstHitShip)))
    ) {
      if (increment > 0) {
        changingCoord = checkingHorizontal ? x : y;
        increment *= -1;
        continue;
      }
      break;
    } else if (space.hasBeenHit && firstUnsunkHitLoc !== -1 && space.ship === firstHitShip) {
      return true;
    } else if (!space.hasBeenHit) {
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
  getPotentialShipCoords,
  pickComputerMove,
  isGuessPossible,
  canShipBeDirection,
};
