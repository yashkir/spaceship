let SQUARE_CLASS = "square";

// --- MODEL --------------------------
class Board {
    constructor (width = 10, height = 10) {
        this.width = width;
        this.height = height;
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
        this.targetsSelected = [];
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

        this.renderer = new Renderer(this);
        this.input = new Input();

        this.renderer.render();
        this.renderer.renderBoard(1, this.state.players[0].board);
        this.renderer.renderBoard(2, this.state.players[1].board);
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
    constructor(game) {
        this.game = game;
    }

    render () {
        //this.targetElement.innerHTML = "Hello World";
    }

    renderBoard(number, board) {
        let targetElement = document.getElementById("board" + number);
        for (let i = 0; i < board.width; i++) {
            for (let i = 0; i < board.width; i++) {
                let square = document.createElement("div");
                square.classList.add(SQUARE_CLASS);
                targetElement.append(square);
            }
            targetElement.append(document.createElement("br"));
        }
    }
}

class Input {
    constructor (type = "console") {
        this.type = type;

        if (type == "console") {
            this.inputField = document.getElementById("command-prompt");
            let button = document.getElementById("command-prompt-btn");

            this.inputField.addEventListener("keyup", (evt) => {
                if (event.code == "Enter") {
                    evt.preventDefault();
                    this.sendPrompt();
                }
            });

            button.addEventListener("click", () => {
                this.sendPrompt();
            });
        } else {
            throw Error("Invalid input type specified.");
        }
    }

    sendPrompt () {
        this.commandHandler(this.inputField.value);
        this.inputField.value = "";
    }

    commandHandler (message) {
        let log = document.getElementById("command-history");
        let commands = {
            'new game' : () => console.log("new game started"),
        }
        console.log("Player -> " + message);
        let messageEl = document.createElement("span");
        messageEl.innerHTML = "Player: " + message + "<br>";
        log.prepend(messageEl);
        
        if (Object.keys(commands).includes(message)) {
            commands[message]();
        }
    }
}

// --- INIT ---------------------------
// The SpaceShipGame object should handle everything.
let game = new SpaceShipGame();
