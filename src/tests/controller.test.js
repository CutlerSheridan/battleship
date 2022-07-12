import controller from '../mvc/controller';

test('sum works', () => {
  expect(controller.sum(1, 2)).toBe(3);
});
