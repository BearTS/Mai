const Discord = require("discord.js");
const settings = require('./../../botconfig.json');

module.exports.run = (bot, message, args) => {
let users = message.mentions.members
let embed = new Discord.RichEmbed()

if (users.size<1) {
  embed
  .setDescription(message.author.username + "'s avatar")
  .setColor(settings.colors.embedDefault)
  .setImage(message.author.displayAvatarURL)
return  message.channel.send(embed)
} else if (users.size>1){
    message.react('👎')
   return message.channel.send(`Request of avatars for multiple users is not supported!`)
} else {
  user = users.first()
      embed
      .setDescription(user.user.username + "'s avatar")
      .setColor(settings.colors.embedDefault)
      .setImage(user.user.avatarURL)
    return  message.channel.send(embed)

  }
}


module.exports.help = {
	name: "av",
  aliases: ["avatar","profilepic","pfp","dp","displayprofile"],
	group: 'utility',
	description: 'Shows the avatar of the user mentioned.',
	examples: ['pfp @Sakurajimai'],
	parameters: ['user mentions']
}
