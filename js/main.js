let game = new SpaceShipGame();
// Test setup
{
    game.placeShip(1, 1, 3, 2);
    game.placeShip(1, 2, 5, 5);
    game.placeShip(1, 3, 7, 7);
}
let controller = new Controller(game);
