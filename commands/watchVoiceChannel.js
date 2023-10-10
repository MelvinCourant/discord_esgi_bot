const Discord = require('discord.js');
const config = require('../config');

module.exports = {
  name: 'watchVoiceChannel',

  async run(bot, oldState, newState, userConnected) {
    const maxTime = 10;
    const minute = 36000;
    const voiceChannel = newState.channel;
    let timer;

    function addPoints() {
      userConnected.timer++;

      if(userConnected.timer === maxTime) {
        userConnected.haveReceivePoints = true;

        const guild = bot.guilds.cache.get(config.guildId);
        guild.channels.cache.forEach((channel) => {
          if (channel.name === config.botChannel) {
            channel.send(
              `<@${newState.member.user.id}> ta participation a été prise en compte !`
            );
          }
        });

        clearInterval(timer);
      }
    }

    if (
      voiceChannel &&
      userConnected.timer < maxTime &&
      !userConnected.haveReceivePoints
    ) {
      timer = setInterval(addPoints, minute);

      bot.on('voiceStateUpdate', async (oldState, newState) => {
        if(!newState.channel) {
          clearInterval(timer);
        }
      });
    }
  }
}