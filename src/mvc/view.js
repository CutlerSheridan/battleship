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
const addAttackListeners = (gridElement, player, enemy) => {
  for (let i = 0; i < enemy.gameboard.grid.length; i++) {
    for (let n = 0; n < enemy.gameboard.grid[0].length; n++) {
      const space = gridElement.querySelector(`.grid-space[data-row="${i}"][data-col="${n}"]`);
      space.addEventListener('click', () => {
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
      ship.coordinates.forEach((coord) => {
        const sunkSpace = gridElement.querySelector(
          `.grid-space[data-row="${coord.row}"][data-col="${coord.col}"]`
        );
        sunkSpace.classList.add('grid-space-sunk');
      });
    }
  }
};
const deleteGridElements = () => {
  const gridElements = document.querySelectorAll('.grid-outerContainer');
  gridElements.forEach((grid) => grid.remove());
};

export {
  createGrid,
  displayShipsOnGrid,
  displayHits,
  addAttackListeners,
  launchAttack,
  deleteGridElements,
};
