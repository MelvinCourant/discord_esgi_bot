const config = require('../config');
const fetch = require("node-fetch");

module.exports = {
  name: 'watchVoiceChannel',

  async run(bot, oldState, newState, userConnected, maxTime, pointsSession) {
    const minute = 36000;
    const voiceChannel = newState.channel;
    let timer;

    function addPoints() {
      userConnected.timer++;

      if(userConnected.timer === maxTime) {
        userConnected.haveReceivePoints = true;
        userConnected.timer = 0;

        const guild = bot.guilds.cache.find((guild) => guild.name === config.guildName);
        guild.channels.cache.forEach((channel) => {
          if (channel.name === config.botChannel) {
            async function getMember() {
              const response = await fetch(`${config.api}/search_or?Discord=${newState.member.user.username}`, {
                  method: 'GET',
                  headers: {
                    'Content-Type': 'application/json',
                  }
              });

              if(!response.ok) {
                  message.reply('Une erreur est survenue, il est possible que tu ne sois pas comptabilisé dans la base de données.');
              }

              return await response.json();
            }

            getMember().then((memberData) => {
              const points = memberData[0].Points;

              if(points < 4) {
                const newPoints = parseInt(points) + pointsSession;
                const memberUsername = newState.member.user.username;
                const memberId = newState.member.user.id;

                fetch(`${config.api}/Discord/${memberUsername}`, {
                  method: 'PATCH',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    Points: newPoints,
                  })
                })
                .then(() => {
                  channel.send(
                      `🎉 <@${memberId}> ta participation a été prise en compte ! Mais tu peux rester pour continuer à discuter 😉`
                  );
                })
                .catch((error) => {
                  console.log(error);
                });
              }
            });
          }
        });

        clearInterval(timer);
      }
    }

    if (
      voiceChannel &&
      userConnected.timer < maxTime
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