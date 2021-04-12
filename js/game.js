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
    constructor (name) {
        this.name = name;
        this.board = new Board();
        this.ships = []
        this.targetsSelected = [];
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
            default:
                break;
        }
    }
}

// --- CONTROLLER ---------------------
class SpaceShipGame {
    constructor () {
        this.state = {};
        this.state.activePlayer = 0;
        this.state.players = [new Player("human"), new Player("computer")];
        this.state.phase = PHASES.placement;
    }

    placeShip (playerId, shipId, x, y) {
        let ship = new Ship(shipId, [parseInt(x), parseInt(y)]);
        this.state.players[playerId].ships.push(ship);
        return `placed player ${playerId} ship ${shipId} at ${x}, ${y}`;
    }

    selectSquare (playerId, x, y) {
        let board = this.state.players[playerId].board;
        board.selectedSquares.push([x, y]);
        return `selected player ${playerId} square at ${x}, ${y}`;
    }

    clearSelection (playerId) {
        this.state.players[playerId].board.selectedSquares = [];
        return `cleared selection on player ${playerId} board`;
    }

    resolveFire (targetId) {
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
        return `resolving fire phase on player ${targetId}: ${hitCount} hits`;
    };

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

