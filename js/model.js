const PHASES = {
    pre_game: 'pre_game',
    placement: 'placement',
    targeting: 'targeting', 
    firing: 'firing',
    maintenance: 'maintenance',
}

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

class State {
    constructor () {
        this.activePlayer = 0;
        this.players = [new Player("human", 1), new Player("computer", 0)];
        this.phase = PHASES.placement;
    }
}
