Outline
=======
We have two PLAYERS, each owning a BOARD with SHIPS.

We prompt the player to place SHIPS on the BOARD.

When all ships are placed we prompt player to select a TARGET for his SALVO
(1-5 shots). After SALVO is CONFIRMED we check for HITS, SINKS, and VICTORY. We
LOG the RESULTS to the CONSOLE and proceed with the COMPUTER TURN.

The computer executes the same kind of turn with its TARGETING ALGORITHM (can
be random to begin with). TURN is passed back to PLAYER until VICTORY is
achieved by one.


MODEL
=====

```
gameState { activePlayer,
            turnNum,
            phase = enum(newGameScreen, placingShips, selectingTargets, firing) }
players { computer,  human }
players.human =  {
  targetsChosen []
  board {}
    attacksReceived []
    ships []
      { squaresOccupied, alive }
}
```

New Game Sreen
===============

Just show a START GAME button

Place Ships Loop
================

```
display message "choose a place for your SHIP"
player clicks square
  place ship
  display message "click again to confirm or CANCEL"
  player click cancel
    remove ship and break
  else if player clicks ship
    add ship to board.ships[]
    prompt for next ship

if all ship are done
  activePlayer = computer
  computer places ships randomly (check collisions)

proceed to Game Loop
```

Game Loop
=======================

```
set phase = selectingTargets

if player clicks square
  add to targetsChosen

if player clicks FIRE
  change phase to 'firing'
  if hit or miss 
    mark as such, log
  if sunk
    mark as such, log
  print results to console
  render result to screen

  if no more enemy ships
    END GAME
  else 
    phase = selectingTargets
    activePlayer = computer

computer selects targets (AI)
computer fires as player

turnNum++
activePlayer = human
```
