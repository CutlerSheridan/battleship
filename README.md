# Battleship

## A deadly game of war on the high seas

Play by yourself or with a friend! Place your ships, attack your opponent, and try to sink the enemy's fleet before they can sink yours.

#### TODO NEXT

- if AI is attacking a ship, accidentally hits another ship, then resumes sinking the initial ship, make AI then attack the second ship

#### TODO LATER

##### Features

- add ability to place ships
- add ability to remove ship and replace it
- add dark screen between human player turns
- display opponent's ship statuses
- add ability for two people at separate computers to play by calling out coordinates

##### Behavior

- get ios touches to respond better when zoomed out
- extricate game loop from view.js somehow?

##### Style

- decide on style
- figure out how to display on mobile
- maybe add sounds for hits and misses?
- add brief border on attacked squares

#### DONE

_0.9.0_

- make AI pick adjacent space if last move was a hit and move before last was not
- test thoroughly
- write findDirectionalIncrement() and test
- make AI determine orientation after multiple adjacent hits
- make AI move in opposite direction if orientation is known and next space is not viable

_0.8.1_

- add win message

_0.8.0_

- add toggle to make a player computer-controlled
- make game restart upon confirming player control change
- make new game remember which players are human vs. computer

_0.7.3_

- make game work if both players are AI

_0.7.2_

- show which ship was hit

_0.7.1_

- add slight delay before computer goes

_0.7.0_

- add turns with computer
- add random opponent AI
- fix hits from computer displaying as secretlyOccupied

_0.6.4_

- refactor addAttackListeners() so it only applies each listener once

_0.6.3_

- add win detection
- make next button restart game after someone wins

_0.6.2_

- grey out next turn button until attack has been launched
- make current player indicator work
- make current player's grid show ships and current enemy's ships invisible
- optimize swapping visibility by giving each ship space a class regardless of whether they're visibile

_0.6.1_

- refactor view.js to remove some parameters, make more modular
  - make p1 and p2 variables accessible to all of view.js

_0.6.0_

- add button to go to next turn
- add turn swapping after each hit with human players
- make enemy grid unclickable after a successful attack

_0.5.3_

- write function to create player name elements
- move game setup to view.js

_0.5.2_

- make function to find edges and ends of ships so I can tailor their look accordingly instead of just having each sunk space look the same

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
