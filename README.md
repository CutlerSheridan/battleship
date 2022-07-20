# Battleship

## A deadly game of war on the high seas

Play by yourself or with a friend! Place your ships, attack your opponent, and try to sink the enemy's fleet before they can sink yours.

#### TO-DO NEXT

- make function to find edges and ends of ships so I can tailor their look accordingly instead of just having each occupied space look the same

#### TO-DO LATER

##### Features

- add basic opponent AI
- add ability to place ships
- add ability to remove ship and replace it
- add complex opponent AI

##### Behavior

##### Style

- maybe add sounds for hits and misses?

#### DONE

_0.5.1_

- add coordinates object for each ship so a sunk ship can more easily add sunk class to all of that ship's spaces
- extract displayNewHit() from addAttackListeners()

_0.5.0_

- write function to translate click target to an attack
- write function to add attack event listeners to each enemy space
- make clicked attacks show colored hit peg
- write function to delete both grids

_0.4.3_

- add ability to display opponent board with invisible ships

_0.4.2_

- add function to display pegs for where attacks have occured that convey if it was a hit

_0.4.1_

- make ships on board identifiable
- make occupied spaces more visually distinct
- add holes to empty spaces

_0.4.0_

- write function to create game board DOM element
- write function to display one ship
- write function to display all of a player's ships

_0.3.0_

- write function to randomly place a ship if enough free spots are available in the correct direction
- write function to randomly place all of a player's ships
- write function to randomly decide if ship should be horizontal or vertical
- fix areSpacesAvailableForShip() to work with vertical ships

_0.2.1_

- remove accidental destructuring in method parameters
- get Player.isHuman funcitoning correctly since Player has an internal method that has to change each instance's own property
- clean up model.js

_0.2.0_

- add another test for receiveAttack()
- add Player()
- test Player

_0.1.1_

- write func to check if all ships on gameboard have been sunk
- test it

_0.1.0_

- write func to create Ship objects
- write Ship.hit()
- write Ship.isSunk()
- test Ship
- write func to create Gameboard objects
- write Gameboard.placeShip()
- write Gameboard.receiveAttack()
- test Gameboard

_0.0.1_

- Initial npm and webpack configurations

_0.0.0_

- Initial commit
