const BOARD_SIZE = [10, 10];
const PHASES = {
    pre_game: 'pre_game',
    placement: 'placement',
    targeting: 'targeting', 
    firing: 'firing',
    maintenance: 'maintenance',
}

class Board {
    constructor () {
        this.width = BOARD_SIZE[0];
        this.height = BOARD_SIZE[1];
        this.squares = new Array(this.width);
        for (let i = 0; i < this.squares.length; i++) {
            this.squares[i] = Array(this.height).fill(0);
        };
        this.selectedSquares = [];
        this.hits = []
        this.attacks = [];
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
        this.totalShipSquares = 0;
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
        this.size = size;
        this.position = position;
        this.hits = 0;
        switch (parseInt(size)) {
            case 1:
                this.name = "Fighter";
                this.parts = [[0, 0]];
                break;
            case 2:
                this.name = "Cruiser";
                this.parts = [[0, 0], [0, 1]];
                break;
            case 3:
                this.parts = [[0, 0], [1, 0], [2, 0]];
                this.name = "Battleship";
                break;
            default:
                break;
        }
    }

    get isAlive () {
        return this.hits < this.size;
    }
}

class State {
    constructor () {
        this.activePlayerId = 0;
        this.losingPlayerId = null;
        this.players = [new Player("human", 1), new Player("computer", 0)];
        this.phase = PHASES.placement;
        this.players[1].ai = new Computer(BOARD_SIZE);
    }

    get activePlayer () {
        return this.players[this.activePlayerId];
    }
}
