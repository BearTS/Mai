const ytdl = require('ytdl-core')
const ytsearch = require('yt-search')
const { MessageEmbed } = require('discord.js')
const linkRegex =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

module.exports = {
  config: {
    name: "play",
    aliases: ['p'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: ['CONNECT','SPEAK'],
    cooldown: null,
    group: 'music',
    description: "Plays the provided music, or queues it if theres already playing.",
    examples: ['p Gotoubun no Kimochi','play https://www.youtube.com/watch?v=kE3jfs5q0sg'],
    parameters: ['search query','youtube url']
  },
  run: async( client, message, args ) => {

  const { channel } = message.member.voice

  if (!channel) return message.channel.send(error(`**${message.member.displayName}**, you are not in a Voice Channel!`))

  if (!channel.permissionsFor(message.guild.me).has(['CONNECT','SPEAK','VIEW_CHANNEL'])) return  message.channel.send(error(`**${message.member.displayName}**, I don't have the permission to join your voice channel!`))

  if (!args.length) return message.channel.send(error(`Please provide a \`link\` to the youtube music or a \`query\` to search with.`))

  const query = args.toString()

  let info;

  if (linkRegex.test(query)){

  let r;

   try { r = ytdl.getVideoID(query) } catch (err) { return message.channel.send(error(`Could not get parse information from **${query}**. Make sure that it is a valid [Youtube](https://youtube.com) url, or that the video is publicly available.`)) }

     const metadata = await ytsearch( { videoId: r } ).catch(()=>{})

     if (!metadata) return message.channel.send(error(`Could not get parse information from **${query}**. Make sure that it is a valid [Youtube](https://youtube.com) url, or that the video is publicly available.`))

     const { title, timestamp, url, videoId, image } = metadata

     info = { type: "url", data: [ { title: title, timestamp: timestamp, url: url, id: videoId, image: image} ] }

     message.channel.send(new MessageEmbed().setColor('GREY').setDescription(`The Music **[${title}](${url})** has been added to queue.`).setThumbnail(image))

   } else {

     const r = await ytsearch(query).catch(()=>{})

     if (!r) return message.channel.send(error(`Sorry, something went wrong while searching for **${query}** on [Youtube](https://youtube.com).`))

     let { videos } = r

     videos = videos.filter(v => v.url).slice(0,5)

     info = { type: "search", data: []}

     videos.forEach( v => {

       if (!v) return

       const { title, timestamp, url, videoId, image } = v

       info.data.push({ title: title, timestamp: timestamp, url: url, id: videoId, image: image })

     })

   }

   let { data } = info

   if (data.length > 1)  {

      info = await selectSong(data, info, message).catch(()=>{})
      if (!info) return

    }

    let serverQueue = client.musicQueue.get(message.guild.id)

    if (serverQueue){
      return serverQueue.songs.push(info.data[0])
    } else {
      serverQueue = client.musicQueue.set(message.guild.id, {textChannel: message.channel, voiceChannel: message.member.voice.channel, connection: null, songs: [], volume: 80, playing: true} ).get(message.guild.id)
      serverQueue.songs.push(info.data[0])
    }

    const play = async (song) => {

      const queue = client.musicQueue.get(message.guild.id)

      if (!song) {

        queue.voiceChannel.leave()
        return client.musicQueue.delete(message.guild.id)

      }

     const dispatcher = queue.connection.play(ytdl(song.url, { filter: 'audioonly' } ))

     dispatcher.on('finish', () => {
       queue.songs.shift()
       play(queue.songs[0])
     })

     dispatcher.on('error', (err) => {
       queue.textChannel.send(error(`An error occured while playing the current music.\n\`\`\`xl\n${err}\n\`\`\``))
       queue.songs.shift()
       play(queue.songs[0])
     })

     dispatcher.setVolumeLogarithmic(queue.volume / 200)

     queue.textChannel.send(`🎶 Start playing: **${song.title}**`)

    }

    try {

      const connection = await channel.join()
      serverQueue.connection = connection
      play(serverQueue.songs[0])

    } catch (err) {

      message.client.musicQueue.delete(message.guild.id)
      await channel.leave()
      return message.channel.send(`Error: Oops! seems like an undocumented error has popped up!\n\`\`\`xl\n${err}\n\`\`\``)

    }
  }
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}

function selectSong(data, info, message){
 return new Promise( async (resolve,reject) => {
    let msg ='';

    for (let i in data) msg += `**[${parseInt(i) + 1}]** [${data[i].title}](${data[i].url}) \`${data[i].timestamp}\`\n`

    const mm = await message.channel.send( new MessageEmbed().setAuthor(`Please enter the number of the song to play (1 - ${data.length})`).setColor('GREY').setDescription(msg))

    const collector = message.channel.createMessageCollector(m => (!isNaN(m.content) && (Number(m.content) <= data.length) && (Number(m.content) > 0) && (m.author.id === message.author.id)))

    setTimeout(()=> collector.stop('timeout'), 30000)

    collector.on(`collect`, m => {

      collector.stop()
      info.data = [ data[parseInt(m.content)- 1] ]
      try {
        mm.edit(new MessageEmbed().setColor('GREY').setDescription(`Selected **[${info.data[0].title}](${info.data[0].url})**\n\nThe song has been added to queue.`).setThumbnail(info.data[0].image))
      } catch (err) {
        message.channel.send(new MessageEmbed().setColor('GREY').setDescription(`Selected **[${info.data[0].title}](${info.data[0].url})**\n\nThe song has been added to queue.`).setThumbnail(info.data[0].image))
      }
      resolve(info)

    })

    collector.on(`end`, (x,r) => {
      if (r === 'timeout') {
        try {
          mm.edit(error(`None of the music were selected!`))
        } catch (err) {}
          reject()
      }
    })
  })
}
