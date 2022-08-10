/* eslint-disable no-use-before-define */
import * as controller from './controller';
import * as model from './model';

let p1;
let p2;

const setupGame = () => {
  p1 = model.Player('p1');
  p2 = model.Player('p2');
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
  uiContainer.append(
    createNameElements(),
    nextButton,
    createAttackResult(),
    createMatchResult(),
    createInstructions()
  );

  const { body } = document;
  body.append(gameContainer, uiContainer);
  p1Grid.classList.add('grid-unclickable');
  p2Grid.classList.add('grid-unclickable');

  nextButton.addEventListener('click', startTurn);
  handlePlayerTypeToggles();
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
      if (!pGrid[i][n].ship) {
        const spaceEl = gridElement.querySelector(`.grid-space[data-row="${i}"][data-col="${n}"]`);
        spaceEl.classList.remove('grid-space-occupied');
        spaceEl.classList.add('grid-space-empty');
        const spaceElContent = spaceEl.querySelector('.grid-spaceContent');
        spaceElContent.textContent = '';
      } else if (pGrid[i][n].position === 0) {
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
const createNameElements = () => {
  const playerNamesElement = document.createElement('div');
  playerNamesElement.classList.add('ui-playerNames');
  for (let i = 0; i < 2; i++) {
    const nameElement = document.createElement('div');
    nameElement.classList.add('ui-name');
    nameElement.textContent = [p1.name, p2.name][i];
    const playerTypeContainer = document.createElement('div');
    playerTypeContainer.classList.add('ui-playerTypeContainer');
    const playerTypeLabel = document.createElement('label');
    playerTypeLabel.textContent = 'Computer?';
    playerTypeLabel.setAttribute('for', `p${i + 1}-type`);
    playerTypeLabel.classList.add('ui-playerTypeLabel');
    const typeToggle = document.createElement('input');
    typeToggle.type = 'checkbox';
    typeToggle.id = `p${i + 1}-type`;
    typeToggle.classList.add('ui-playerTypeCheckbox');
    playerTypeContainer.append(playerTypeLabel, typeToggle);
    playerNamesElement.append(nameElement, playerTypeContainer);
  }
  return playerNamesElement;
};
const handlePlayerTypeToggles = () => {
  const typeToggles = document.querySelectorAll('.ui-playerTypeCheckbox');
  const nextButton = document.querySelector('.ui-nextButton');
  const originalSettings = [typeToggles[0].checked, typeToggles[1].checked];
  const originalButtonText = [];
  const isButtonUnclickable = [];

  typeToggles.forEach((toggle, index) => {
    toggle.addEventListener('change', () => {
      originalButtonText.push(nextButton.textContent);
      isButtonUnclickable.push(nextButton.classList.contains('ui-nextButton-unclickable'));
      if (
        toggle.checked !== originalSettings[index] ||
        typeToggles[1 - index].checked !== originalSettings[1 - index]
      ) {
        nextButton.textContent = 'Restart game?';
        nextButton.removeEventListener('click', startTurn);
        nextButton.addEventListener('click', restartGame);
        if (isButtonUnclickable[0]) {
          nextButton.classList.remove('ui-nextButton-unclickable');
        }
      } else {
        nextButton.textContent = originalButtonText[0];
        nextButton.removeEventListener('click', restartGame);
        nextButton.addEventListener('click', startTurn);
        if (isButtonUnclickable[0]) {
          nextButton.classList.add('ui-nextButton-unclickable');
        }
      }
    });
  });
};
const createNextTurnButton = () => {
  const btn = document.createElement('button');
  btn.classList.add('ui-nextButton');
  btn.textContent = 'Start game';
  return btn;
};
const createAttackResult = () => {
  const resultContainer = document.createElement('div');
  resultContainer.classList.add('ui-resultContainer');
  resultContainer.textContent = 'Target hit: ';
  const result = document.createElement('span');
  result.classList.add('ui-result');
  result.textContent = 'test';
  resultContainer.append(result);
  resultContainer.classList.add('ui-resultContainer-hidden');
  return resultContainer;
};
const createMatchResult = () => {
  const resultEl = document.createElement('div');
  resultEl.classList.add('ui-matchResult');
  resultEl.classList.add('ui-matchResult-hidden');
  return resultEl;
};
const createInstructions = () => {
  const instructionsEl = document.createElement('div');
  instructionsEl.classList.add('ui-instructions');
  instructionsEl.classList.add('ui-instructions-hidden');
  instructionsEl.textContent = 'Click to move a ship.  Press any key to turn it.';
  return instructionsEl;
};

const enableNextTurnButton = () => {
  const nextButton = document.querySelector('.ui-nextButton');
  nextButton.addEventListener('click', startTurn);
};
const startTurn = () => {
  const [grid1, grid2] = Array.from(document.querySelectorAll('.grid-outerContainer'));
  const instructions = document.querySelector('.ui-instructions');

  document.querySelector('.ui-resultContainer').classList.add('ui-resultContainer-hidden');
  switchTurns();
  if (isRoundZero()) {
    instructions.classList.remove('ui-instructions-hidden');
    startRoundZero();
    return;
  }
  if (p1.currentTurn && p1.turnNum === 2) {
    instructions.classList.add('ui-instructions-hidden');
    const allSpaceEls = [];
    allSpaceEls.push(...getGridSpaceElements(grid1));
    allSpaceEls.push(...getGridSpaceElements(grid2));
    allSpaceEls.forEach((space) => {
      space.removeEventListener('click', handleRelocLift);
    });
  }
  const currentPlayer = p1.currentTurn ? p1 : p2;
  const currentGrid = p1.currentTurn ? grid1 : grid2;
  const enemyGrid = p1.currentTurn ? grid2 : grid1;
  currentGrid.classList.add('grid-unclickable');
  enemyGrid.classList.add('grid-unclickable');
  if (currentPlayer.isHuman) {
    enemyGrid.classList.remove('grid-unclickable');
  } else {
    const currentEnemy = p1.currentTurn ? p2 : p1;
    const [row, col] = controller.pickComputerMove(currentPlayer, currentEnemy);
    const targetSpace = enemyGrid.querySelector(
      `.grid-space[data-row="${row}"][data-col="${col}"]`
    );
    setTimeout(() => {
      attackHandler(enemyGrid, currentPlayer, currentEnemy, targetSpace);
    }, 400);
  }
};
const switchTurns = () => {
  const nextButton = document.querySelector('.ui-nextButton');
  const grids = Array.from(document.querySelectorAll('.grid-outerContainer'));
  const players = [p1, p2];
  const nameElements = document.querySelectorAll('.ui-name');

  if (!p1.currentTurn && !p2.currentTurn) {
    p1.changeTurn();
    p1.incrementTurn();
    nameElements[0].classList.add('ui-name-current');
    players.forEach((p, index) => {
      if (!p.isHuman) {
        toggleShipVisibility(players[index]);
      }
    });
    if (p1.isHuman && p2.isHuman) {
      toggleShipVisibility(p2);
    }
    nextButton.textContent = 'Next turn';
  } else {
    p1.changeTurn();
    p2.changeTurn();
    players.forEach((p) => {
      if (p.currentTurn) {
        p.incrementTurn();
      }
    });
    if (!isRoundZero()) {
      nextButton.classList.add('ui-nextButton-unclickable');
    }
    if (p1.isHuman && p2.isHuman) {
      toggleShipVisibility(p2);
      toggleShipVisibility(p1);
    }
    nameElements.forEach((name) => name.classList.toggle('ui-name-current'));
  }

  if (isRoundZero()) {
    players.forEach((p, index) => {
      if (p.currentTurn) {
        if (p.isHuman) {
          grids[index].classList.remove('grid-unclickable');
        }
        grids[1 - index].classList.add('grid-unclickable');
      }
    });
  }
};
const isRoundZero = () => p1.turnNum <= 1 && p2.turnNum <= 1;
const startRoundZero = () => {
  const nextButton = document.querySelector('.ui-nextButton');
  const player = p1.currentTurn ? p1 : p2;
  if (player.isHuman) {
    addRelocShipListeners();
  }
  if (player === p2) {
    if (player.isHuman) {
      nextButton.addEventListener('click', addAttackListeners, { once: true });
    } else {
      addAttackListeners();
    }
  }
  if (!player.isHuman) {
    startTurn();
  }
};
const addRelocShipListeners = () => {
  const allShipSpaces = getAllShipSpaceElements();
  let shipSpaces;
  if (p1.currentTurn) {
    allShipSpaces.splice(allShipSpaces.length / 2);
    shipSpaces = allShipSpaces;
  } else {
    shipSpaces = allShipSpaces.splice(allShipSpaces.length / 2);
  }
  shipSpaces.forEach((space) => space.addEventListener('click', handleRelocLift));
};
const handleRelocLift = (e) => {
  const player = p1.currentTurn ? p1 : p2;
  const gridElements = document.querySelectorAll('.grid-outerContainer');
  const pGridElement = p1.currentTurn ? gridElements[0] : gridElements[1];
  const clickedSpace = e.currentTarget;
  let ship;
  if (clickedSpace.classList.contains('grid-space')) {
    const clickedRow = clickedSpace.dataset.row;
    const clickedCol = clickedSpace.dataset.col;
    const gridSpaceObj = player.gameboard.grid[clickedRow][clickedCol];
    ship = gridSpaceObj.ship;
    ship.heldPos = gridSpaceObj.position + 1;
    player.gameboard.removeShip(ship);
    displayShipsOnGrid(player, pGridElement);
  } else {
    // handle if removing from off-grid
  }

  const allSpaceEls = getGridSpaceElements(pGridElement);
  allSpaceEls.forEach((space) => {
    space.removeEventListener('click', handleRelocLift);
    if (controller.areSpacesAvailableForShip(player, ship, space.dataset.row, space.dataset.col)) {
      space.addEventListener('click', handleRelocPlace);
    }
  });
  document.addEventListener('keydown', ship.turnShip);
  document.querySelector('.ui-nextButton').classList.add('ui-nextButton-unclickable');
};
const handleRelocPlace = (e) => {
  const player = p1.currentTurn ? p1 : p2;
  const gridElements = document.querySelectorAll('.grid-outerContainer');
  const pGridElement = p1.currentTurn ? gridElements[0] : gridElements[1];
  const clickedSpace = e.currentTarget;
  const { row } = clickedSpace.dataset;
  const { col } = clickedSpace.dataset;
  const ship = player.ships.find((s) => s.heldPos);
  player.gameboard.placeShip(ship, row, col);
  displayShipsOnGrid(player, pGridElement);
  const allSpaceEls = getGridSpaceElements(pGridElement);
  allSpaceEls.forEach((space) => {
    space.removeEventListener('click', handleRelocPlace);
  });
  document.removeEventListener('keydown', ship.turnShip);
  document.querySelector('.ui-nextButton').classList.remove('ui-nextButton-unclickable');

  addRelocShipListeners();
};
const toggleShipVisibility = (player) => {
  const allShipSpaces = getAllShipSpaceElements();
  let shipSpaces;
  if (player === p2) {
    shipSpaces = allShipSpaces.splice(allShipSpaces.length / 2);
  } else {
    allShipSpaces.splice(allShipSpaces.length / 2);
    shipSpaces = allShipSpaces;
  }
  shipSpaces.forEach((space) => {
    space.classList.toggle('grid-space-occupied');
    if (space.classList.contains('grid-space-hit')) {
      space.classList.toggle('grid-space-secretlyOccupied');
    } else {
      space.classList.toggle('grid-space-empty');
    }
  });
};
const getAllShipSpaceElements = () => {
  const gridElements = document.querySelectorAll('.grid-outerContainer');
  const shipSpaceElements = [];
  const players = [p1, p2];

  gridElements.forEach((grid, index) => {
    for (let i = 0; i < p1.gameboard.grid.length; i++) {
      for (let n = 0; n < p1.gameboard.grid[0].length; n++) {
        if (players[index].gameboard.grid[i][n].ship) {
          shipSpaceElements.push(
            grid.querySelector(`.grid-space[data-row="${i}"][data-col="${n}"]`)
          );
        }
      }
    }
  });
  return shipSpaceElements;
};
const addAttackListeners = () => {
  const gridElements = document.querySelectorAll('.grid-outerContainer');
  const players = [p1, p2];
  players.forEach((p, index) => {
    if (p.isHuman) {
      const enemySpaces = getGridSpaceElements(gridElements[1 - index]);
      enemySpaces.forEach((space) =>
        space.addEventListener(
          'click',
          (e) => {
            e.preventDefault();
            attackHandler(gridElements[1 - index], p, players[1 - index], space);
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
    displayAttackResult(enemy, space);
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
  const target = [+space.dataset.row, +space.dataset.col];
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
const displayAttackResult = (enemy, space) => {
  const { ship } = enemy.gameboard.grid[space.dataset.row][space.dataset.col];
  if (ship) {
    const resultElement = document.querySelector('.ui-result');
    resultElement.textContent = ship.name;
    const resultContainer = document.querySelector('.ui-resultContainer');
    resultContainer.classList.remove('ui-resultContainer-hidden');
  }
};
const endGame = (winner) => {
  const resultEl = document.querySelector('.ui-matchResult');
  resultEl.textContent = winner === 'tie' ? 'Tie!' : `${winner} wins!`;
  resultEl.classList.remove('ui-matchResult-hidden');
  const nextButton = document.querySelector('.ui-nextButton');
  nextButton.removeEventListener('click', startTurn);
  nextButton.textContent = 'New game?';
  nextButton.addEventListener('click', restartGame, { once: true });
};
const restartGame = () => {
  let playerTypeToggles = document.querySelectorAll('.ui-playerTypeCheckbox');
  const playerTypes = [playerTypeToggles[0].checked, playerTypeToggles[1].checked];
  deleteDOMElements();
  setupGame();
  playerTypeToggles = document.querySelectorAll('.ui-playerTypeCheckbox');
  playerTypeToggles.forEach((toggle, index) => {
    if (playerTypes[index]) {
      toggle.checked = true;
      [p1, p2][index].togglePlayerController();
    }
  });
  handlePlayerTypeToggles();
};
const deleteDOMElements = () => {
  const content = [
    document.querySelector('.game-container'),
    document.querySelector('.ui-container'),
  ];
  content.forEach((item) => item.remove());
};
const getGridSpaceElements = (gridElement) => {
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

export {
  setupGame,
  handlePlayerTypeToggles,
  createGrid,
  displayShipsOnGrid,
  displayHits,
  addAttackListeners,
  enableNextTurnButton,
  launchAttack,
  createNameElements,
};
