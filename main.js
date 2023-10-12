const Discord = require('discord.js');
const bot = new Discord.Client({intents: 3276799, disableEveryone: false});
const config = require('./config');
const loadCommands = require('./loader/loadCommands');

bot.commands = new Discord.Collection();
bot.login(config.token);
loadCommands(bot);

let membersList = [];
let botChannel;

bot.on('ready', () => {
    console.log(`${bot.user.tag} est connecté !`);

    const guild = bot.guilds.cache.find((guild) => guild.name === config.guildName);

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

    guild.channels.cache.forEach((channel) => {
        if (channel.name === config.botChannel) {
            channel.send(
              '👋 Hey !'
            );
            botChannel = channel;
        }
    });
});

bot.on('messageCreate', async (message) => {
    if (
      message.content &&
      !message.author.bot &&
      message.channel.name === config.subscribeChannel
    ) {
        bot.commands.get('registerMember').run(bot, message, membersList);
    } else if(
      message.content === "!points" &&
      !message.author.bot &&
      message.channel.name === config.botChannel
    ) {
        bot.commands.get('getPoints').run(bot, message, membersList, config.maxTime);
    }

    if(
      message.content === '!start' &&
      message.author.username === config.devUsername
    ) {
        bot.on('voiceStateUpdate', startSession);
        botChannel.send(
          '🎉 @everyone La session a commencé !'
        );
    } else if(
      message.content === '!stop' &&
      message.author.username === config.devUsername
    ) {
        bot.removeListener('voiceStateUpdate', startSession);
        botChannel.send(
          '👋 @everyone La session est terminée !'
        );
    }
});

async function startSession(oldState, newState) {
    let userConnected;

    membersList.forEach((member) => {
        if (member.username === newState.member.user.username) {
            userConnected = member;
        }
    });

    if(!userConnected.haveReceivePoints) {
        bot.commands.get('watchVoiceChannel').run(bot, oldState, newState, userConnected, config.maxTime, config.pointsSession);
    }
}