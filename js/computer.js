class Computer {
    constructor (boardSize) {
        this.boardSize = boardSize;
    }

    getTarget() {
        return this.randomSquare();
    }

    randomSquare () {
        let x = Math.floor(Math.random() * this.boardSize[0]);
        let y = Math.floor(Math.random() * this.boardSize[1]);

        return [x, y];
    }
}
