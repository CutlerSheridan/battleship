# Battleship

## A deadly game of war on the high seas

Play by yourself, with a friend, or watch two AIs play each other! Place your ships, attack your opponent, and try to sink the enemy's fleet before they can sink yours.

#### TODO NEXT

- add credit

#### TODO LATER

##### Features

- display players' ship statuses

##### Behavior

- figure out how to turn ships on mobile
- get ios touches to respond better when zoomed out

##### Style

- reformat ui position for mobile
- if mobile portrait, display note to turn landscape
- make sure ship pegs don't shift upon sinking

##### Maybe

- make player's own ships display with borders
- make out-of-bound edge highlight red when relocating your ship
- extricate game loop from view.js somehow?
- add ability for two people at separate computers to play by calling out coordinates
- start game with all ships off the board instead of in corner
- add sounds for hits and misses

#### DONE

_0.13.4_

- make Next button bigger
- style hit indication text
- style instructions

_0.13.3_

- make win banner cover grids
- make win banner fade in
- make win banner fade out upon restarting game
- make restarting game to change a player type work again

_0.13.2_

- separate player name elements to either side of next button
- move results and instructions into a container on the next line
- style player indicators as sort of slanted grey boxes with white outlines
- make player indicators both unhighlighted during player transition for two humans
- get current player indicator to switch if 1+ player is not human
- add gradient to name boxes

_0.13.1_

- make ships not appear until round zero
- add breakpoints to make grid smaller on mobile

_0.13.0_

- color grids
- style Next button
- make empty hit spaces have a lighter background

_0.12.1_

- when one human one AI, indicate after round zero that it's the human's turn again

_0.12.0_

- add dark screen between two human players' turns
- add text indicating who is next during transition screen
- make next player indicator continue to show after round zero

_0.11.11_

- make computer rearrange its ships during Round Zero

_0.11.10_

- make humans start game with ships in corner

_0.11.9_

- don't let rearranging hovered squares retain class on placement of ship
- fix it so if you place a ship then pick it up from the same place it shows the ship hover

_0.11.8_

- get hovered squares to turn when you turn a ship
- get squares to become hovered initially upon picking up a ship instead of when you start moving it
- remove hover handler upon placing a ship
- make it so when you turn a ship, you can place it in a space that would have previously been invalid

_0.11.7_

- get hovered square under cursor to match adjacent potential squares
- get hovered potential squares to show on occupied spaces

_0.11.6_

- get hovered potential squares to show on empty spaces

_0.11.5_

- refactor areSpacesAvail...() by extracting getPotentialShipSpaces() which returns an array of the potential ship spaces (this is to prepare for the hover behavior while rearranging ships)

_0.11.4_

- add ability to turn ships when rearranging by pressing any key
- add placeholder round zero instructions
- during round zero, grey out 'next' button if a ship is being relocated

_0.11.3_

- refactor areSpacesAvail() to accomodate use for held ships

_0.11.2_

- add ability to remove ship and replace it
- make sure relocLift listeners are removed after each round zero turn

_0.11.1_

- write Gameboard.removeShip()
- refactor displayShipsOnGrid() to remove occupied classes if no ship is present
- get round zero to add reloc listeners to ships so player can remove them from the board

_0.11.0_

- rewrite model.Gameboard.placeShip() to accomodate ships being placed while held from any spot

_0.10.3_

- get game working when p1 = human, p2 = computer--currently, when p1 has first real turn, attacks don't register
  - ohhhh, when p2 is a computer, it attaches addAttackListeners to the next button, which the computer doesn't press because it goes straight back to p1's turn
- get both p1 AI and p2 AI to make their round zero move without human having to click next
- fix bug where, when one human and one computer, if the next button is still greyed out, if it's human's turn and you click to toggle a player type, the next button correctly changes to say restart but if you unclick the toggle so the player types remain unchanged, the next button remains as restart; clicking restart correctly begins the computer's turn, but potentially without the player having gone--it should change the text back to next and it should go back to being greyed out; text then forever remains restart [this one went away on its own]

_0.10.2_

- get game working when p1 = computer, p2 = human
- make sure game works when you interrupt round zero to switch to a game with a different player makeup
- fix whatever is happening with the grids remaining clickable after attacking

_0.10.1_

- add a turnNum property to Player objects for determining if Round Zero behavior should execute
- add startRoundZero() as a possible path in startTurn()
- make game restart remove round zero listeners if that's interrupted
- refactor toggleShipVisibility() to accept player parameter instead of gridElement
- refactor toggleShipVisibility() to use new getAllShipElements() function
- remove assignAllShipSpacesClass() function
- stop p2's round zero turn allowing p1 to attack p2

_0.10.0_

- extract switchTurns() into its own function
- add useless round zero for two humans
- get round zero working with two computers

_0.9.10_

- make canShipBeDirection() use length of hit ship if that's the basis
- clean up console.logs
- make sure game works with changes

_0.9.9_

- fix canShipBeDirection()

_0.9.8_

- change canShipBeHorizontal() to canShipBeDirection()
- mostly delete isGuessPossible() and just use canShipBeDirection() twice inside it instead

_0.9.7_

- make sure isGuessPossible() works in actual game
- make it so, if AI hits a ship that only has room vertically, it won't try attacking horizontally first

_0.9.6_

- simplify isGuessPossible()
- get it working on right edge
- get it working on left edge

_0.9.5_

- prevent AI from attacking too-small areas

_0.9.4_

- get AI working in the actual game

_0.9.3_

- completely rewrite pickComputerMove() AI to be much more elegant and reliable
- make it pass all preexisting tests

_0.9.2_

- add another test for hitting a vertical ship then continuing to guess until it finds it

_0.9.1_

- if AI is attacking a ship, accidentally hits another ship, then resumes sinking the initial ship, make AI then attack the second ship
- if AI attempts to return to second ship and misses, try another direction
- if AI hits a ship then misses, make it keep trying other directions

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
