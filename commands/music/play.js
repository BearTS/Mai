const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const ytdlDiscord = require("ytdl-core-discord");
const yts = require("yt-search");
const fs = require('fs');

module.exports = {
  name: 'play',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'play songs',
  examples: ['play Why by Sabrina Carpenter', 'play https://www.youtube.com/watch?v=fhH4pbRJh0k'],
  parameters: ['Song name or URl of the song'],
  run:  async function (client, message, args) {
    let channel = message.member.voice.channel;
      if (!channel)return message.channel.send("I'm sorry but you need to be in a voice channel to play music!");

      const permissions = channel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT"))return message.channel.send("I cannot connect to your voice channel, make sure I have the proper permissions!");
      if (!permissions.has("SPEAK"))return message.channel.send("I cannot speak in this voice channel, make sure I have the proper permissions!");

      var searchString = args.join(" ");
      if (!searchString)return message.channel.send("You didn't poivide want i want to play");
     	const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
     var serverQueue = message.client.queue.get(message.guild.id);

       let songInfo = null;
      let song = null;
      if (url.match(/^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi)) {
         try {
            songInfo = await ytdl.getInfo(url)
            if(!songInfo)return message.channel.send("Looks like i was unable to find the song on YouTube");
          song = {
         id: songInfo.videoDetails.videoId,
         title: songInfo.videoDetails.title,
         url: songInfo.videoDetails.video_url,
         img: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url,
        duration: songInfo.videoDetails.lengthSeconds,
        ago: songInfo.videoDetails.publishDate,
        views: String(songInfo.videoDetails.viewCount).padStart(10, ' '),
        req: message.author

          };

        } catch (error) {
          console.error(error);
          return message.reply(error.message).catch(console.error);
        }
      }else {
        try {
          var searched = await yts.search(searchString);
      if(searched.videos.length === 0)return message.channel.send("Looks like i was unable to find the song on YouTube")

       songInfo = searched.videos[0]
          song = {
        id: songInfo.videoId,
        title: Util.escapeMarkdown(songInfo.title),
        views: String(songInfo.views).padStart(10, ' '),
        url: songInfo.url,
        ago: songInfo.ago,
        duration: songInfo.duration.toString(),
        img: songInfo.image,
        req: message.author
          };
        } catch (error) {
          console.error(error);
          return message.reply(error.message).catch(console.error);
        }
      }

      if (serverQueue) {
        serverQueue.songs.push(song);
        let sakuconfirm = new MessageEmbed()
        .setAuthor("Song has been added to queue", "https://i.imgur.com/A0H2KZ6.png")
        .setColor(`#ffb6c1`)
        .addField("Title", song.title, true)
        .addField("Duration of song", song.duration, true)
        .addField("Requested by", song.req.tag, true)
        .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`)
        return message.channel.send(sakuconfirm);
      }

      const queueConstruct = {
        textChannel: message.channel,
        voiceChannel: channel,
        connection: null,
        songs: [],
        volume: 80,
        playing: true,
        loop: false
      };
      message.client.queue.set(message.guild.id, queueConstruct);
      queueConstruct.songs.push(song);

      const play = async (song) => {
        const queue = message.client.queue.get(message.guild.id);
   let stream = null;
      if (song.url.includes("youtube.com")) {

        stream = await ytdl(song.url);
  stream.on('error', function(er)  {
        if (er) {
          if (queue) {
          queue.songs.shift();
          play(queue.songs[0]);
    	  return message.channel.send(`An unexpected error has occurred.\nPossible type \`${er}\``)
            }
          }
      });
  }
      queue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));

        const dispatcher = queue.connection
           .play(ytdl(song.url, {quality: 'highestaudio', highWaterMark: 1 << 25 ,type: "opus"}))
           .on("finish", () => {
             const shiffed = queue.songs.shift();
              if (queue.loop === true) {
                  queue.songs.push(shiffed);
              };
            play(queue.songs[0])
          })

        dispatcher.setVolumeLogarithmic(queue.volume / 100);
        let sakuplaying = new MessageEmbed()
        .setAuthor("Started Playing Music!", "https://i.imgur.com/A0H2KZ6.png")
        .setColor(`#ffb6c1`)
        .addField("Title", song.title, true)
        .addField("Duration of song", song.duration, true)
        .addField("Requested by", song.req.tag, true)
        .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`)
        queue.textChannel.send(sakuplaying);
      };

      try {
        const connection = await channel.join();
        queueConstruct.connection = connection;
        play(queueConstruct.songs[0]);
      } catch (error) {
        console.error(`I could not join the voice channel: ${error}`);
        message.client.queue.delete(message.guild.id);
        await channel.leave();
        return message.channel.send(`I could not join the voice channel: ${error}`);
      }
  },
};
