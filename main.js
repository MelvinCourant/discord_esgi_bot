const discord = require('discord.js');
const bot = new discord.Client({intents: 3276799});
const config = require('./config');
const loadCommands = require('./loader/loadCommands');

bot.commands = new discord.Collection();
bot.login(config.token);
loadCommands(bot);

bot.on('ready', () => {
    console.log(`${bot.user.tag} est connecté !`);
});

bot.on('messageCreate', async (message) => {
    if (message.content === '!ping') {
        bot.commands.get('ping').run(bot, message);
    }
});