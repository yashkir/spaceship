let SQUARE_CLASS = "square";

class HTMLView {
    constructor() {
        this.boards = [document.getElementById("board1"),
                       document.getElementById("board2")];
        this.squares = [];
    }

    render () {
        //this.targetElement.innerHTML = "Hello World";
    }

    renderBoard(number, player) {
        let board = player.board;

        this.squares[number] = Array(board.width);
        let targetElement = this.boards[number];

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
