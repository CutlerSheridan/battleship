import './styles/style.css';
import * as model from './mvc/model';
import * as controller from './mvc/controller';
import * as view from './mvc/view';

const p1 = model.Player('P1');
const p2 = model.Player('P2');
// p2.togglePlayerController();
controller.placeAllShips(p1);
controller.placeAllShips(p2);
p2.attack(p1, 3, 3);
p2.attack(p1, 3, 4);
p2.attack(p1, 6, 8);
p2.attack(p1, 9, 1);
p2.attack(p1, 8, 2);
p2.attack(p1, 0, 2);

p1.attack(p2, 3, 3);
p1.attack(p2, 3, 4);
p1.attack(p2, 6, 8);
p1.attack(p2, 9, 1);
p1.attack(p2, 8, 2);
p1.attack(p2, 0, 2);

const { body } = document;
const gameContainer = document.createElement('div');
gameContainer.classList.add('game-container');

const p1Grid = view.createGrid();
gameContainer.append(p1Grid);
view.displayShipsOnGrid(p1, p1Grid);
view.displayHits(p1, p1Grid);
const p2Grid = view.createGrid();
gameContainer.append(p2Grid);
// view.displayShipsOnGrid(p2, p2Grid);
view.displayHits(p2, p2Grid);

body.append(gameContainer);
