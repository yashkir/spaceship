class Console {
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
