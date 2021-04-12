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

        let handler = (...args) => this.clickHandler(...args);
        [0, 1].forEach((n) => {
            this.renderer.createBoard(n, this.game.state.players[n].board.width,
                                         this.game.state.players[n].board.height, handler);
        });

        this.renderer.updateStatus("Place your ship...");
    }

    clickHandler(playerId, x, y) {
        let shipId = 2;
        this.game.commandHandler(`place ${playerId} ${x} ${y}`);
    }

    update () {
        this.renderShips(this.game.state.players[0].ships, 0);
        this.renderShips(this.game.state.players[1].ships, 1);
    }

    renderShips(ships, playerNum) {
        ships.forEach(ship => {
            let x = ship.position[0];
            let y = ship.position[1];
            this.renderer.tagSquare(playerNum, x, y, "ship");
        });
    }
}


let game = new SpaceShipGame();
let controller = new Controller(game);

// Test setup
{
    game.placeShip(0, 1, 2, 2);
    game.placeShip(1, 1, 3, 2);
    controller.update();
}
