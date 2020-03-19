const {RichEmbed} = require("discord.js");
const settings = require("./../../botconfig.json");

module.exports.run = (bot,message,args) =>{
  if (!message.member.permissions.has("ADMINISTRATOR")) return message.react('👎').then(()=>message.channel.send(`Sorry, only administrator have access to this command!`))
  if (!message.guild.channels.find(c => c.name === 'suggestions')) return message.react('👎').then(()=>message.channel.send(`#suggestions channel not found!`))

  let channel = message.guild.channels.find(c => c.name === 'suggestions')

  let action = args[1]

  let reason = args.slice(2).join(' ')
  channel.fetchMessage(args[0]).then(msg => {
    if (!['accept','deny'].includes(action)) return message.react('👎').then(()=>message.channel.send(`Please specify if you \`accept\` or \`deny\` the suggestion`))

    if (!args[2]) return message.react('👎').then(()=>message.channel.send(`Please specify why you \`accept\`ed or \`deny\`ied the suggestion`))

    if (msg.embeds[0].fields.length>1) return message.react('👎').then(()=>message.channel.send(`Someone already responded to suggestion!`))

    let recieved = msg.embeds[0]
    recieved.fields[0].value = (action === 'accept' ? `Accepted by ${message.author.tag}`:`Denied by ${message.author.tag}`)
    let editable = new RichEmbed(recieved).setColor(action === 'accept' ? 0x00ff00:0xff0000).addField(`Reason`,reason)
    msg.edit(editable).then(m => {
      message.react('✅')
    })

  }).catch(()=>{
    return message.channel.send(`I can't find a suggestion with **${args.join(' ')}** ID in ${channel}!`);
  })
  }

module.exports.help = {
  name: "respond",
  aliases: [],
	group: 'moderator',
	description: 'Respond to user suggestion.',
	examples: ['respond 690105173087223812 deny Doesn\'t make much sense to do this and it does not seem to have much support'],
	parameters: ['messsage ID','accept/deny','reason']
}
