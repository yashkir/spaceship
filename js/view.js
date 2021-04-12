let SQUARE_CLASS = "square";

class HTMLView {
    constructor() {
        this.boards = [document.getElementById("board1"),
                       document.getElementById("board2")];
        this.squares = [];
        this.statusEl = document.getElementById("status-banner");
    }

    createBoard(boardId, width, height) {
        this.squares[boardId] = Array(width);
        let targetElement = this.boards[boardId];

        for (let i = 0; i < width; i++) {
            this.squares[boardId][i] = Array(height);
            for (let j = 0; j < height; j++) {
                let square = document.createElement("div");
                square.classList.add(SQUARE_CLASS);
                targetElement.append(square);

                this.squares[boardId][i][j] = square;
            }
            targetElement.append(document.createElement("br"));
        }
    }

    tagSquare(boardId, x, y, tag) {
        this.squares[boardId][x][y].classList.add(tag);
    }

    updateStatus(message) {
        this.statusEl.innerHTML = message;
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

        let response = this.dispatchTo(message);
        console.log(response);

    }
}
