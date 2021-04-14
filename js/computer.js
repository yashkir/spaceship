class Computer {
    constructor (boardSize) {
        this.boardSize = boardSize;
        this.enemyBoard = Array(boardSize[0]).fill().map(() => Array(boardSize[1])); 
        this.possibleAttacks = [];
        for (let x = 0; x < boardSize[0]; x++) {
            for (let y = 0; y < boardSize[1]; y++) {
                this.possibleAttacks.push([x, y]);
            }
        }

    }

    getTarget() {
        return this.possibleAttacks.splice(
            Math.floor(Math.random() * this.possibleAttacks.length), 1)[0];
    }

    randomSquare () {
        let x = Math.floor(Math.random() * this.boardSize[0]);
        let y = Math.floor(Math.random() * this.boardSize[1]);

        return [x, y];
    }
}
