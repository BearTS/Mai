const { MessageEmbed } = require('discord.js')

module.exports.run = async ( { musicQueue }, { guild : { id }, member : { displayName, voice }, channel }) => {

if (!voice.channel) return channel.send(error('I\'m sorry but you need to be in a voice channel to play/stop music!'));

const serverQueue = musicQueue.get(id)

if (!serverQueue) return channel.send(error('There is nothing playing that I could skip for you.'));

if (serverQueue.connection.dispatcher) serverQueue.connection.dispatcher.end();

return channel.send(new MessageEmbed().setColor('GREY').setDescription(`**${displayName}** skipped the music`));


}

module.exports.config = {
  name: "skip",
  aliases: [],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "music",
  guildOnly: true,
  description: 'Skips the currently playing music.',
  examples: ['skip'],
  parameters: []
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
