const { MessageEmbed } = require('discord.js')

module.exports = {
  config: {
    name: "stop",
    aliases: ['cancel'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: 'music',
    description: 'Stops the currenty playing music and removes all the music from queue.',
    examples: ['stop'],
    parameters: []
  },
  run: async ( { musicQueue }, { guild : { id }, member : { displayName, voice }, channel }) => {

  if (!voice.channel) return channel.send(error('I\'m sorry but you need to be in a voice channel to play/stop music!'));

  const serverQueue = musicQueue.get(id)

  if (!serverQueue) return channel.send(error('There is nothing playing that I could skip for you.'));

  if (serverQueue.connection.dispatcher) serverQueue.connection.dispatcher.end();

  serverQueue.voiceChannel.leave()

  musicQueue.delete(id)

  return channel.send(new MessageEmbed().setColor('GREY').setDescription(`**${displayName}** stopped the music`));

  }
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
