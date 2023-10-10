const Discord = require('discord.js');
const bot = new Discord.Client({intents: 3276799});
const config = require('./config');
const loadCommands = require('./loader/loadCommands');

bot.commands = new Discord.Collection();
bot.login(config.token);
loadCommands(bot);

bot.on('ready', () => {
    console.log(`${bot.user.tag} est connecté !`);
});

bot.on('messageCreate', async (message) => {
    if (
      message.content &&
      !message.author.bot &&
      message.channel.name === config.subscribeChannel
    ) {
        bot.commands.get('registerMember').run(bot, message);
    }
});