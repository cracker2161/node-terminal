const readline = require('readline');
const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path');
const { spawn } = require('child_process');
const { fileCommands } = require('./commands/fileCommands');
const { systemCommands } = require('./commands/systemCommands');
const { utilityCommands } = require('./commands/utilityCommands');
const { loadConfig, saveConfig } = require('./utils/config');
const { formatPath, handleError } = require('./utils/helpers');

class ReplitTerminal {
    constructor() {
        this.currentDir = process.cwd();
        this.history = [];
        this.config = loadConfig();
        this.initializeTerminal();
    }

    initializeTerminal() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: this.getPrompt()
        });

        console.log(chalk.cyan('Welcome to Replit Terminal! Type "help" for commands.'));
        this.rl.prompt();

        this.rl.on('line', async (line) => {
            await this.processCommand(line.trim());
            this.rl.setPrompt(this.getPrompt());
            this.rl.prompt();
        });

        this.rl.on('SIGINT', () => {
            console.log('\nUse "exit" to close the terminal');
            this.rl.prompt();
        });
    }

    getPrompt() {
        const dir = formatPath(this.currentDir);
        return chalk.green('replit') + chalk.white(':') + 
               chalk.blue(dir) + chalk.yellow('$ ');
    }

    async processCommand(input) {
        if (!input) return;

        this.history.push(input);
        const [command, ...args] = input.split(' ');

        try {
            switch (command) {
                // File Commands
                case 'ls':
                    await fileCommands.listDirectory(this.currentDir, args);
                    break;
                case 'cd':
                    this.currentDir = await fileCommands.changeDirectory(this.currentDir, args[0]);
                    break;
                case 'mkdir':
                    await fileCommands.makeDirectory(this.currentDir, args);
                    break;
                case 'touch':
                    await fileCommands.createFile(this.currentDir, args);
                    break;
                case 'rm':
                    await fileCommands.removeFile(this.currentDir, args);
                    break;
                case 'cp':
                    await fileCommands.copyFile(this.currentDir, args);
                    break;
                case 'mv':
                    await fileCommands.moveFile(this.currentDir, args);
                    break;
                case 'cat':
                    await fileCommands.showFileContent(this.currentDir, args[0]);
                    break;

                // System Commands
                case 'clear':
                    systemCommands.clearScreen();
                    break;
                case 'pwd':
                    systemCommands.showCurrentDir(this.currentDir);
                    break;
                case 'echo':
                    systemCommands.echo(args);
                    break;
                case 'env':
                    systemCommands.showEnvironment();
                    break;

                // Utility Commands
                case 'help':
                    utilityCommands.showHelp();
                    break;
                case 'history':
                    utilityCommands.showHistory(this.history);
                    break;
                case 'alias':
                    await utilityCommands.handleAlias(args, this.config);
                    saveConfig(this.config);
                    break;
                case 'exit':
                    await this.exit();
                    break;

                default:
                    await this.executeSystemCommand(command, args);
            }
        } catch (error) {
            handleError(error);
        }
    }

    async executeSystemCommand(command, args) {
        return new Promise((resolve, reject) => {
            const proc = spawn(command, args, {
                stdio: 'inherit',
                shell: true,
                cwd: this.currentDir
            });

            proc.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error(`Command failed with code ${code}`));
            });

            proc.on('error', reject);
        });
    }

    async exit() {
        console.log(chalk.yellow('Goodbye!'));
        this.rl.close();
        process.exit(0);
    }
}

// Start the terminal
new ReplitTerminal();