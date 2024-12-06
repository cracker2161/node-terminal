const chalk = require('chalk');

const systemCommands = {
    clearScreen() {
        console.clear();
    },

    showCurrentDir(currentDir) {
        console.log(currentDir);
    },

    echo(args) {
        console.log(args.join(' '));
    },

    showEnvironment() {
        Object.entries(process.env).forEach(([key, value]) => {
            console.log(`${key}=${value}`);
        });
    }
};

module.exports = { systemCommands };