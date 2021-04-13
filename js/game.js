const PHASES = {
    pre_game: 'pre_game',
    placement: 'placement',
    targeting: 'targeting', 
    firing: 'firing',
    maintenance: 'maintenance',
}

// --- MODEL --------------------------
class Board {
    constructor (width = 10, height = 10) {
        this.width = width;
        this.height = height;
        this.squares = new Array(width);
        for (let i = 0; i < this.squares.length; i++) {
            this.squares[i] = Array(height).fill(0);
        };
        this.selectedSquares = [];
        this.hits = []
    }
}

class Player {
    constructor (name, targetPlayerId) {
        this.name = name;
        this.isHuman = name === "computer" ? false : true;
        this.board = new Board();
        this.ships = []
        this.targetsSelected = [];
        this.targetPlayerId = targetPlayerId;
        this.maxShots = 1;
        this.shipsToPlace = [3, 2, 1];
    }

    peekNextShipToPlace () {
        return this.shipsToPlace.length ? this.shipsToPlace[0]: null;
    }

    getNextShipToPlace () {
        return this.shipsToPlace.shift();
    }

}

class Ship {
    constructor (size, position) {
        this.position = position;
        switch (parseInt(size)) {
            case 1:
                this.parts = [[0, 0]];
                break;
            case 2:
                this.parts = [[0, 0], [0, 1]];
                break;
            case 3:
                this.parts = [[0, 0], [1, 0], [2, 0]];
                break;
            default:
                break;
        }
    }
}

class Info {
    constructor (game) {
        this.game = game;
    }

    get nextShipToPlace () {
        let currentPlayer = this.game.state.activePlayer;
        let shipId = this.game.state.players[currentPlayer].peekNextShipToPlace();
        return shipId;
    }
}

// --- CONTROLLER ---------------------
class SpaceShipGame {
    constructor () {
        this.state = {};
        this.state.activePlayer = 0;
        this.state.players = [new Player("human", 1), new Player("computer", 0)];
        this.state.phase = PHASES.placement;
        this.info = new Info(this);
    }

    update () {
        switch (this.state.phase) {
            case PHASES.placement:
                if (this.info.nextShipToPlace == null) {
                    this.state.phase = PHASES.targeting;
                }
                break;
            case PHASES.targeting:
                break;
            case PHASES.firing:
            case PHASES.maintenance:
                //FIX only for two players
                this.state.activePlayer = ++this.state.activePlayer % 2;
                //FIX below is a hack to clear targets as player is cycled
                this.state.players[this.state.activePlayer].board.selectedSquares = [];
                this.state.phase = PHASES.targeting;
            default:
                break
        }
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
            for (let ship of ships) {
                for (let part of ship.parts) { 
                    let position = [part[0] + ship.position[0],
                                    part[1] + ship.position[1]]
                    if (square[0] == position[0] && square[1] == position[1]) {
                        board.hits.push(position);
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

