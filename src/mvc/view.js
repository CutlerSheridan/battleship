/* eslint-disable no-use-before-define */
import * as controller from './controller';
import * as model from './model';

let p1;
let p2;

const setupGame = () => {
  p1 = model.Player('p1');
  p2 = model.Player('p2');
  p2.togglePlayerController();
  controller.placeAllShips(p1);
  controller.placeAllShips(p2);
  const p1Grid = createGrid();
  const p2Grid = createGrid();

  const uiContainer = document.createElement('div');
  uiContainer.classList.add('ui-container');
  const gameContainer = document.createElement('div');
  gameContainer.classList.add('game-container');
  gameContainer.append(p1Grid, p2Grid);
  displayShipsOnGrid(p1, p1Grid);
  displayShipsOnGrid(p2, p2Grid);
  const nextButton = createNextTurnButton();
  uiContainer.append(createNameElements(), nextButton);

  const { body } = document;
  body.append(gameContainer, uiContainer);
  assignAllShipSpacesClass();
  addAttackListeners();
  p1Grid.classList.add('grid-unclickable');
  p2Grid.classList.add('grid-unclickable');

  nextButton.addEventListener('click', startTurn);
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
const assignAllShipSpacesClass = () => {
  const gridElements = document.querySelectorAll('.grid-outerContainer');
  const playerGrids = [p1.gameboard.grid, p2.gameboard.grid];

  gridElements.forEach((grid, index) => {
    for (let i = 0; i < playerGrids[index].length; i++) {
      for (let n = 0; n < playerGrids[index][0].length; n++) {
        if (playerGrids[index][i][n].ship) {
          const space = grid.querySelector(`.grid-space[data-row="${i}"][data-col="${n}"]`);
          space.classList.add('grid-space-shipHold');
        }
      }
    }
  });
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
const createNameElements = () => {
  const names = [p1.name, p2.name];
  const playerNamesElement = document.createElement('div');
  playerNamesElement.classList.add('ui-playerNames');
  for (let i = 0; i < 2; i++) {
    const nameElement = document.createElement('div');
    nameElement.classList.add('ui-name');
    nameElement.textContent = names[i];
    playerNamesElement.append(nameElement);
  }
  return playerNamesElement;
};
const createNextTurnButton = () => {
  const btn = document.createElement('button');
  btn.classList.add('ui-nextButton');
  btn.textContent = 'Start game';
  return btn;
};
const addAttackListeners = () => {
  const gridElements = document.querySelectorAll('.grid-outerContainer');
  const players = [p2, p1];
  players.forEach((p, index) => {
    if (p.isHuman) {
      const enemySpaces = getAllSpaceElements(gridElements[index]);
      enemySpaces.forEach((space) =>
        space.addEventListener(
          'click',
          (e) => {
            e.preventDefault();
            attackHandler(gridElements[index], p, players[1 - index], space);
          },
          { once: true }
        )
      );
    }
  });
};
const attackHandler = (gridElement, player, enemy, space) => {
  const successfulAttack = launchAttack(space, player, enemy);
  displayNewHit(space, enemy, gridElement);
  if (successfulAttack) {
    gridElement.classList.add('grid-unclickable');
    const nextButton = document.querySelector('.ui-nextButton');
    nextButton.classList.remove('ui-nextButton-unclickable');
    if (enemy === p1) {
      const [p1Success, p2Success] = [
        p2.gameboard.allShipsAreSunk(),
        p1.gameboard.allShipsAreSunk(),
      ];
      if (p1Success && p2Success) {
        endGame('tie');
      } else if (p1Success) {
        endGame(p1.name);
      } else if (p2Success) {
        endGame(p2.name);
      }
    }
  }
};
const launchAttack = (space, player, enemy) => {
  const target = [space.dataset.row, space.dataset.col];
  if (enemy.gameboard.grid[target[0]][target[1]].hasBeenHit) {
    return false;
  }
  player.attack(enemy, ...target);
  return true;
};
const displayNewHit = (space, enemy, gridElement) => {
  space.classList.add('grid-space-hit');
  const { ship } = enemy.gameboard.grid[space.dataset.row][space.dataset.col];
  if (ship) {
    if (!space.classList.contains('grid-space-occupied')) {
      space.classList.add('grid-space-secretlyOccupied');
    }
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
const endGame = (winner) => {
  console.log(`${winner} wins!`);
  const nextButton = document.querySelector('.ui-nextButton');
  nextButton.removeEventListener('click', startTurn);
  nextButton.textContent = 'New game?';
  nextButton.addEventListener(
    'click',
    () => {
      deleteDOMElements();
      setupGame();
    },
    { once: true }
  );
};

const enableNextTurnButton = () => {
  const nextButton = document.querySelector('.ui-nextButton');
  nextButton.addEventListener('click', startTurn);
};
const startTurn = () => {
  const nextButton = document.querySelector('.ui-nextButton');
  nextButton.classList.add('ui-nextButton-unclickable');
  const [grid1, grid2] = Array.from(document.querySelectorAll('.grid-outerContainer'));
  const nameElements = document.querySelectorAll('.ui-name');

  if (!p1.currentTurn && !p2.currentTurn) {
    p1.changeTurn();
    grid1.classList.add('grid-unclickable');
    nextButton.textContent = 'Next turn';
    nameElements[0].classList.add('ui-name-current');
    toggleShipVisibility(grid2);
  } else {
    p1.changeTurn();
    p2.changeTurn();
    if (p1.isHuman && p2.isHuman) {
      toggleShipVisibility(grid2);
      toggleShipVisibility(grid1);
    }
    nameElements.forEach((name) => name.classList.toggle('ui-name-current'));
  }
  const currentPlayer = p1.currentTurn ? p1 : p2;
  const enemyGrid = p1.currentTurn ? grid2 : grid1;
  if (currentPlayer.isHuman) {
    enemyGrid.classList.remove('grid-unclickable');
  } else {
    const currentEnemy = p1.currentTurn ? p2 : p1;
    const [row, col] = controller.pickComputerMove(currentEnemy);
    // currentPlayer.attack(currentEnemy, ...attackCoords);
    const targetSpace = enemyGrid.querySelector(
      `.grid-space[data-row="${row}"][data-col="${col}"]`
    );
    attackHandler(enemyGrid, currentPlayer, currentEnemy, targetSpace);
  }
};
const toggleShipVisibility = (gridElement) => {
  const shipSpaces = gridElement.querySelectorAll('.grid-space-shipHold');
  shipSpaces.forEach((space) => {
    space.classList.toggle('grid-space-occupied');
    if (space.classList.contains('grid-space-hit')) {
      space.classList.toggle('grid-space-secretlyOccupied');
    } else {
      space.classList.toggle('grid-space-empty');
    }
  });
};
const getAllSpaceElements = (gridElement) => {
  const spaceElements = [];
  for (let i = 0; i < 10; i++) {
    for (let n = 0; n < 10; n++) {
      spaceElements.push(
        gridElement.querySelector(`.grid-space[data-row="${i}"][data-col="${n}"]`)
      );
    }
  }
  return spaceElements;
};
const deleteDOMElements = () => {
  const content = [
    document.querySelector('.game-container'),
    document.querySelector('.ui-container'),
  ];
  content.forEach((item) => item.remove());
};

export {
  setupGame,
  createGrid,
  displayShipsOnGrid,
  displayHits,
  addAttackListeners,
  enableNextTurnButton,
  launchAttack,
  createNameElements,
};
