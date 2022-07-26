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
  const enemy = model.Player('enemy');
  const coords = controller.pickComputerMove([{ row: 2, col: 2 }], enemy);
  expect(coords.length).toBe(2);
  expect(Array.isArray(coords)).toBe(true);
});
test('pickComputerMove() only returns unused coordinates', () => {
  const enemy = model.Player('enemy');
  for (let i = 0; i < enemy.gameboard.grid.length; i++) {
    for (let n = 0; n < enemy.gameboard.grid.length; n++) {
      if (i !== 0 || n !== 0) {
        enemy.gameboard.receiveAttack(i, n);
      }
    }
  }
  const coords = controller.pickComputerMove([{ row: 2, col: 2 }], enemy);
  expect(coords).toEqual([0, 0]);
});
test('pickComputerMove() returns move with no previous moves', () => {
  const enemy = model.Player('enemy');
  const coords = controller.pickComputerMove([], enemy);
  expect(coords.length).toBe(2);
  expect(Array.isArray(coords)).toBe(true);
});
test('pickComputerMove() picks space if only one move and hit left-most part of ship', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 2];
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p1.attack(p2, ...coords);
  expect(controller.pickComputerMove(p1.moves, p2)).toEqual([2, 3]);
});
test('pickComputerMove() picks space if only one move and hit right-most part of ship', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 2];
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p1.attack(p2, 2, 6);
  expect(controller.pickComputerMove(p1.moves, p2)).toEqual([2, 7]);
});
test('pickComputerMove() picks space if two moves but only last space hit', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 2];
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p1.attack(p2, 1, 1);
  p1.attack(p2, ...coords);
  expect(controller.pickComputerMove(p1.moves, p2)).toEqual([2, 3]);
});
test('pickComputerMove() picks space if only last space hit and was right board edge', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 5];
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p1.attack(p2, 2, 9);
  expect(controller.pickComputerMove(p1.moves, p2)).toEqual([2, 8]);
});
test('pickComputerMove() picks space if only last space hit and space to right has been tried', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 2];
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p1.attack(p2, 2, 7);
  p1.attack(p2, 2, 6);
  expect(controller.pickComputerMove(p1.moves, p2)).toEqual([2, 5]);
});
test('pickComputerMove() picks space if only last space hit and space to right and left have been tried', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 2];
  p2.ships[0].turnShip();
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p1.attack(p2, 6, 3);
  p1.attack(p2, 6, 1);
  p1.attack(p2, 6, 2);
  expect(controller.pickComputerMove(p1.moves, p2)).toEqual([7, 2]);
});
test('pickComputerMove() picks space if last two spaces have hit and right space exists untried', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 2];
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p1.attack(p2, 2, 4);
  p1.attack(p2, 2, 5);
  expect(controller.pickComputerMove(p1.moves, p2)).toEqual([2, 6]);
});
test('pickComputerMove() picks space if last two spaces have hit and right space has been tried', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 2];
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p1.attack(p2, 2, 7);
  p1.attack(p2, 2, 6);
  expect(controller.pickComputerMove(p1.moves, p2)).toEqual([2, 5]);
});
test('pickComputerMove() picks space if last two spaces have hit and right space does not exist', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 5];
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p1.attack(p2, 2, 8);
  p1.attack(p2, 2, 9);
  expect(controller.pickComputerMove(p1.moves, p2)).toEqual([2, 7]);
});
test('pickComputerMove() picks space if last two spaces have hit vertically', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 2];
  p2.ships[0].turnShip();
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p1.attack(p2, 2, 2);
  p1.attack(p2, 3, 2);
  expect(controller.pickComputerMove(p1.moves, p2)).toEqual([4, 2]);
});
test('pickComputerMove() picks space if last two spaces have hit and right space hit something else', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const coords = [2, 2];
  p2.gameboard.placeShip(p2.ships[0], ...coords);
  p2.gameboard.placeShip(p2.ships[1], 2, 7);
  p1.attack(p2, 2, 5);
  p1.attack(p2, 2, 6);
  p1.attack(p2, 2, 7);
  expect(controller.pickComputerMove(p1.moves, p2)).toEqual([2, 4]);
});
test('pickComputerMove() sinks previous ship if last two spaces have hit and right space hit something else', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  p2.gameboard.placeShip(p2.ships[0], 2, 2);
  p2.gameboard.placeShip(p2.ships[1], 2, 7);
  p1.attack(p2, 2, 5);
  p1.attack(p2, 2, 6);
  p1.attack(p2, 2, 7);
  const coords = controller.pickComputerMove(p1.moves, p2);
  expect(coords).toEqual([2, 4]);
  p1.attack(p2, ...coords);
  p1.attack(p2, ...controller.pickComputerMove(p1.moves, p2));
  expect(controller.pickComputerMove(p1.moves, p2)).toEqual([2, 2]);
});

test('findDirectionalIncrement() returns right', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  p1.attack(p2, 3, 4);
  p1.attack(p2, 3, 5);
  expect(controller.findDirectionalIncrement(p1.moves)).toEqual([0, 1]);
});
test('findDirectionalIncrement() returns left', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  p1.attack(p2, 3, 4);
  p1.attack(p2, 3, 3);
  expect(controller.findDirectionalIncrement(p1.moves)).toEqual([0, -1]);
});
test('findDirectionalIncrement() returns down', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  p1.attack(p2, 3, 4);
  p1.attack(p2, 4, 4);
  expect(controller.findDirectionalIncrement(p1.moves)).toEqual([1, 0]);
});
test('findDirectionalIncrement() returns up', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  p1.attack(p2, 3, 4);
  p1.attack(p2, 2, 4);
  expect(controller.findDirectionalIncrement(p1.moves)).toEqual([-1, 0]);
});
