const chalk = require('chalk');

const utilityCommands = {
    showHelp() {
        const commands = {
            'ls [-a] [-l]': 'List directory contents',
            'cd [dir]': 'Change directory',
            'mkdir [-p] <dir>': 'Create directory',
            'touch <file>': 'Create file',
            'rm [-r] <file/dir>': 'Remove file or directory',
            'cp <src> <dest>': 'Copy file',
            'mv <src> <dest>': 'Move file',
            'cat <file>': 'Show file contents',
            'clear': 'Clear screen',
            'pwd': 'Show current directory',
            'echo <text>': 'Print text',
            'env': 'Show environment variables',
            'history': 'Show command history',
            'help': 'Show this help',
            'exit': 'Exit terminal'
        };

        console.log(chalk.yellow('\nAvailable Commands:'));
        Object.entries(commands).forEach(([cmd, desc]) => {
            console.log(chalk.green(`${cmd.padEnd(25)}`) + desc);
        });
        console.log();
    },

    showHistory(history) {
        history.forEach((cmd, i) => {
            console.log(`${i + 1}  ${cmd}`);
        });
    },

    async handleAlias(args, config) {
        if (!args.length) {
            Object.entries(config.aliases || {}).forEach(([key, value]) => {
                console.log(`${key}='${value}'`);
            });
            return;
        }

        const aliasString = args.join(' ');
        const match = aliasString.match(/^([^=]+)=(.+)$/);

        if (match) {
            const [, name, command] = match;
            config.aliases = config.aliases || {};
            config.aliases[name] = command.replace(/['"`]/g, '');
        } else {
            throw new Error('Invalid alias syntax. Use: alias name=command');
        }
    }
};

module.exports = { utilityCommands };