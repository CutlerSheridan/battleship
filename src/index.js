import './styles/style.css';
import * as model from './mvc/model';
import * as controller from './mvc/controller';

const p1 = model.Player('P1');
const p2 = model.Player('P2');
p2.togglePlayerController();
controller.placeAllShips(p1);
controller.placeAllShips(p2);
