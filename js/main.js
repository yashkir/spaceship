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
        this.ships = []
        this.targetsSelected = [];
    }
}

class Ship {
    constructor (size, position) {
        this.position = position;
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

        this.renderer = new Renderer();
        this.input = new Input(this.commandHandler);

        this.placeShips(this.state.players[0]);
        this.placeShips(this.state.players[1]);

        this.renderer.render();
        this.renderer.renderBoard(0, this.state.players[0]);
        this.renderer.renderBoard(1, this.state.players[1]);
        this.renderer.renderShips(this.state.players[0].ships, this.state.players[0].board, 0);
        this.renderer.renderShips(this.state.players[1].ships, this.state.players[1].board, 1);
    }

    placeShips (player) {
        let ship = new Ship(2, [2, 2]);
        player.ships.push(ship);
        ship = new Ship(2, [3, 2]);
        player.ships.push(ship);
    }

    selectSquare (board, position) {
       board.selectedSquares.push(position);
    }

    clearSelection (board) {
        board.selectedSquares = [];
    }

    commandHandler(player, command) {
        let c = command.split(",");
        switch(c[0]) {
            case "select":
                //"select 1 5 6" selects player 1 square at [5,6]
                this.selectSquare(this.state.players[c[1]].board, c[2][3]);
                break;
            case "clear":
                //"clear 1" clears all selections on player 1's board
                this.clearSelection(this.state.players[c[1]].board);
                break;
            case "fire":
                break;
            case "debug":
                console.log("debugging");
                break;
            default:
                break;
        }
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
    constructor() {
        this.squares = [];
    }

    render () {
        //this.targetElement.innerHTML = "Hello World";
    }

    renderBoard(number, player) {
        let board = player.board;

        this.squares[number] = Array(board.width);
        let targetElement = document.getElementById("board" + (number + 1));

        for (let i = 0; i < board.width; i++) {
            this.squares[number][i] = Array(board.height);
            for (let j = 0; j < board.height; j++) {
                let square = document.createElement("div");
                square.classList.add(SQUARE_CLASS);
                targetElement.append(square);

                this.squares[number][i][j] = square;
            }
            targetElement.append(document.createElement("br"));
        }
    }

    renderShips(ships, board, playerNum) {
        ships.forEach(ship => {
            let x = ship.position[0];
            let y = ship.position[1];
            console.log(x, y);
            this.squares[playerNum][x][y].classList.add("ship");
        });
    }
}

class Input {
    constructor (commandHandler, type = "console") {
        this.type = type;
        this.dispatchTo = commandHandler;

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

        this.dispatchTo(null, message);
    }
}

// --- INIT ---------------------------
// The SpaceShipGame object should handle everything.
let game = new SpaceShipGame();
