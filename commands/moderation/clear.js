const { MessageEmbed } = require('discord.js')

module.exports.run = async ( client, message, [category, quantity] ) => {

if (!['all','images', 'pics', 'image', 'bots', 'bot', 'codeblocks', 'code', 'attachments', 'attachment', 'files', 'file', 'embeds', 'embed', 'me'].includes(category)) {

  if (!isNaN(Number(category)) && Number(category) > 1 && Number(category) < 100) {

    quantity = category
    category = undefined

  } else return message.channel.send(error(`Please enter a valid type of message!\n\`all\` \`images\` \`bots\` \`codeblocks\` \`embeds\` and/or the quantity of messages to be deleted [1-99].\n\n**Accepted formats:**\nclear [category] [quantity]\nclear [quantity]`))

}

if (!quantity) {

  return message.channel.send(error('Please specify the number of messages [quantity] to be deleted.'))

}

if (isNaN(Number(quantity))) {

  return  message.channel.send(error(`**${quantity}** is not a valid number!`))

}

if (Number(quantity) > 99 || Number(quantity) < 1) {

  return message.channel.send('I can\'t delete more than 99 messages at once!')

}

let messages = await message.channel.messages.fetch({limit: quantity, before: message.id})

messages = messageFilter(messages,category,message)

if (!messages) {

    return message.channel.send(error(`${message.member.displayName}! There were no [${category}] messages to prune in the last ${quantity} messages!`))

}

try {

  const deleted = await message.channel.bulkDelete(messages, true).catch(()=>{})
  await message.channel.send(success(`Deleted ${deleted.size} ${!category ? '' : `[${category}]`} messages!`))


} catch (err) {

  message.channel.send(error(`Messages are too old to be deleted! I can only delete messages within two weeks!`))

}

}

module.exports.config = {
  name: "clear",
  aliases: ['delete','slowprune','sd','delete','slowdelete'],
  cooldown:{
    time: 0,
    msg: ""
  },
	group: 'moderation',
  guildOnly: true,
  modOnly: true,
  permissions: ['MANAGE_MESSAGES'],
  clientPermissions: ['MANAGE_MESSAGES'],
	description: 'Delete messages from this channel. Will not delete messages older than two (2) weeks.',
	examples: ['delete [category] [quantity]'],
	parameters: ['category','amount of messages']
}


function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}

function success(msg){
  return new MessageEmbed()
  .setColor('GREEN')
  .setDescription(`\u200B\n${msg}\n\u200B`)
}

function messageFilter(messages,category,message){
  if (!category) return messages

  if (category === 'all') return messages

  let flushable;

  if (category === 'image' || category === 'pics' || category === 'images') {

    const attachments = messages.filter(m => /(?:([^:/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:png|jpe?g|gifv?|webp|bmp|tiff|jfif))(?:\?([^#]*))?(?:#(.*))?/gi.test(m.content))
    const urls = messages.filter(m => m.attachments.size)

    flushable = attachments.concat(urls)

  } else if (category === 'bot' || category === 'bots') {

   flushable = messages.filter(m => m.author.bot)


  } else if (category === 'code' || category === 'codeblock' || category === 'codeblocks') {

   flushable = messages.filter(m => m.content.startsWith(`\`\`\``) || m.content.includes(`\`\`\``))

 } else if (category === 'embeds' || category === 'embed') {

   flushable = messages.filter(m => m.embeds.length)

} else if (category === 'me') {

  flushable = messages.filter(m => m.author.id === message.author.id)

}

  if (!flushable || !flushable.size) return undefined

  return flushable
}
