const { MessageEmbed } = require('discord.js')

module.exports = {
  config: {
    name: "volume",
    aliases: ['vol'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: 'music',
    description: 'Set the current music volume, or return the current music volume if none is provided.',
    examples: ['vol'],
    parameters: []
  },
  run: async ( { musicQueue }, { guild : { id }, member : { displayName, voice }, channel }, [ setvolume ]) => {

  if (!voice.channel) return channel.send(error('I\'m sorry but you need to be in a voice channel to play/stop music!'));

  const serverQueue = musicQueue.get(id)

  if (!serverQueue) return channel.send(error('There is nothing playing'));

  if (!setvolume) return channel.send(new MessageEmbed().setColor('GREY').setDescription(`The current volume is: **${serverQueue.volume}**%`));

  if (isNaN(Number(setvolume))) return channel.send(error(`Please enter a valid volume number!`))

  if (Number(setvolume) > 200 || Number(setvolume) < 1) return channel.send(error(`Please enter a valid volume number: \`(1-200)\``))

  serverQueue.volume = setvolume

  serverQueue.connection.dispatcher.setVolumeLogarithmic(Number(setvolume / 200));

  return channel.send(new MessageEmbed().setColor('GREY').setDescription(`**${displayName}** i set the volume to: **${setvolume}**`));

  }
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
