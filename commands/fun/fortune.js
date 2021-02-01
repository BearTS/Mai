const { MessageEmbed } = require('discord.js');
const fortunes = require('../../assets/json/fortune.json');

module.exports = {
  name: 'fortune',
  aliases: [ 'ft', 'fortunecookies', 'fortunecookie' ],
  group: 'fun',
  description: 'Generate a random fortune',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'fortune',
    'ft',
    'fortunecookies',
    'fortunecookie'
  ],
  run: (client, message) => message.channel.send(
    new MessageEmbed()
    .setColor('GREY')
    .setAuthor(message.author.tag)
    .setFooter(`Fortune | \©️${new Date().getFullYear()} Mai`)
    .setDescription(fortunes[Math.floor(Math.random() * fortunes.length)])
  )
};
