/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
import * as model from '../mvc/model';

test('Ship() creates ship of correct length', () => {
  const testShip = model.Ship(4);
  expect(testShip.length).toBe(4);
  expect(testShip.hitSpaces).toEqual([false, false, false, false]);
});
test('Ship.hit() works for 1 hit', () => {
  const testShip = model.Ship(3);
  testShip.hit(0);
  expect(testShip.hitSpaces).toEqual([true, false, false]);
});
test('Ship.isSunk() works for new ship', () => {
  expect(model.Ship(3).isSunk()).toBe(false);
});
test('Ship.isSunk() works for sunk ship', () => {
  const testShip = model.Ship(3);
  for (let i = 0; i < testShip.length; i++) {
    testShip.hit(i);
  }
  expect(testShip.isSunk()).toBe(true);
});

test('Gameboard() creates 10x10 board', () => {
  const testBoard = model.Gameboard();
  expect(testBoard.board[0].length).toBe(10);
  expect(testBoard.board.length).toBe(10);
});
test('Gameboard.placeShip() correctly places horizontal ship', () => {
  const testShip = model.Ship(4);
  const testBoard = model.Gameboard();
  testBoard.placeShip(testShip, [2, 3]);
  expect(testBoard.board[3][2]).toEqual({ ship: testShip, position: 0, hasBeenHit: false });
  expect(testBoard.board[3][5]).toEqual({ ship: testShip, position: 3, hasBeenHit: false });
});
test('Gameboard.receiveAttack() inflicts hit on ship in correct location', () => {
  const testShip = model.Ship(4);
  const testBoard = model.Gameboard();
  testBoard.placeShip(testShip, [2, 3]);
  testBoard.receiveAttack([3, 3]);
  expect(testBoard.board[3][3].hasBeenHit).toBe(true);
  expect(testShip.hitSpaces).toEqual([false, true, false, false]);
});
test('Gameboard.allShipsAreSunk() detects when two ships are not sunk', () => {
  const testBoard = model.Gameboard();
  const ship1 = model.Ship(3);
  const ship2 = model.Ship(4);
  testBoard.placeShip(ship1, [2, 1]);
  testBoard.placeShip(ship2, [6, 6]);
  expect(testBoard.allShipsAreSunk()).toBe(false);
});
test('Gameboard.allShipsAreSunk() detects when one ship is sunk', () => {
  const testBoard = model.Gameboard();
  const ship1 = model.Ship(3);
  testBoard.placeShip(ship1, [2, 1]);
  for (let i = 0; i < ship1.length; i++) {
    testBoard.receiveAttack([2 + i, 1]);
  }
  expect(testBoard.allShipsAreSunk()).toBe(true);
});
