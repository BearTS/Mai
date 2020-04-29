const { MessageEmbed } = require('discord.js')
const { textTrunctuate } = require('../../helper.js')
const { user: { owner } } = require('../../settings.json')


module.exports.run = async (client, message, args) => {

  if (!args.length) return message.channel.send(`Please add an issue to your message!`).then(()=>  message.react("💢") );

  if (args.join(' ').length > 1000) return message.channel.send(`Please make your report brief and short! (MAX 1000 characters!)`).then(()=>  message.react("💢") );

  const ownerUser = client.users.cache.get(owner)

  if (!ownerUser) return message.channel.send(`Couldn't contact Sakurajimai#6742!`)

  ownerUser.send( new MessageEmbed()
  .setAuthor( message.author.tag, message.author.displayAvatarURL({format: 'png', dynamic: true}))
  .setColor('ORANGE')
  .setTimestamp()
  .setFooter(`Channel ID: ${message.channel.id}`)
  .addField(`${message.guild.name} | #${message.channel.name}`, args.join(' '))
).then( async () => {

  await message.react("🇸").catch(()=>{});
  await message.react("🇪").catch(()=>{});
  await message.react("🇳").catch(()=>{});
  await message.react("🇹").catch(()=>{});

}).catch( (err) => {

  message.channel.send( new MessageEmbed().setColor('RED').setDescription(`❎ | **An error occurred while running this command!** \`${err.name}: ${err.message}\``));

})
}

module.exports.config = {
  name: "feedback",
  aliases: ['fb','report','support'],
  cooldown:{
    time: 30,
    msg: "Please limit your usage of this command."
  },
  group: "bot",
  description: "Sends a support message to this bot\'s owner (Sakurajimai#6742)",
  examples: ['feedback [bugs, issues, etc]'],
  parameters: []
}
