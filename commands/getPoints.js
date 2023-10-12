const fetch = require("node-fetch");
const api = require("../config").api;

module.exports = {
  name: 'getPoints',

  async run(bot, message, membersList, maxTime) {
    const authorUsername = message.author.username;

    membersList.forEach((member) => {
      const memberUsername = member.username;

      if (memberUsername === authorUsername) {
        async function getMember(memberUsername) {
          const response = await fetch(`${api}/search_or?Discord=${memberUsername}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          return await response.json();
        }

        getMember(memberUsername).then((memberData) => {
          if(memberData[0] === undefined) return message.reply("Tu n'es pas inscrit !");

          const memberTimer = member.timer;
          const points = memberData[0].Points;

          if (memberTimer === 0) {
            message.reply(`Tu as **${points} points**`);
          } else {
            message.reply(`Tu as **${points} points**. Tu peux encore rester **${maxTime - memberTimer} minutes** pour avoir des points 👀`);
          }
        });
      }
    });
  }
}