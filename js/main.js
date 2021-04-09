//gameState { activePlayer,
            //turnNum,
            //phase = enum(newGameScreen, placingShips, selectingTargets, firing) }
//players { computer,  human }
//players.human =  {
  //targetsChosen []
  //board {}
    //attacksReceived []
    //ships []
      //{ squaresOccupied, alive }
//}

// --- MODEL --------------------------
class Board {
    constructor (width = 10, height = 10) {
        this.squares = new Array(width);
        for (let i = 0; i < this.squares.length; i++) {
            this.squares[i] = Array(height).fill(0);
        };
    }
}

class Player {
    constructor (name) {
        this.name = name;
        this.board = new Board();
    }
}

class Ship {
    constructor (size) {
        this.parts = 0;
        switch (size) {
            case 1:
                this.parts = [0, 0];
                break;
            case 2:
                this.parts = [[0, 0], [0, 1]];
                break;
            default:
                break;
        }
    }
}
// --- CONTROLLER ---------------------
class SpaceShipGame {
    constructor () {
        this.state = {};
        this.state.activePlayer = 0;
        this.state.players = [new Player("human"), new Player("computer")];
        this.state.phase = 0;
    }
}

// --- VIEW ---------------------------
//
// This is the ONLY area that should interact with the DOM
//

/* 
 * Renders the game state to the target element.
 */
class Renderer {
    constructor(game, targetElement) {
        this.game = game;
        this.targetElement = targetElement;
    }

    render () {
        this.targetElement.innerHTML = "Hello World";
    }
}

class Input {
    constructor (type = "console") {
        this.type = type;
        if (type == "console") {
            let button = document.getElementById("command-prompt-btn");
            button.addEventListener("click", function (evt) {
                let input = document.getElementById("command-prompt");
                console.log("Player -> " + input.value);
            });
        }
    }
}

// --- INIT ---------------------------
let game = new SpaceShipGame();
let renderer = new Renderer(game, document.getElementById("boards"));
let input = new Input();

console.log(game.state);
renderer.render();

