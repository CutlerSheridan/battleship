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
