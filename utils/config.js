const fs = require('fs-extra');
const path = require('path');

const CONFIG_FILE = path.join(process.cwd(), '.terminal-config.json');

function loadConfig() {
    try {
        if (fs.existsSync(CONFIG_FILE)) {
            return fs.readJsonSync(CONFIG_FILE);
        }
    } catch (error) {
        console.error('Error loading config:', error);
    }
    return { aliases: {} };
}

function saveConfig(config) {
    try {
        fs.writeJsonSync(CONFIG_FILE, config, { spaces: 2 });
    } catch (error) {
        console.error('Error saving config:', error);
    }
}

module.exports = { loadConfig, saveConfig };