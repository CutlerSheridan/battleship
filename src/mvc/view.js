import * as controller from './controller';
import * as model from './model';

let currentTurn;

const setupGame = () => {
  const p1 = model.Player('P1');
  const p2 = model.Player('P2');
  controller.placeAllShips(p1);
  controller.placeAllShips(p2);
  currentTurn = p1.name;
  const p1Grid = createGrid();
  const p2Grid = createGrid();

  const gameContainer = document.createElement('div');
  gameContainer.classList.add('game-container');
  gameContainer.append(p1Grid, p2Grid);
  displayShipsOnGrid(p1, p1Grid);
  const nameElementsContainer = createNameElements(p1, p2);

  const { body } = document;
  body.append(gameContainer, nameElementsContainer);

  addAttackListeners(p2Grid, p1, p2);
};

const createGrid = () => {
  const gridOuterContainer = document.createElement('div');
  gridOuterContainer.classList.add('grid-outerContainer');
  const gridInnerContainer = document.createElement('div');
  gridInnerContainer.classList.add('grid-innerContainer');

  const numArray = [...Array(11).keys()].splice(1);
  const charArray = Array.from({ length: 10 }, (_, loc) =>
    String.fromCharCode('A'.charCodeAt(0) + loc)
  );

  for (let i = -1; i < 10; i++) {
    for (let n = -1; n < 10; n++) {
      const space = document.createElement('div');
      space.classList.add('grid-space');
      const spaceContent = document.createElement('div');
      spaceContent.classList.add('grid-spaceContent');
      if (i === -1 && n > -1) {
        spaceContent.textContent = numArray[n];
      } else if (i > -1 && n === -1) {
        spaceContent.textContent = charArray[i];
      } else if (i > -1 && n > -1) {
        space.classList.add('grid-space-empty');
      }
      space.dataset.row = i;
      space.dataset.col = n;
      space.append(spaceContent);
      gridInnerContainer.append(space);
    }
  }
  gridOuterContainer.append(gridInnerContainer);
  return gridOuterContainer;
};
const displayShipsOnGrid = (player, gridElement) => {
  const pGrid = player.gameboard.grid;
  for (let i = 0; i < pGrid.length; i++) {
    for (let n = 0; n < pGrid[0].length; n++) {
      if (pGrid[i][n].position === 0) {
        displayOneShip(i, n, pGrid[i][n].ship, gridElement);
      }
    }
  }
};
const displayOneShip = (y, x, ship, gridElement) => {
  let row = y;
  let col = x;
  for (let i = 0; i < ship.length; i++) {
    if (ship.isHorizontal) {
      col = x + i;
    } else {
      row = y + i;
    }
    const shipSpace = gridElement.querySelector(
      `.grid-space[data-row="${row}"][data-col="${col}"]`
    );
    const shipSpaceContent = shipSpace.querySelector('.grid-spaceContent');
    shipSpace.classList.add('grid-space-occupied');
    shipSpace.classList.remove('grid-space-empty');
    if (!ship.hitSpaces[i]) {
      shipSpaceContent.textContent = ship.name.charAt(0).toUpperCase();
    }
  }
};
const displayHits = (player, gridElement) => {
  const gridObj = player.gameboard.grid;
  for (let i = 0; i < gridObj.length; i++) {
    for (let n = 0; n < gridObj[0].length; n++) {
      if (gridObj[i][n].hasBeenHit) {
        const space = gridElement.querySelector(`[data-row="${i}"][data-col="${n}"]`);
        space.classList.add('grid-space-hit');
        if (gridObj[i][n].ship) {
          if (!space.classList.contains('grid-space-occupied')) {
            space.classList.add('grid-space-secretlyOccupied');
          }
        }
      }
    }
  }
};
const createNameElements = (p1, p2) => {
  const names = [p1.name, p2.name];
  const playerNamesElement = document.createElement('div');
  playerNamesElement.classList.add('ui-playerNames');
  names.forEach((name) => {
    const nameElement = document.createElement('div');
    nameElement.classList.add('ui-name');
    nameElement.textContent = name;
    if (name === currentTurn) {
      nameElement.classList.add('ui-name-current');
    }
    playerNamesElement.append(nameElement);
  });
  return playerNamesElement;
};

const addAttackListeners = (gridElement, player, enemy) => {
  for (let i = 0; i < enemy.gameboard.grid.length; i++) {
    for (let n = 0; n < enemy.gameboard.grid[0].length; n++) {
      const space = gridElement.querySelector(`.grid-space[data-row="${i}"][data-col="${n}"]`);
      space.addEventListener('click', (e) => {
        e.preventDefault();
        launchAttack(space, player, enemy);
        displayNewHit(space, enemy, gridElement);
      });
    }
  }
};
const launchAttack = (space, player, enemy) => {
  const target = [space.dataset.row, space.dataset.col];
  if (enemy.gameboard.grid[target[0]][target[1]].hasBeenHit) {
    return;
  }
  player.attack(enemy, ...target);
};
const displayNewHit = (space, enemy, gridElement) => {
  space.classList.add('grid-space-hit');
  const { ship } = enemy.gameboard.grid[space.dataset.row][space.dataset.col];
  if (ship) {
    space.classList.add('grid-space-secretlyOccupied');
    if (ship.isSunk()) {
      const coords = ship.coordinates;
      const orientation = ship.isHorizontal ? 'horizontal' : 'vertical';
      for (let i = 0; i < coords.length; i++) {
        const sunkSpace = gridElement.querySelector(
          `.grid-space[data-row="${coords[i].row}"][data-col="${coords[i].col}"]`
        );
        switch (i) {
          case 0:
            sunkSpace.classList.add(`grid-sunkSpace-${orientation}Start`);
            break;
          case coords.length - 1:
            sunkSpace.classList.add(`grid-sunkSpace-${orientation}End`);
            break;
          default:
            sunkSpace.classList.add(`grid-sunkSpace-${orientation}Middle`);
            break;
        }
      }
    }
  }
};
const deleteGridElements = () => {
  const gridElements = document.querySelectorAll('.grid-outerContainer');
  gridElements.forEach((grid) => grid.remove());
};

export {
  setupGame,
  createGrid,
  displayShipsOnGrid,
  displayHits,
  addAttackListeners,
  launchAttack,
  deleteGridElements,
  createNameElements,
};
