const Discord = require('discord.js');
const bot = new Discord.Client({intents: 3276799});
const config = require('./config');
const loadCommands = require('./loader/loadCommands');

bot.commands = new Discord.Collection();
bot.login(config.token);
loadCommands(bot);

let membersList = [];

bot.on('ready', () => {
    console.log(`${bot.user.tag} est connecté !`);

    const guild = bot.guilds.cache.get(config.guildId);

    guild.members.fetch().then((members) => {
        members.forEach((member) => {
            if (member.roles.cache.some((role) => role.name === config.memberRole)) {
                membersList.push({
                    username: member.user.username,
                    timer: 0,
                    haveReceivePoints: false,
                });
            }
        });
    });
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

bot.on('voiceStateUpdate', async (oldState, newState) => {
    let userConnected;

    membersList.forEach((member) => {
        if (member.username === newState.member.user.username) {
            userConnected = member;
        }
    });

    bot.commands.get('watchVoiceChannel').run(bot, oldState, newState, userConnected);
});