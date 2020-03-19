const ytdl = require('ytdl-core')
const ytsearch = require('yt-search')
const {RichEmbed} = require('discord.js')
const settings = require("./../../botconfig.json");

module.exports.run = (bot,message,args) => {

  checkvoiceChanel(message).then(vc=>{
    if (vc.err) return message.react('👎').then(()=>message.reply(vc.err)).catch(console.error)

    //check client permissions
    const permissions = vc.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT')) return message.react('👎').then(()=>message.channel.send(`I cannot connect to your voice channel, make sure I have the proper permissions!`)).catch(console.error)
    if (!permissions.has('SPEAK')) return message.react('👎').then(()=>message.channel.send(`I cannot speak in this voice channel, make sure I have the proper permissions!`)).catch(console.error)

    const serverQueue = message.client.musicQueue.get(message.guild.id);
    let song;
    getArgs(args).then(res => {
      if (res.err){
        return message.react('👎').then(()=>message.channel.send(res.err)).catch(console.error)
      }
      getSongInfo(res,message).then(async song => {
        if (song.err){
          return message.react('👎').then(()=>message.channel.send(song.err)).catch(console.error)
        }

        if (serverQueue) {
          serverQueue.songs.push(song);
          return message.channel.send(`✅ **${song.title}** has been added to the queue!`);
        }

        const queueConstruct = {
          textChannel: message.channel,
          voiceChannel: message.member.voiceChannel,
          connection: null,
          songs: [],
          volume: 2,
          playing: true
        };
        message.client.musicQueue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);

        const play = async song => {
          const queue = message.client.musicQueue.get(message.guild.id);
          if (!song) {
            queue.voiceChannel.leave();
            message.client.musicQueue.delete(message.guild.id);
            return;
          }
          const stream = await ytdl(song.url,{filter:'audioonly'})
          const dispatcher = await queue.connection.playStream(stream)

          dispatcher.on('end', () => {
              queue.songs.shift();
              play(queue.songs[0]);
            })

          dispatcher.on('error', error => console.error(error));

          dispatcher.setVolumeLogarithmic(queue.volume / 5);

          queue.textChannel.send(`🎶 Start playing: **${song.title}**`);
        };

        try {
          const connection = await vc.join();
          queueConstruct.connection = connection;
          play(queueConstruct.songs[0]);
        } catch (error) {
          console.error(`I could not join the voice channel: ${error}`);
          message.client.musicQueue.delete(message.guild.id);
          await vc.leave();
          return message.channel.send(`I could not join the voice channel: ${error}`);
        }

      })
    })
  })
}

module.exports.help = {
  name: 'play',
  aliases: ['p'],
	group: 'music',
	description: 'Plays the provided music, or queues it if theres already playing.',
	examples: ['p Gotoubun no Kimochi','play https://www.youtube.com/watch?v=kE3jfs5q0sg'],
	parameters: ['search query','youtube url']
}

function checkvoiceChanel(message){
  return new Promise((resolve,reject)=>{
    const {voiceChannel} = message.member

    if (!voiceChannel) resolve({err:`**${message.member.displayName}**, you are not in a Voice Channel!`})

    resolve(voiceChannel)
  })
}

function getArgs(args) {
  return new Promise((resolve,reject)=>{
    regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;

    //check if there is a url or query to work with
    if (args.length===0){
      resolve({err:'Please provide a `link` to the youtube music or a `query` to search with'})
    }
    //check if the argument provided is a link
    if (regexp.test(args.toString())){
      resolve(/*{err:`At the moment, i can't support a direct youtube link. Please use the query method instead. This will be fixed after ytdl-core has fixed this issue on their end`}*/[{url:args.toString()}])
    }

    //if its not a valid link, search youtube for link using the query
    ytsearch(args.join(' '), function (err,res) {
      if (err) resolve({err:`Sorry, something went wrong while searching **${args.join(' ')}** on youtube.`})
      data = []

      videos = res.videos.slice(0,5)
      videos.forEach(video => {
        data.push({
          title: video.title,
          timestamp: video.timestamp,
          url: video.url,
          id: video.videoId,
          image: video.image
        })
      })
      resolve(data)
    })

  })
}

function minutes(sec) {
    if (isNaN(Number(sec))) return(NaN)
    let totalseconds = Number(sec)
    let minutes = Math.floor(totalseconds / 60)
    let seconds = totalseconds - (60 * minutes)
    if (seconds < 10) {
      seconds = `0${seconds}`
    }
    return (`${minutes}:${seconds}`)
}

function getSongInfo(res,message){
  return new Promise(async(resolve,reject)=>{
    if (res.length>1){
        let msg = ''
        for(let i in res){
          msg += `**[${parseInt(i)+1}]** [${res[i].title}](${res[i].url}) \`${res[i].timestamp}\`\n`
        }
        const em = new RichEmbed().setAuthor(`Enter the number of the song to play (1-${res.length})`).setColor(settings.colors.embedDefault).setDescription(msg)
        message.channel.send (em)

        const collector = await message.channel.createMessageCollector(m => (!isNaN(m.content) && (Number(m.content) <= res.length) && (Number(m.content) > 0) && (m.author.id === message.author.id)))

        setTimeout(()=>{
          collector.stop()
          resolve({err:`Collecting timed out`})
        },30000)

        collector.on(`collect`, (m) => {
          collector.stop()
          resolve(res[Number(m.content)-1])
        })
      } else if (res.length===1) {
        ytdl.getInfo(res[0].url).then((info)=> {
          resolve({
          title: info.title,
          timestamp: minutes(info.length_seconds),
          url: res[0].url,
          id: info.video_id,
          image: null
        })
      }).catch(()=>{
        resolve({err:`The link you provided is not a valid Youtube URL.`})
      })
    }
  })
}
