class Controller {
    constructor (game) {
        this.game = game;
        this.input = new Input(this.commandHandler);
        this.renderer = new HTMLView();

        this.renderer.render();
        this.renderer.renderBoard(0, this.game.state.players[0]);
        this.renderer.renderBoard(1, this.game.state.players[1]);
        this.renderer.renderShips(this.game.state.players[0].ships, this.game.state.players[0].board, 0);
        this.renderer.renderShips(this.game.state.players[1].ships, this.game.state.players[1].board, 1);
    }
}

let game = new SpaceShipGame();
let controller = new Controller(game);
