class SpaceShipGame {
    constructor () {
        this.state = new State();
    }

    update () {
        switch (this.state.phase) {
            case PHASES.placement:
                if (this.nextShipToPlace == null) {
                    //FIX, this will calculate after player is done only
                    for (let player of this.state.players) {
                        for (let ship of player.ships) {
                            player.totalShipSquares += ship.size;
                        }
                    }
                    this.state.phase = PHASES.targeting;
                }
                break;
            case PHASES.targeting:
                break;
            case PHASES.firing:
            case PHASES.maintenance:
                //FIX only for two players
                for (let player of this.state.players) {
                    if (player.board.hits.length >= player.totalShipSquares) {
                        this.state.losingPlayer = player;
                    }
                }
                this.state.activePlayer = ++this.state.activePlayer % 2;
                //FIX below is a hack to clear targets as player is cycled
                this.state.players[this.state.activePlayer].board.selectedSquares = [];
                this.state.phase = PHASES.targeting;
                if (!this.activePlayerIsHuman()) {
                    console.log(this.selectSquare(0, ...this.activePlayer.ai.randomSquare()));
                    console.log(this.resolveFire(0));
                    this.state.phase = PHASES.maintenance;
                    this.update();
                }
            default:
                break
        }
    }

    get activePlayer () {
        return this.state.players[this.state.activePlayer];
    }

    placeShip (playerId, x, y) {
        let shipId = this.state.players[playerId].getNextShipToPlace();
        let ship = new Ship(shipId, [parseInt(x), parseInt(y)]);
        this.state.players[playerId].ships.push(ship);
        return `placed player ${playerId} ship ${shipId} at ${x}, ${y}`;
    }

    selectSquare (playerId, x, y) {
        let board = this.state.players[playerId].board;

        if (board.selectedSquares.length >= this.state.players[playerId].maxShots) {
            return `maximum targets selected`;
        } else {
            board.selectedSquares.push([x, y]);
            return `selected player ${playerId} square at ${x}, ${y}`;
        }
    }

    clearSelection (playerId) {
        this.state.players[playerId].board.selectedSquares = [];
        return `cleared selection on player ${playerId} board`;
    }

    resolveFire (targetId) {
        this.state.phase = PHASES.firing;

        let ships = this.state.players[targetId].ships;
        let board = this.state.players[targetId].board;

        let hitCount = 0;

        for (let square of board.selectedSquares) {
            board.attacks.push(square);
            for (let ship of ships) {
                for (let part of ship.parts) { 
                    let position = [part[0] + ship.position[0],
                                    part[1] + ship.position[1]]
                    if (square[0] == position[0] && square[1] == position[1]) {
                        board.hits.push(position);
                        ship.hits++;
                        hitCount++;
                    }
                }
            }
        }

        this.state.phase = PHASES.maintenance;

        return `resolving fire phase on player ${targetId}: ${hitCount} hits`;
    };

    activePlayerIsHuman() {
        return this.state.players[this.state.activePlayer].isHuman;
    }

    get nextShipToPlace () {
        let currentPlayer = this.state.activePlayer;
        let shipId = this.state.players[currentPlayer].peekNextShipToPlace();
        return shipId;
    }

    canPlayerSelectMore (playerId) {
        let player = this.state.players[playerId];
        let target = this.state.players[player.targetPlayerId];

        if (target.board.selectedSquares.length < player.maxShots) {
            return true;
        }
    }

    commandHandler(command) {
        let c = command.split(" ");
        switch(c[0]) {
            case "place":
                return this.placeShip(c[1], c[2], c[3], c[4]);
                break;
            case "select":
                //"select 1 5 6" selects player 1 square at [5,6]
                return this.selectSquare(c[1], c[2], c[3]);
                break;
            case "clear":
                //"clear 1" clears all selections on player 1's board
                return this.clearSelection(c[1]);
                break;
            case "fire":
                return this.resolveFire(c[1]);
                break;
            case "debug":
                console.log("debugging");
                break;
            default:
                break;
        }
    }
}

