class CommandPrompt {
    constructor (commandHandler) {
        this.commandHandler = commandHandler;

        this.inputField = document.getElementById("command-prompt");
        this.button = document.getElementById("command-prompt-btn");
        this.log = document.getElementById("command-history");

        this.inputField.addEventListener("keyup", (evt) => {
            if (event.code == "Enter") {
                evt.preventDefault();
                this.sendPrompt();
            }
        });

        this.button.addEventListener("click", () => {
            this.sendPrompt();
        });
    }

    sendPrompt () {
        let message = this.inputField.value;
        this.inputField.value = "";

        let response = this.commandHandler(message);
        let messageEl = document.createElement("span");

        messageEl.innerHTML = ">> " + message + "<br>" + response + "<br>";
        this.log.prepend(messageEl);
    }
}
