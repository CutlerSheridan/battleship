/* eslint-disable no-undef */
import * as model from '../mvc/model';

describe('Ship', () => {
  test('Ship() creates ship of correct length', () => {
    const testShip = model.Ship(4);
    expect(testShip.length).toBe(4);
    expect(testShip.hitSpaces).toEqual([false, false, false, false]);
  });
  test('Ship.turnShip() turns ship', () => {
    const testShip = model.Ship(4);
    testShip.turnShip();
    expect(testShip.isHorizontal).toBe(false);
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
});

describe('Gameboard', () => {
  test('Gameboard() creates 10x10 board', () => {
    const testBoard = model.Gameboard();
    expect(testBoard.grid[0].length).toBe(10);
    expect(testBoard.grid.length).toBe(10);
  });
  test('Gameboard.placeShip() correctly places horizontal ship', () => {
    const testShip = model.Ship(4);
    const testBoard = model.Gameboard();
    testBoard.placeShip(testShip, ...[3, 2]);
    expect(testBoard.grid[3][2]).toEqual({
      ship: testShip,
      position: 0,
      hasBeenHit: false,
    });
    expect(testBoard.grid[3][5]).toEqual({
      ship: testShip,
      position: 3,
      hasBeenHit: false,
    });
  });
  test("Gameboard.placeShip() changes ship object's coordinates", () => {
    const testShip = model.Ship(3);
    const testBoard = model.Gameboard();
    testBoard.placeShip(testShip, 3, 2);
    const expectedArray = [
      { row: 3, col: 2 },
      { row: 3, col: 3 },
      { row: 3, col: 4 },
    ];
    expect(testShip.coordinates.length).toBe(3);
    expect(testShip.coordinates).toEqual(expectedArray);
  });
  test('Gameboard.placeShip() places horizontal ship held from middle', () => {
    const testShip = model.Ship(3);
    testShip.heldPos = 2;
    const testBoard = model.Gameboard();
    testBoard.placeShip(testShip, 3, 3);
    const expectedArray = [
      { row: 3, col: 2 },
      { row: 3, col: 3 },
      { row: 3, col: 4 },
    ];
    expect(testShip.coordinates.length).toBe(3);
    expect(testShip.coordinates).toEqual(expectedArray);
  });
  test('Gameboard.placeShip() places vertical ship held from spot 4 / 5', () => {
    const testShip = model.Ship(5);
    testShip.turnShip();
    testShip.heldPos = 4;
    const testBoard = model.Gameboard();
    testBoard.placeShip(testShip, 7, 3);
    const expectedArray = [
      { row: 4, col: 3 },
      { row: 5, col: 3 },
      { row: 6, col: 3 },
      { row: 7, col: 3 },
      { row: 8, col: 3 },
    ];
    expect(testShip.coordinates.length).toBe(5);
    expect(testShip.coordinates).toEqual(expectedArray);
  });
  test('Gameboard.removeShip() removes a ship', () => {
    const testShip = model.Ship(5);
    const testBoard = model.Gameboard();
    testBoard.placeShip(testShip, 5, 5);
    testBoard.removeShip(testShip);
    expect(testBoard.grid[5][5]).toEqual({ hasBeenHit: false });
  });
  test('Gameboard.receiveAttack() inflicts hit on ship in correct location', () => {
    const testShip = model.Ship(4);
    const testBoard = model.Gameboard();
    testBoard.placeShip(testShip, ...[3, 2]);
    testBoard.receiveAttack(...[3, 3]);
    expect(testBoard.grid[3][3].hasBeenHit).toBe(true);
    expect(testShip.hitSpaces).toEqual([false, true, false, false]);
  });
  test('Gameboard.receiveAttack() functions when no ship is present', () => {
    const testBoard = model.Gameboard();
    testBoard.receiveAttack(...[3, 3]);
    expect(testBoard.grid[3][3].hasBeenHit).toBe(true);
  });
  test('Gameboard.allShipsAreSunk() detects when two ships are not sunk', () => {
    const testBoard = model.Gameboard();
    const ship1 = model.Ship(3);
    const ship2 = model.Ship(4);
    testBoard.placeShip(ship1, ...[1, 2]);
    testBoard.placeShip(ship2, ...[6, 6]);
    expect(testBoard.allShipsAreSunk()).toBe(false);
  });
  test('Gameboard.allShipsAreSunk() detects when one ship is sunk', () => {
    const testBoard = model.Gameboard();
    const ship1 = model.Ship(3);
    testBoard.placeShip(ship1, ...[1, 2]);
    for (let i = 0; i < ship1.length; i++) {
      testBoard.receiveAttack(...[1, 2 + i]);
    }
    expect(testBoard.allShipsAreSunk()).toBe(true);
  });
});

describe('Player', () => {
  test('Player.togglePlayerController() succeeds', () => {
    const p1 = model.Player('p1');
    p1.togglePlayerController();
    expect(p1.isHuman).toBe(false);
  });
  test('Player.togglePlayerController() twice succeeds', () => {
    const p1 = model.Player('p1');
    p1.togglePlayerController();
    p1.togglePlayerController();
    expect(p1.isHuman).toBe(true);
  });
  test('Player.togglePlayerController() succeeds with two players', () => {
    const p1 = model.Player('p1');
    const p2 = model.Player('p2');
    p1.togglePlayerController();
    expect(p1.isHuman).toBe(false);
    expect(p2.isHuman).toBe(true);
  });
  test('Player.attack() hits enemy board', () => {
    const p1 = model.Player('p1');
    const p2 = model.Player('p2');
    p1.attack(p2, ...[2, 2]);
    expect(p2.gameboard.grid[1][1].hasBeenHit).toBe(false);
    expect(p2.gameboard.grid[2][2].hasBeenHit).toBe(true);
  });
  test('Player.attack() updates Player.hitMoves', () => {
    const p1 = model.Player('p1');
    const p2 = model.Player('p2');
    p2.gameboard.placeShip(p2.ships[0], 2, 1);
    p1.attack(p2, ...[2, 2]);
    p1.attack(p2, ...[4, 5]);

    expect(p1.hitMoves).toEqual([{ row: 2, col: 2 }]);
  });
  test('Player.incrementTurn() adds to Player.turnNum', () => {
    const p1 = model.Player('p1');
    p1.incrementTurn();
    p1.incrementTurn();
    expect(p1.turnNum).toBe(2);
  });
});
