const memberRole = require('../config').memberRole;

module.exports = {
  name: 'getPoints',

  async run(bot, message, membersList) {
    membersList.forEach((member) => {
      if (member.username === message.author.username) {
        if (member.timer === 0) {
          message.reply('Tu as **... points**');
        } else {
          message.reply(`Tu as **... points**. Tu peux encore rester **${10 - member.timer} minutes** pour avoir des points 👀`);
        }
      }
    });
  }
}