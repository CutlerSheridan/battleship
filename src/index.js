import './styles/style.css';
import * as model from './mvc/model';
import * as controller from './mvc/controller';
import * as view from './mvc/view';

const p1 = model.Player('P1');
const p2 = model.Player('P2');
p2.togglePlayerController();
controller.placeAllShips(p1);
controller.placeAllShips(p2);

const { body } = document;
const p1Grid = view.createGrid();
body.append(p1Grid);
view.displayShipsOnGrid(p1, p1Grid);
const p2Grid = view.createGrid();
body.append(p2Grid);
view.displayShipsOnGrid(p2, p2Grid);
