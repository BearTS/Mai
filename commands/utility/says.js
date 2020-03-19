const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
const utility = require('./../../utils/majUtils.js');

module.exports.run = (bot, message, args) =>{

if (args.length<1) return message.channel.send(`Please include the Message ID`);
if (args.length>1) return message.channel.send(`**${args.join(' ')}** is not a valid Message ID`);

message.channel.fetchMessage(args.join('')).then(msg => {

  const embed = new RichEmbed()
  .setAuthor(`${msg.member.displayName} said on ${utility.timeZoneConvert(msg.createdAt)}`,msg.author.displayAvatarURL)
  .setDescription(`${utility.textTrunctuate(msg.content,500)}\n\n[View Original](${msg.url})`)
  .setColor(settings.colors.embedDefault)
  .setTimestamp()

  if (msg.deleted){
    embed.addField(`Note`,`This message has been deleted`)
  }

  if (msg.embeds.length>0){
    embed.addField(`Embeds Included`,`Title: ${(msg.embeds[0].title)?msg.embeds[0].title:"None"},\nDescription: ${utility.textTrunctuate((msg.embeds[0].description) ? msg.embeds[0].description : `None`,300)},\nFields: ${msg.embeds[0].fields.length} fields`)
  }

  return new Promise( async (resolve, reject) => {
    const sent = await message.channel.send(embed)
    let reactions = ['👍', '👎', '😂', '😮', '😡'];
    for (let i = 0; i < reactions.length; i++) await sent.react(reactions[i]);
  })

}).catch(()=>{
  return message.channel.send(`I can't find a Message with **${args.join(' ')}** ID in this channel!`);
})
}

module.exports.help = {
  name: "said",
  aliases: ["says","messaged"],
	group: 'utility',
	description: 'returns the message sent by someone.',
	examples: ['said 688408349435494498'],
	parameters: ['message id']
}
