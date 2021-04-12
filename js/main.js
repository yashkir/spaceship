let game = new SpaceShipGame();
let controller = new Controller(game);

// Test setup
{
    game.placeShip(0, 1, 2, 2);
    game.placeShip(0, 1, 5, 2);
    game.placeShip(1, 1, 3, 2);
    game.selectSquare(0, 2, 2);
    game.resolveFire(0);
    //game.clearSelection();
    controller.update();
}
