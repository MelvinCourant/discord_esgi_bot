require('dotenv').config();

module.exports = {
    token: process.env.TOKEN,
    api: process.env.API,
    subscribeChannel: 'inscription',
    botChannel: 'bot',
    memberRole: 'ESGI',
    maxTime: 1,
    pointsSession: 1,
    guildName: 'Test bot',
}