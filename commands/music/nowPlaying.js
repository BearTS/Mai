const { MessageEmbed } = require('discord.js')

module.exports.run = ( { musicQueue } , { guild: { id }, channel } ) => {

  const serverQueue = musicQueue.get(id)

  if (!serverQueue) channel.send(error('There is nothing Playing.'))

  const { songs: [ { image, title, url } , ...rest ], playing } = serverQueue

  return channel.send( new MessageEmbed()
  .setAuthor(`🎶 Now Playing: ${(!playing) ? '(Paused)' : ''}`)
  .setThumbnail(image)
  .setTitle(title)
  .setURL(url)
  .setColor('GREY')
  .setDescription(rest && rest.length ? `**Playing Next**:\n[${rest[0].title}](${rest[0].url})${rest.length > 1 ? `\n\n**Playing Later**:\n[${rest[1].title}](${rest[1].url})`:`\u200B`}` : `\u200B`)
  )

}

module.exports.config = {
  name: "nowplaying",
  aliases: ['np','playing','current','playing'],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "music",
  guildOnly: true,
  description: "Display the currently playing music..",
  examples: ['np'],
  parameters: []
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
