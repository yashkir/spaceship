// --- MODEL --------------------------
class Board {
    constructor (width = 10, height = 10) {
        this.width = width;
        this.height = height;
        this.squares = new Array(width);
        for (let i = 0; i < this.squares.length; i++) {
            this.squares[i] = Array(height).fill(0);
        };
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
        switch (size) {
            case 1:
                this.parts = [0, 0];
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
        this.state.phase = 0;
    }

    placeShip (playerId, shipId, x, y) {
        let ship = new Ship(shipId, [x, y]);
        this.state.players[playerId].ships.push(ship);
        return `placed player ${playerId} ship ${shipId} at ${x}, ${y}`;
    }

    selectSquare (board, position) {
       board.selectedSquares.push(position);
    }

    clearSelection (board) {
        board.selectedSquares = [];
    }

    commandHandler(command) {
        let c = command.split(" ");
        switch(c[0]) {
            case "place":
                return this.placeShip(c[1], c[2], c[3], c[4]);
                break;
            case "select":
                //"select 1 5 6" selects player 1 square at [5,6]
                this.selectSquare(this.state.players[c[1]].board, c[2][3]);
                break;
            case "clear":
                //"clear 1" clears all selections on player 1's board
                this.clearSelection(this.state.players[c[1]].board);
                break;
            case "fire":
                break;
            case "debug":
                console.log("debugging");
                break;
            default:
                break;
        }
    }
}

