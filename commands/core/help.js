const settings = require('./../../botconfig.json')
const {RichEmbed} = require('discord.js')

module.exports.run = (bot, message, args) => {
  if (args.length<1) {
    const embed = new RichEmbed()
  	.setAuthor(`${bot.user.username}`, bot.user.displayAvatarURL)
  	.setColor(settings.colors.embedDefault)
  	.setThumbnail(bot.user.displayAvatarURL)
  	.setFooter(`Created by Sakurajimai#6742`)
  	.setDescription(`Hi! I\'m **${bot.user.username}** and I am a bot based\n\around anime and some NSFW!\n\All my commands start with the prefix \`${settings.prefix}\`!`)
  	.addField(`Commands`, `Use \`${settings.prefix}cmd\` to see a list of my commands.\n\You can also use \`${settings.prefix}help [command]\` to get help on a specific command.`)
  	.addField(`Special`,`Im dedicated to one and only server so i won't give you any invite link!`);
    return message.channel.send(embed).catch(console.error);
  }

  var verifiedCommand = bot.commands.find(m => m.help.name === args.join(' '))
  if (!verifiedCommand) {
  	const embed = new RichEmbed()
  	.setDescription(`${message.author}, **${args.join(' ')}** is not available in Mai-oneesan's commands set. Please check your spelling and try again!`)
  	.setImage(`https://i.imgur.com/FT1XnVn.gif`)
  	.setFooter(`${bot.user.username} | This error message automatically gets deleted in 15 seconds`)
  	.setColor(settings.colors.embedDefault)
    return message.channel.createWebhook(`Kaede-chan`,'https://styles.redditmedia.com/t5_rigg4/styles/communityIcon_72xs3ncrm6621.png').then(hook => {
      hook.send(embed).then(m => {
        setTimeout(()=>{if (!m.deleted) m.delete()},15000)
      }).catch(console.error)
      setTimeout(async function() {
          await hook.delete()
      }, 1000);
    })
  }
  let examples = ''
  verifiedCommand.help.examples.forEach(e =>  examples += `\`${settings.prefix}${e}\`\n`)

  const embed = new RichEmbed()
  		.setAuthor(settings.prefix + verifiedCommand.help.name, bot.user.displayAvatarURL)
  		.setColor(settings.colors.embedDefault)
  		.setThumbnail(bot.user.displayAvatarURL)
  		.setDescription(`${verifiedCommand.help.description}`)
  		.addField('Aliases',verifiedCommand.help.aliases.length>1 ? verifiedCommand.help.aliases.join(', ') : 'None')
  		.addField('Examples',examples)
      .addField('Required Parameters',verifiedCommand.help.parameters.length>0 ? verifiedCommand.help.parameters.join(', ') : 'None')
  		.setFooter(`${verifiedCommand.help.group} | Created by Sakurajimai#6742`);
      return message.channel.send(embed).catch(console.error);
}

module.exports.help = {
  name: 'help',
  aliases: ['hello','hi','hey','moshimoshi','konnichiwa'],
  group: 'core',
  description: 'Displays basic information or help for a command!',
  examples: ['help anime','hey'],
  parameters: ['command name']
}
