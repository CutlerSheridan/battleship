/* eslint-disable no-undef */
import * as view from '../mvc/view';
import * as model from '../mvc/model';

test('launchAttack() successfully launches an attack against the enemy', () => {
  const p1 = model.Player('p1');
  const p2 = model.Player('p2');
  const targetElement = {
    dataset: {
      row: 2,
      col: 2,
    },
  };
  view.launchAttack(targetElement, p1, p2);
  expect(p2.gameboard.grid[2][2].hasBeenHit).toBe(true);
});
