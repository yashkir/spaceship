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


        [0, 1].forEach((n) => {
            this.renderer.createBoard(n, this.game.state.players[n].board.width,
                                         this.game.state.players[n].board.height,
                                         this.boardClickHandler.bind(this));
        });

        this.renderer.attachHandlers(this.buttonClickHandler.bind(this))

        this.update();
    }

    buttonClickHandler(playerId, button) {
        if (!game.activePlayerIsHuman()) {
            return;
        }

        if (button == "fire" && this.game.state.phase == PHASES.targeting) {
            let targetId = game.state.players[playerId].targetPlayerId;
            console.log(this.game.resolveFire(targetId));
            this.renderer.convertSquareTags(targetId, "target", "attacked");
        }

        this.update();
    }

    boardClickHandler(playerId, x, y) {
        if (!game.activePlayerIsHuman()) {
            return;
        }

        let currentPlayer = this.game.state.activePlayer;
        let shipId = this.game.nextShipToPlace;
        switch (this.game.state.phase) {
            case PHASES.placement:
                if (shipId == null) {
                    break;
                }
                console.log(this.game.placeShip(currentPlayer, x, y));
                break;
            case PHASES.targeting:
                if (this.game.canPlayerSelectMore(currentPlayer)) {
                    console.log(this.game.selectSquare(playerId, x, y));
                    this.renderer.tagSquare(playerId, x, y, "target");
                }
                break;
            case PHASES.firing:
            case PHASES.maintenance:
        }

        this.update();
    }

    update () {
        this.game.update();

        for (let n of [0, 1]) {
            this.renderShips(this.game.state.players[n].ships, n);
            this.renderHits(this.game.state.players[n].board.hits, n);
        }

        let isHuman = game.state.players[game.state.activePlayer].isHuman;

        switch (this.game.state.phase) {
            case PHASES.placement:
                if (isHuman) {
                    let shipId = this.game.nextShipToPlace;
                    this.renderer.updateStatus(`Place your size ${shipId} ship...`);
                } else {
                    this.renderer.updateStatus(`Computer is placing ships`);
                }
                break;
            case PHASES.targeting:
                if (isHuman) {
                    this.renderer.updateStatus(`Select a target.`);
                } else {
                    this.renderer.updateStatus(`Computer is selecting targets...`);
                }
                break;
            default:
                break;
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
