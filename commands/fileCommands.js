const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

const fileCommands = {
    async listDirectory(currentDir, args) {
        const options = {
            all: args.includes('-a'),
            long: args.includes('-l')
        };

        const files = await fs.readdir(currentDir);

        if (!options.all) {
            files.filter(file => !file.startsWith('.'));
        }

        if (options.long) {
            for (const file of files) {
                const stats = await fs.stat(path.join(currentDir, file));
                console.log(
                    `${stats.mode.toString(8).slice(-3)} ` +
                    `${stats.size.toString().padStart(8)} ` +
                    `${stats.mtime.toLocaleString()} ` +
                    `${file}`
                );
            }
        } else {
            console.log(files.join('  '));
        }
    },

    async changeDirectory(currentDir, newDir = '/home/runner') {
        const targetDir = path.resolve(currentDir, newDir);
        if (await fs.pathExists(targetDir)) {
            return targetDir;
        }
        throw new Error(`Directory not found: ${newDir}`);
    },

    async makeDirectory(currentDir, args) {
        if (!args.length) throw new Error('Directory name required');
        const dirPath = path.resolve(currentDir, args[0]);
        await fs.mkdir(dirPath, { recursive: args.includes('-p') });
        console.log(chalk.green(`Created directory: ${args[0]}`));
    },

    async createFile(currentDir, args) {
        if (!args.length) throw new Error('File name required');
        const filePath = path.resolve(currentDir, args[0]);
        await fs.writeFile(filePath, '');
        console.log(chalk.green(`Created file: ${args[0]}`));
    },

    // Add other file commands...
};

module.exports = { fileCommands };