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

        this.history = [];
        this.plan = [];
        this.lastHit;
    }

    getTarget() {
        let target = null;

        // If we got a hit, make a plan to explore around it
        if (this.lastHit == true) {
            let [x, y] = this.history[this.history.length - 1];

            // TODO do the possibleAttack checking here
            this.plan.push([x, y - 1],
                 [x - 1, y]    ,     [x + 1, y],
                           [x, y + 1]);
        }

        // If we have a plan, use it
        while (this.plan.length > 0) {
            target = this.plan.splice(getRndInt(0, this.plan.length), 1)[0];
            let idx = findPointInList(target, this.possibleAttacks)

            if (idx != -1) {
                this.possibleAttacks.splice(idx, 1);
                break;
            }
        }

        // Otherwise pick a random square
        if (!target) {
            target = this.possibleAttacks.splice(getRndInt(0, this.possibleAttacks.length), 1)[0];
        }

        this.history.push(target);
        this.lastHit = false;

        return target;
    }

    informLastTargetWasHit() {
        this.lastHit = true;
    }

    randomSquare () {
        let x = Math.floor(Math.random() * this.boardSize[0]);
        let y = Math.floor(Math.random() * this.boardSize[1]);

        return [x, y];
    }
}
