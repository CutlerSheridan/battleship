/* eslint-disable no-undef */

import * as controller from '../mvc/controller';
import * as model from '../mvc/model';

test('getRandomCoordinates() returns coordinates array', () => {
  const coords = controller.getRandomCoordinates();
  expect(Array.isArray(coords)).toBe(true);
});

test('areSpacesAvail() returns true if specified spot is free and long enough', () => {
  const p1 = model.Player('p1');
  expect(controller.areSpacesAvailableForShip(p1, p1.ships[0], 2, 2)).toBe(true);
});
test('areSpacesAvail() returns false if specified spot is taken', () => {
  const p1 = model.Player('p1');
  p1.gameboard.placeShip(p1.ships[0], 2, 2);
  expect(controller.areSpacesAvailableForShip(p1, p1.ships[0], 2, 2)).toBe(false);
});
test('areSpacesAvail() returns false if farthest needed spot is taken', () => {
  const p1 = model.Player('p1');
  p1.gameboard.placeShip(p1.ships[0], 5, 5);
  expect(controller.areSpacesAvailableForShip(p1, p1.ships[0], 5, 1)).toBe(false);
});
test('areSpacesAvail() returns false if ship would go beyond grid horizontally', () => {
  const p1 = model.Player('p1');
  expect(controller.areSpacesAvailableForShip(p1, p1.ships[0], 8, 8)).toBe(false);
});
test('areSpacesAvail() returns false if ship would go beyond grid vertically', () => {
  const p1 = model.Player('p1');
  p1.ships[0].turnShip();
  expect(controller.areSpacesAvailableForShip(p1, p1.ships[0], 8, 8)).toBe(false);
});

test('randomlyPlaceShip() places a ship', () => {
  const p1 = model.Player('p1');
  controller.randomlyPlaceShip(p1, p1.ships[0]);
  const positionNums = [0, 1, 2, 3, 4];
  expect(
    positionNums.every((num) =>
      p1.gameboard.grid.some((row) => row.some((space) => space.position === num))
    )
  ).toBe(true);
});

test('pickComputerMove() returns coordinate array', () => {
  const p1 = model.Player('p1');
  const enemy = model.Player('enemy');
  const coords = controller.pickComputerMove(p1, enemy);
  expect(coords.length).toBe(2);
  expect(Array.isArray(coords)).toBe(true);
});
test('pickComputerMove() only returns unused coordinates', () => {
  const p1 = model.Player('p1');
  const enemy = model.Player('enemy');
  for (let i = 0; i < enemy.gameboard.grid.length; i++) {
    for (let n = 0; n < enemy.gameboard.grid.length; n++) {
      if (i > 1 || n !== 0) {
        enemy.gameboard.receiveAttack(i, n);
      }
    }
  }
  const coords = controller.pickComputerMove(p1, enemy);
  expect(coords[0]).toBeLessThan(2);
  expect(coords[1]).toBeLessThan(1);
});
test('pickComputerMove() returns space with on previous move', () => {
  const p1 = model.Player('p1');
  const enemy = model.Player('enemy');
  p1.attack(enemy, 3, 4);
  const coords = controller.pickComputerMove(p1, enemy);
  expect(coords.length).toBe(2);
  expect(Array.isArray(coords)).toBe(true);
});
test('pickComputerMove() picks space if only one move and hit left-most part of ship', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 2];
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p1.attack(p2, ...coords);
  expect(controller.pickComputerMove(p1, p2)).toEqual([2, 3]);
});
test('pickComputerMove() picks space if only one move and hit right-most part of ship', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 2];
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p1.attack(p2, 2, 6);
  expect(controller.pickComputerMove(p1, p2)).toEqual([2, 7]);
});
test('pickComputerMove() picks space if two moves but only last space hit', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 2];
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p1.attack(p2, 1, 1);
  p1.attack(p2, ...coords);
  expect(controller.pickComputerMove(p1, p2)).toEqual([2, 3]);
});
test('pickComputerMove() picks space if only last space hit and was right board edge', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 5];
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p1.attack(p2, 2, 9);
  expect(controller.pickComputerMove(p1, p2)).toEqual([2, 8]);
});
test('pickComputerMove() picks space if only last space hit and space to right has been tried', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 2];
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p1.attack(p2, 2, 7);
  p1.attack(p2, 2, 6);
  expect(controller.pickComputerMove(p1, p2)).toEqual([2, 5]);
});
test('pickComputerMove() picks space if only last space hit and spaces to right and left have been tried', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 2];
  p2.ships[0].turnShip();
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p1.attack(p2, 6, 3);
  p1.attack(p2, 6, 1);
  p1.attack(p2, 6, 2);
  expect(controller.pickComputerMove(p1, p2)).toEqual([7, 2]);
});
test('pickComputerMove() picks space if two spaces ago hit but last space missed', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 2];
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p1.attack(p2, 2, 6);
  p1.attack(p2, 2, 7);
  expect(controller.pickComputerMove(p1, p2)).toEqual([2, 5]);
});
test('pickComputerMove() picks space if three spaces ago hit but last space missed', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 2];
  p2.ships[0].turnShip();
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p1.attack(p2, 2, 2);
  p1.attack(p2, 2, 3);
  p1.attack(p2, 2, 1);
  expect(controller.pickComputerMove(p1, p2)).toEqual([3, 2]);
});
test('pickComputerMove() picks space if last two spaces have hit and right space exists untried', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 2];
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p1.attack(p2, 2, 4);
  p1.attack(p2, 2, 5);
  expect(controller.pickComputerMove(p1, p2)).toEqual([2, 6]);
});
test('pickComputerMove() picks space if last two spaces have hit and right space has been tried', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 2];
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p1.attack(p2, 2, 7);
  p1.attack(p2, 2, 6);
  expect(controller.pickComputerMove(p1, p2)).toEqual([2, 5]);
});
test('pickComputerMove() picks space if last two spaces have hit and right space does not exist', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 5];
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p1.attack(p2, 2, 8);
  p1.attack(p2, 2, 9);
  expect(controller.pickComputerMove(p1, p2)).toEqual([2, 7]);
});
test('pickComputerMove() picks space if last two spaces have hit and right space hit something else', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 1];
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p2.gameboard.placeShip(p2.ships[1], 2, 6);
  p1.attack(p2, 2, 4);
  p1.attack(p2, 2, 5);
  p1.attack(p2, 2, 6);
  expect(controller.pickComputerMove(p1, p2)).toEqual([2, 3]);
});
test('pickComputerMove() sinks first ship if last two spaces have hit and right space hit something else', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  p2.gameboard.placeShip(p2.ships[0], 2, 1);
  p2.gameboard.placeShip(p2.ships[1], 2, 6);
  p1.attack(p2, 2, 4);
  p1.attack(p2, 2, 5);
  p1.attack(p2, 2, 6);
  p1.attack(p2, ...controller.pickComputerMove(p1, p2));
  p1.attack(p2, ...controller.pickComputerMove(p1, p2));
  p1.attack(p2, ...controller.pickComputerMove(p1, p2));
  expect(p2.gameboard.grid[2][1].ship.isSunk()).toBe(true);
});
test('pickComputerMove() returns to second ship if just sank first ship', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  p2.gameboard.placeShip(p2.ships[0], 2, 1);
  p2.gameboard.placeShip(p2.ships[1], 2, 6);
  p1.attack(p2, 2, 4);
  p1.attack(p2, 2, 5);
  p1.attack(p2, 2, 6);
  p1.attack(p2, ...controller.pickComputerMove(p1, p2));
  p1.attack(p2, ...controller.pickComputerMove(p1, p2));
  p1.attack(p2, ...controller.pickComputerMove(p1, p2));
  expect(controller.pickComputerMove(p1, p2)).toEqual([2, 7]);
});
test('pickComputerMove() sinks second horizontal ship after sinking first ship', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  p2.gameboard.placeShip(p2.ships[0], 2, 1);
  p2.gameboard.placeShip(p2.ships[1], 2, 6);
  p1.attack(p2, 2, 4);
  p1.attack(p2, 2, 5);
  p1.attack(p2, 2, 6);
  const looper = p2.ships[0].length + p2.ships[1].length;
  for (let i = 0; i < looper; i++) {
    p1.attack(p2, ...controller.pickComputerMove(p1, p2));
  }
  expect(p2.gameboard.grid[2][6].ship.isSunk()).toBe(true);
});
test('pickComputerMove() sinks second vertical ship after sinking first horizontal ship', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  p2.gameboard.placeShip(p2.ships[0], 2, 2);
  p2.ships[1].turnShip();
  p2.gameboard.placeShip(p2.ships[1], 2, 7);
  p1.attack(p2, 2, 5);
  p1.attack(p2, 2, 6);
  p1.attack(p2, 2, 7);
  const looper = p2.ships[0].length + p2.ships[1].length;
  for (let i = 0; i < looper; i++) {
    p1.attack(p2, ...controller.pickComputerMove(p1, p2));
  }
  expect(p2.gameboard.grid[2][7].ship.isSunk()).toBe(true);
});
test('pickComputerMove() sinks first and second adjacent vertical ships starting in the middle', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  p2.ships[0].turnShip();
  p2.ships[1].turnShip();
  p2.gameboard.placeShip(p2.ships[0], 2, 2);
  p2.gameboard.placeShip(p2.ships[1], 2, 3);
  p1.attack(p2, 4, 2);
  const looper = p2.ships[0].length + p2.ships[1].length + 3;
  for (let i = 0; i < looper; i++) {
    p1.attack(p2, ...controller.pickComputerMove(p1, p2));
  }
  expect(p2.gameboard.grid[2][2].ship.isSunk()).toBe(true);
  expect(p2.gameboard.grid[2][3].ship.isSunk()).toBe(true);
});
test('pickComputerMove() sinks three adjacent ships after hitting middle', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  p2.ships[0].turnShip();
  p2.ships[1].turnShip();
  p2.gameboard.placeShip(p2.ships[0], 2, 2);
  p2.gameboard.placeShip(p2.ships[1], 2, 3);
  p2.gameboard.placeShip(p2.ships[4], 4, 0);
  p1.attack(p2, 4, 2);
  const looper = p2.ships[0].length + p2.ships[1].length + p2.ships[4].length + 2;
  for (let i = 0; i < looper; i++) {
    p1.attack(p2, ...controller.pickComputerMove(p1, p2));
  }
  expect(p2.gameboard.grid[2][2].ship.isSunk()).toBe(true);
  expect(p2.gameboard.grid[2][3].ship.isSunk()).toBe(true);
  expect(p2.gameboard.grid[4][0].ship.isSunk()).toBe(true);
});
test('pickComputerMove() skips trying horizontally if just hit and no room that way', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  p2.ships.splice(1);
  p2.ships[0].turnShip();
  p2.gameboard.placeShip(p2.ships[0], 2, 2);
  p1.attack(p2, 2, 1);
  p1.attack(p2, 2, 4);
  p1.attack(p2, 2, 2);
  expect(controller.pickComputerMove(p1, p2)).toEqual([3, 2]);
});

test('canShipBeHorizontal() checks if 5-space ship has room in 4 horizontal spaces', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  p2.ships.splice(1);
  p2.ships[0].turnShip();
  p2.gameboard.placeShip(p2.ships[0], 2, 2);
  p1.attack(p2, 2, 1);
  p1.attack(p2, 2, 4);
  p1.attack(p2, 2, 2);
  expect(controller.canShipBeHorizontal(p2, p2.ships[0], 2, 2)).toBe(false);
});
// test this if there are two vertical hits already

test('isGuessPossible() evals space without room', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  p2.ships = p2.ships.splice(2, 1);
  for (let i = 0; i < p2.gameboard.grid.length; i++) {
    for (let n = 0; n < p2.gameboard.grid[0].length; n++) {
      if (i === 8 && n === 8) {
        continue;
      }
      const moduloCheck = i % 2;
      if (moduloCheck === n % 2) {
        p1.attack(p2, i, n);
      }
    }
  }
  expect(controller.isGuessPossible(p2, 3, 4)).toBe(false);
});
test('isGuessPossible() evals space with horizontal room starting from middle', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  p2.ships = p2.ships.splice(2, 1);
  for (let i = 0; i < p2.gameboard.grid.length; i++) {
    for (let n = 0; n < p2.gameboard.grid[0].length; n++) {
      if (i === 8 && n === 8) {
        continue;
      }
      const moduloCheck = i % 2;
      if (moduloCheck === n % 2) {
        p1.attack(p2, i, n);
      }
    }
  }
  expect(controller.isGuessPossible(p2, 8, 8)).toBe(true);
});
test('isGuessPossible() evals space with veritcal room', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  p2.ships = p2.ships.splice(2, 1);
  for (let i = 0; i < p2.gameboard.grid.length; i++) {
    for (let n = 0; n < p2.gameboard.grid[0].length; n++) {
      if (i === 8 && n === 8) {
        continue;
      }
      const moduloCheck = i % 2;
      if (moduloCheck === n % 2) {
        p1.attack(p2, i, n);
      }
    }
  }
  expect(controller.isGuessPossible(p2, 7, 8)).toBe(true);
});
test('isGuessPossible() evals space when guessing on left edge', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  p2.ships = p2.ships.splice(2, 1);
  for (let i = 0; i < p2.gameboard.grid.length; i++) {
    for (let n = 0; n < p2.gameboard.grid[0].length; n++) {
      if (i === 8 && n === 8) {
        continue;
      }
      const moduloCheck = i % 2;
      if (moduloCheck === n % 2) {
        p1.attack(p2, i, n);
      }
    }
  }
  expect(controller.isGuessPossible(p2, 2, 1)).toBe(false);
});
test('isGuessPossible() evals space one space too little on right edge', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  p2.ships = p2.ships.splice(1, 1);
  for (let i = 0; i < p2.gameboard.grid.length; i++) {
    for (let n = 0; n < p2.gameboard.grid[0].length; n++) {
      if (i === 8 && n === 8) {
        continue;
      }
      const moduloCheck = i % 2;
      if (moduloCheck === n % 2) {
        p1.attack(p2, i, n);
      }
    }
  }
  expect(controller.isGuessPossible(p2, 8, 8)).toBe(false);
});
test('isGuessPossible() evals space one space too little on left edge', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  p2.ships = p2.ships.splice(1, 1);
  for (let i = 0; i < p2.gameboard.grid.length; i++) {
    for (let n = 0; n < p2.gameboard.grid[0].length; n++) {
      if (i === 6 && n === 2) {
        continue;
      }
      const moduloCheck = i % 2;
      if (moduloCheck === n % 2) {
        p1.attack(p2, i, n);
      }
    }
  }
  expect(controller.isGuessPossible(p2, 6, 2)).toBe(false);
});
