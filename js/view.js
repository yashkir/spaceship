let SQUARE_CLASS = "square";

class HTMLView {
    constructor() {
        this.boards = [document.getElementById("board1"),
                       document.getElementById("board2")];
        this.squares = [];
        this.statusEl = document.getElementById("status-banner");

        this.buttons = document.getElementById("p1-controls");
        this.playerNames = [document.getElementById("p1-name"),
                            document.getElementById("p2-name")];
        this.shipStatuses = [document.getElementById("p1-ships"),
                            document.getElementById("p2-ships")];
    }

    attachHandlers(buttonClickHandler) {
        this.buttons.addEventListener("click", (evt) => {
            if (evt.target.classList.contains("controls") &&
                evt.target.tagName == "BUTTON") 
            {
                //FIX currently hard coded to player 1
                //we are just slicing off the 'p1-' of the id
                buttonClickHandler(0, evt.target.id.slice(3));
            }
        });
    }

    createBoard(boardId, width, height, clickHandler) {
        this.clickHandler = clickHandler;
        this.squares[boardId] = Array(width);
        let targetElement = this.boards[boardId];

        for (let i = 0; i < width; i++) {
            this.squares[boardId][i] = Array(height);

            for (let j = 0; j < height; j++) {
                let square = document.createElement("div");

                square.classList.add(SQUARE_CLASS);
                square.id = `${boardId}-${i}-${j}`;

                targetElement.append(square);
                this.squares[boardId][i][j] = square;
            }

            targetElement.append(document.createElement("br"));
        }

        targetElement.addEventListener("click", (evt) => {
            if (evt.target.classList.contains(SQUARE_CLASS)) {
                let boardId, x, y;
                [boardId, x, y] = evt.target.id.split('-');
                this.clickHandler(boardId, x ,y);
            }
        });
    }

    setNames(names) {
        [0, 1].forEach(i => this.playerNames[i].textContent = names[i]);
    }

    setShipStatus(playerId, statuses) {
        this.shipStatuses[playerId].innerHTML = "";

        for (status of statuses) {
            this.shipStatuses[playerId].innerHTML += status + '<br>';
        }
    }

    tagSquare(boardId, x, y, tag) {
        this.squares[boardId][x][y].classList.add(tag);
    }

    convertSquareTags(boardId, tagFrom, tagTo) {
        for (let row of this.squares[boardId]) {
            for (let square of row) {
                if (square.classList.contains(tagFrom)) {
                    square.classList.remove(tagFrom);
                    square.classList.add(tagTo);
                }
            }
        }
    }


    updateStatus(message) {
        this.statusEl.innerHTML = message;
    }
}
