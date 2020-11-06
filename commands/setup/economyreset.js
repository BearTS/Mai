const { MongooseModels: model } = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'economyreset',
  aliases: ['ecoreset'],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Reset the economy of everyone in this server.',
  examples: [],
  parameters: [],
  run: async (client, message) => {

  await message.channel.send('This will **reset** all of the user\'s economy status in this server (Action irreversible). Continue?')
  collector = message.channel.createMessageCollector( res => message.author.id === res.author.id )

  const continued = await new Promise( resolve => {
    const timeout = setTimeout(()=> collector.stop('TIMEOUT'), 30000)
    collector.on('collect', (message) => {
      if (['y','yes'].includes(message.content.toLowerCase())) return resolve(true)
      if (['n','no'].includes(message.content.toLowerCase())) return resolve(false)
    })
    collector.on('end', () => resolve(false))
  })

  if (!continued)
    return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, cancelled the economyreset command!`)

  return model.bankSchema.deleteMany({ guildID: message.guild.id}, (err,del) => {
      message.channel.send(
        new MessageEmbed().setDescription(
            '\u2000\u2000<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
          + `XP [Experience Points System] has been **reset** `
          + 'in this server.'
        ).setColor('GREEN'))
    })
  }
}
