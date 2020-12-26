const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const ytdlDiscord = require("ytdl-core-discord");
const YouTube = require("youtube-sr");
const fs = require('fs');

module.exports = {
  name: 'ytsearch',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Search for music',
  examples: ['ytsearch Why Sabrina Carpenter'],
  parameters: ['Name of the song'],
  run:  async function (client, message, args) {
    let channel = message.member.voice.channel;
        if (!channel)return message.channel.send("I'm sorry but you need to be in a voice channel to play music!");

        const permissions = channel.permissionsFor(message.client.user);
        if (!permissions.has("CONNECT"))return message.channel.send("I cannot connect to your voice channel, make sure I have the proper permissions!");
        if (!permissions.has("SPEAK"))return message.channel.send("I cannot speak in this voice channel, make sure I have the proper permissions!");

        var searchString = args.join(" ");
        if (!searchString)return message.channel.send("You didn't poivide want i want to search");

        var serverQueue = message.client.queue.get(message.guild.id);
        try {
               var searched = await YouTube.search(searchString, { limit: 10 });
              if (searched[0] == undefined)return message.channel.send("Looks like i was unable to find the song on YouTube");
                        let index = 0;
                        let maiPlay = new MessageEmbed()
                            .setColor(`#ffb6c1`)
                            .setAuthor(`Results for \"${args.join(" ")}\"`, message.author.displayAvatarURL())
                            .setDescription(`${searched.map(video2 => `**\`${++index}\`  |** [\`${video2.title}\`](${video2.url}) - \`${video2.durationFormatted}\``).join("\n")}`)
                            .setFooter(`Type the number of the song to add it to the playlist | Music System | \©️${new Date().getFullYear()} Mai`);
                        // eslint-disable-next-line max-depth
                        message.channel.send(maiPlay).then(m => m.delete({
                            timeout: 15000
                        }))
                        try {
                            var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 11, {
                                max: 1,
                                time: 20000,
                                errors: ["time"]
                            });
                        } catch (err) {
                            console.error(err);
                            return message.channel.send({
                                embed: {
                                    color: "RED",
                                    description: "Nothing has been selected within 20 seconds, the request has been canceled."
                                }
                            });
                        }
                        const videoIndex = parseInt(response.first().content);
                        var video = await (searched[videoIndex - 1])

                    } catch (err) {
                        console.error(err);
                        return message.channel.send({
                            embed: {
                                color: "RED",
                                description: "🆘  **|**  I could not obtain any search results"
                            }
                        });
                    }

                response.delete();
      var songInfo = video

        const song = {
          id: songInfo.id,
          title: Util.escapeMarkdown(songInfo.title),
          views: String(songInfo.views).padStart(10, ' '),
          ago: songInfo.uploadedAt,
          duration: songInfo.durationFormatted,
          url: `https://www.youtube.com/watch?v=${songInfo.id}`,
          img: songInfo.thumbnail.url,
          req: message.author
        };

        if (serverQueue) {
          serverQueue.songs.push(song);
          let maiqueue = new MessageEmbed()
          .setAuthor("Song has been added to queue", "https://i.imgur.com/A0H2KZ6.png")
          .setColor(`#ffb6c1`)
          .addField("Title", song.title, true)
          .addField("Duration of song", song.duration, true)
          .addField("Requested by", song.req.tag, true)
        .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`)
          return message.channel.send(maiqueue);
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
              play(queue.songs[0]);
            })

          dispatcher.setVolumeLogarithmic(queue.volume / 100);
          let maiPlay = new MessageEmbed()
          .setAuthor("Started Playing Music!", "https://i.imgur.com/A0H2KZ6.png")
          .setColor(`#ffb6c1`)
          .addField("Title", song.title, true)
          .addField("Duration of song", song.duration, true)
          .addField("Requested by", song.req.tag, true)
        .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`)
          queue.textChannel.send(maiPlay);
        };

        try {
          const connection = await channel.join();
          queueConstruct.connection = connection;
          channel.guild.voice.setSelfDeaf(true)
          play(queueConstruct.songs[0]);
        } catch (error) {
          console.error(`I could not join the voice channel: ${error}`);
          message.client.queue.delete(message.guild.id);
          await channel.leave();
          return message.channel.send(`I could not join the voice channel: ${error}`);
        }
      },
    };
