const {RichEmbed} = require("discord.js");
const settings = require("./../../botconfig.json");

module.exports.run = (bot,message,args) =>{
  if (!message.guild.channels.find(c => c.name === 'suggestions')) return message.react('👎').then(()=>message.channel.send(`#suggestions channel not found!`))

  let channel = message.guild.channels.find(c => c.name === 'suggestions')

  const embed = new RichEmbed()
  .setTitle(`${message.member.displayName}'s suggestion`)
  .setColor(settings.colors.embedDefault)
  .setDescription(args.join(' '))
  .setThumbnail(message.author.displayAvatarURL)
  .addField('Status','Under Review')

  channel.send(embed).then(async (m)=>{
      await message.react('🇸')
      await message.react('🇪')
      await message.react('🇳')
      await message.react('🇹')
      await m.react('⬆')
      await m.react('⬇')
    })
  }

module.exports.help = {
  name: "suggest",
  aliases: [],
	group: 'core',
	description: 'Suggest something for the server.',
	examples: ['suggest Please remove some inactive members.....'],
	parameters: ['suggestion content']
}
