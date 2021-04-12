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

        this.renderer.createBoard(0, this.game.state.players[0].board.width,
                                     this.game.state.players[0].board.height);
        this.renderer.createBoard(1, this.game.state.players[1].board.width,
                                     this.game.state.players[1].board.height);

        this.renderer.updateStatus("Place your ship...");
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
