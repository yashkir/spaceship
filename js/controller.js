class Controller {
    constructor() {
        this.renderer = new HTMLView();
        this.renderer.attachHandlers(this.buttonClickHandler.bind(this))

        this.newGame();
    }

    newGame() {
        this.game = new SpaceShipGame();

        [0, 1].forEach((n) => {
            this.renderer.createBoard(n, this.game.state.players[n].board.width,
                                         this.game.state.players[n].board.height,
                                         this.boardClickHandler.bind(this));
        });

        this.renderer.setNames([this.game.state.players[0].name,
                                this.game.state.players[1].name]);

        this.update();
    }

    buttonClickHandler(playerId, button) {
        if (!this.game.activePlayerIsHuman() ||
            this.game.state.phase == PHASES.end) {
            return;
        }

        if (button == "fire" && this.game.state.phase == PHASES.targeting) {
            let targetId = this.game.state.players[playerId].targetPlayerId;
            this.fireOn(targetId);
        }

        if (button == "clear" && this.game.state.phase == PHASES.targeting) {
            let targetId = this.game.state.players[playerId].targetPlayerId;
            this.game.log(this.game.clearSelection(targetId));
            this.renderer.convertSquareTags(targetId, "target", null);
        }

        this.update();
    }

    boardClickHandler(playerId, x, y) {
        if (!this.game.activePlayerIsHuman() ||
            this.game.state.phase == PHASES.end) {
            return;
        }

        let currentPlayerId = this.game.state.activePlayerId;
        let shipId = this.game.nextShipToPlace;
        switch (this.game.state.phase) {
            case PHASES.placement:
                if (shipId == null || currentPlayerId != playerId) {
                    break;
                }
                this.game.log(this.game.placeShip(currentPlayerId, x, y));
                break;
            case PHASES.targeting:
                // TODO this breaks multi-shot and is not concerned with who is firing.
                if (findPointInList([x, y], this.game.state.players[playerId].board.selectedSquares) != -1) {
                    this.fireOn(playerId);
                }

                if (this.game.canPlayerSelectMore(currentPlayerId) &&
                    playerId != this.game.state.activePlayerId &&
                    findPointInList([x, y], this.game.state.players[playerId].board.attacks) == -1)
                {
                    this.game.log(this.game.selectSquare(playerId, x, y));
                    this.renderer.tagSquare(playerId, x, y, "target");
                }
                break;
            case PHASES.firing:
                break;
            case PHASES.maintenance:
                break;
            default:
                break;
        }

        this.game.update();
        this.update();
    }

    update() {
        this.game.update();

        for (let n of [0, 1]) {
            this.renderShipStatuses(this.game.state.players[n].ships, n);
            this.renderShips(this.game.state.players[n].ships, n);
            this.renderHits(this.game.state.players[n].board.hits, n);
            this.renderAttacks(this.game.state.players[n].board.attacks, n);
        }

        if (this.game.state.losingPlayer) {
            // TODO allow for a restart
            this.renderer.updateStatus(`Player ${this.game.state.losingPlayer.name} has LOST!<br>`);

            if (!this.newGameDisplayed) {
                this.renderer.createNewGameButton(() => this.newGame());
                this.newGameDisplayed = true;
            }

            return;
        }

        let isHuman = this.game.state.activePlayer.isHuman;

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
                    this.renderer.updateStatus(`Select a target and click FIRE.`);
                } else {
                    this.renderer.updateStatus(`Computer is selecting targets...`);
                }
                break;
            default:
                break;
        }
    }
    
    renderShipStatuses(ships, playerNum) {
        let statuses = [];
        for (let ship of ships) {
            status = `${ship.name} ${!ship.isAlive ? '(dead)': ''}`;
            statuses.push(status);
        }
        this.renderer.setShipStatus(playerNum, statuses);
    }

    renderShips(ships, playerNum) {
        if (!this.game.state.players[playerNum].isHuman) {
            return;
        }

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

    renderAttacks(attacks, boardId) {
        for (let attack of attacks) {
            let x = attack[0];
            let y = attack[1];
            this.renderer.tagSquare(boardId, x, y, "attacked")
        }
    }

    fireOn(targetId) {
        this.game.log(this.game.resolveFire(targetId));
        this.renderer.convertSquareTags(targetId, "target", "attacked");
    }
}
