class Controller {
    constructor (game) {
        this.game = game;
        this.renderer = new HTMLView();
        this.input = new Input(command => { 
            let message = game.commandHandler(command)
            // Update the view on every input
            this.update()
            return message;
        });

        let handler = (...args) => {
            this.clickHandler(...args)
        };

        [0, 1].forEach((n) => {
            this.renderer.createBoard(n, this.game.state.players[n].board.width,
                                         this.game.state.players[n].board.height, handler);
        });

        this.renderer.updateStatus("Place your ship...");
    }

    clickHandler(playerId, x, y) {
        let shipId = 2;
        switch (this.game.state.phase) {
            case PHASES.placement:
                console.log(this.game.placeShip(playerId, shipId, x, y));
                break;
            case PHASES.targeting:
                console.log(this.game.selectSquare(playerId, x, y));
                break;
            case PHASES.firing:
            case PHASES.maintenance:
        }
        this.update();
    }

    update () {
        for (let n of [0, 1]) {
            this.renderShips(this.game.state.players[n].ships, n);
            this.renderHits(this.game.state.players[n].board.hits, n);
        }
    }

    renderShips(ships, playerNum) {
        ships.forEach(ship => {
            for (let part of ship.parts) {
                let x = ship.position[0] + part[0];
                let y = ship.position[1] + part[1];
                this.renderer.tagSquare(playerNum, x, y, "ship");
            }
        });
    }

    renderHits(hits, boardId) {
        for (let hit of hits) {
            let x = hit[0];
            let y = hit[1];
            this.renderer.tagSquare(boardId, x, y, "hit")
        }
    }
}
