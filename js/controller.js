class Controller {
    constructor (game) {
        this.game = game;
        this.renderer = new HTMLView();
        this.prompt = new CommandPrompt(command => { 
            let message = game.commandHandler(command)
            this.update()
            return message;
        });


        [0, 1].forEach((n) => {
            this.renderer.createBoard(n, this.game.state.players[n].board.width,
                                         this.game.state.players[n].board.height,
                                         this.boardClickHandler.bind(this));
        });

        this.renderer.setNames([this.game.state.players[0].name,
                                this.game.state.players[1].name]);

        this.renderer.attachHandlers(this.buttonClickHandler.bind(this))

        this.update();
    }

    buttonClickHandler(playerId, button) {
        if (!game.activePlayerIsHuman() ||
            game.state.phase == PHASES.end) {
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
        if (!game.activePlayerIsHuman() ||
            game.state.phase == PHASES.end) {
            return;
        }

        let currentPlayer = this.game.state.activePlayerId;
        let shipId = this.game.nextShipToPlace;
        switch (this.game.state.phase) {
            case PHASES.placement:
                if (shipId == null) {
                    break;
                }
                console.log(this.game.placeShip(currentPlayer, x, y));
                break;
            case PHASES.targeting:
                if (this.game.canPlayerSelectMore(currentPlayer) &&
                    playerId != this.game.state.activePlayerId)
                {
                    console.log(this.game.selectSquare(playerId, x, y));
                    this.renderer.tagSquare(playerId, x, y, "target");
                }
                break;
            case PHASES.firing:
            case PHASES.maintenance:
        }

        this.game.update();
        this.update();
    }

    update () {
        this.game.update();

        for (let n of [0, 1]) {
            this.renderShipStatuses(this.game.state.players[n].ships, n);
            this.renderShips(this.game.state.players[n].ships, n);
            this.renderHits(this.game.state.players[n].board.hits, n);
            this.renderAttacks(this.game.state.players[n].board.attacks, n);
        }

        if (game.state.losingPlayer) {
            // TODO allow for a restart
            this.renderer.updateStatus(`Player ${game.state.losingPlayer.name} has LOST!`);
            return;
        }

        let isHuman = game.state.activePlayer.isHuman;

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
    
    renderShipStatuses (ships, playerNum) {
        let statuses = [];
        for (let ship of ships) {
            status = `${ship.name} ${!ship.isAlive ? '(dead)': ''}`;
            statuses.push(status);
        }
        this.renderer.setShipStatus(playerNum, statuses);
    }

    renderShips(ships, playerNum) {
        if (!game.state.players[playerNum].isHuman) {
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
}
