const fs = require('fs');

module.exports = async (bot) => {
    fs.readdirSync('./commands/').filter(f => f.endsWith('.js')).forEach(file => {
        if (!file) {
            console.log(`La commande ${file} n'existe pas.`);
            return;
        }

        const command = require(`../commands/${file}`);

        if (command.name) {
            bot.commands.set(command.name, command);
        } else {
            console.log(`La commande ${file} est mal configurée et n'a pas de propriété 'name'.`);
        }
    });
}
