const { MessageEmbed } = require('discord.js')

module.exports.run = async ( client, message, [ msgid, action, ...reason ] ) => {

try {

  if (!message.guild.channels.cache.find( c => c.name === 'suggestions')) {

    return message.channel.send(error('#suggestions channel not found!'))

  }

  if (!msgid) {

    return message.channel.send(error(`You need to provide the **message id** of the suggestion.`))

  }

  const channels = message.guild.channels.cache.filter(c => c.name === 'suggestions')

  if (channels.size > 1) {

    return message.channel.send(error('Multiple #suggestions channel found!'))
  }

  const suggestmsg = await channels.first().messages.fetch(msgid).catch(()=>{})


  if (!suggestmsg || suggestmsg.size > 1) {

    return message.channel.send(error(`I can't find a suggestion with **${msgid}** ID in ${channels.first()}!`))

  }

  if (!suggestmsg.embeds.length || suggestmsg.embeds[0].title && !suggestmsg.embeds[0].title.endsWith('suggestion')) {

    return message.channel.send(error(`I can't find a suggestion with **${msgid}** ID in ${channels.first()}!`))

  }

  if (suggestmsg.embeds[0].fields.length > 1) {

    return message.channel.send(error(`**${suggestmsg.embeds[0].fields[0].value.replace('Accepted by ','')}** already responded to this suggestion!`))

  }


  if (!action || !['accept','deny'].includes(action.toLowerCase())) {

    return message.channel.send(error(`Please specify if you \`accept\` or \`deny\` this suggestion!`))

  }

  if (!reason.length) {

    return message.channel.send(error(`Please specify why you \`accept\`ed or \`deny\`(i)ed this suggestion`))

  }

  if (!suggestmsg.editable) {

    return message.channel.send(error(`I could not access the suggestion!`))

  }

  const { fields } = suggestmsg.embeds[0]

  fields[0].value = action === 'accept' ? `Accepted by ${message.author.tag}` : `Denied by ${message.author.tag}`

  const success = await suggestmsg.edit( new MessageEmbed(suggestmsg.embeds[0])
    .setColor( action === 'accept' ? 'GREEN' : 'RED')
    .addField( `Reason`, reason.join(' ') ))

  if (success) message.react('✅')

  else message.channel.send(error('Failed to Update Suggestion Panel!'))

} catch (err) {

  message.channel.send(error(`[Error MALFORMED-DATA]: This suggestion message data seems to be corrupted.`))
  const { user: { owner } } = require('../../settings.json')
  const { magenta } = require('chalk')
  const dev = client.users.cache.get(owner)

  if (dev) dev.send(error(`FATAL-ERROR on ${message.guild.name} | ${message.channel.name} | ${message.id}\n\n\`\`\`xl\n${err.stack}\n\`\`\``))

  return console.log(`${magenta('[Mai-Promise Error]')} : ${err.name}`)

}

}

module.exports.config = {
  name: "respond",
  aliases: [],
  cooldown:{
    time: 0,
    msg: ""
  },
	group: 'moderation',
  adminOnly: true,
  guildOnly: true,
	description: 'Respond to user suggestion.',
	examples: ['respond 690105173087223812 deny Doesn\'t make much sense to do this and it does not seem to have much support'],
	parameters: ['messsage ID','accept/deny','reason']
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
