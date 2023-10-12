require('dotenv').config();

module.exports = {
    token: process.env.TOKEN,
    api: process.env.API,
    devUsername: "naiclc",
    subscribeChannel: 'inscription',
    botChannel: 'la-zone-des-points',
    memberRole: 'ESGI',
    maxTime: 10,
    pointsSession: 1,
    guildName: 'Summoners War Alcatraz ESGI',
    sessionDay: "jeudi",
    sessionStartHour: "21:00",
    sessionEndHour: "23:59",
}