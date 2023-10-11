const {Discord, EmbedBuilder} = require("discord.js");
const memberRole = require('../config').memberRole;
const api = require('../config').api;
const fetch = require('node-fetch');

module.exports = {
    name: 'registerMember',

    async run(bot, message, membersList) {
        let lastName = '';
        let firstName = '';
        let esgiClass = '';

        await message.content.split(' ').forEach((element, index) => {
            if(
              element.match(/^[A-Z]+$/) &&
              index === 0 ||
              element.match(/^[A-Z]+$/) &&
              index === 1
            ) {
                lastName = element;
            } else if(
              element.match(/^[A-Z][a-z]*$/) &&
              index === 0 ||
              element.match(/^[A-Z][a-z]*$/) &&
              index === 1
            ) {
                firstName = element;
            } else if(
              index >= 1 &&
              !element.match(/^[A-Z]+$/) &&
              !element.match(/^[A-Z][a-z]*$/)
            ) {
                esgiClass += element;
            }
        });

        function error() {
            let errorMessage = new EmbedBuilder();
            errorMessage.setTitle('Erreur');

            let errorField = [];

            if(lastName === '') {
                errorField.push({name: 'Nom', value: 'Le nom n\'est pas valide'});
            }

            if(firstName === '') {
                errorField.push({name: 'Prénom', value: 'Le prénom n\'est pas valide'});
            }

            if(esgiClass === '') {
                errorField.push({name: 'Classe', value: 'La classe n\'est pas valide'});
            }

            errorMessage.addFields(errorField);
            errorMessage.setColor('#FF0000');
            message.reply({ embeds: [errorMessage] });
        }

        function checkRole() {
            const role = message.guild.roles.cache.find(role => role.name === memberRole);

            if(message.member.roles.cache.some(role => role.name === memberRole)) {
                message.reply('❌ Vous êtes déjà inscrit');
            } else {
                const username = message.author.username;

                message.member.roles.add(role);
                message.react('✅');
                message.reply('🎉 Vous êtes inscrit, bienvenue !');
                membersList.push({
                    username: username,
                    timer: 0,
                    haveReceivePoints: false
                });

                async function addInSheet() {
                    const request = await fetch(api, {
                        method: "POST",
                        body: JSON.stringify({
                            data: {
                                Prénom: firstName,
                                Nom: lastName,
                                Classe: esgiClass,
                                Discord: username,
                                Points: 0
                            }
                        }),
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });

                    if(!request.ok) {
                        message.reply('Erreur lors de l\'ajout dans la base de données');
                    }
                }

                addInSheet();
            }
        }

        if(
          firstName === '' ||
          lastName === '' ||
          esgiClass === ''
        ) {
            error();
        } else {
            checkRole();
        }
    }
}