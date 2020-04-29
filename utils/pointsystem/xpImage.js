const profiles = require('./imageProfiles.js')
const { MessageEmbed } = require('discord.js')

module.exports.constructImage = (member,data,bg) => {

  if (bg === 'https://i.imgur.com/djHyEE0.png') {
    return new Promise( async (resolve,reject) => {
      const attachment = await profiles.standard(member,data)
      resolve(attachment)
    })
  } else return new MessageEmbed().setColor('RED').setDescription('An unexpected Error Occured')
}
