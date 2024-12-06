const chalk = require('chalk');

function formatPath(path) {
    return path.replace('/home/runner', '~');
}

function handleError(error) {
    console.error(chalk.red(`Error: ${error.message}`));
}

module.exports = { formatPath, handleError };