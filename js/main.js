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

        this.renderer.render();
        this.renderer.renderBoard(0, this.game.state.players[0]);
        this.renderer.renderBoard(1, this.game.state.players[1]);
    }

    update () {
        this.renderer.renderShips(this.game.state.players[0].ships, 
                                  this.game.state.players[0].board, 0);
        this.renderer.renderShips(this.game.state.players[1].ships,
                                  this.game.state.players[1].board, 1);
    }
}

let game = new SpaceShipGame();
let controller = new Controller(game);
