const { Util, MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const yts = require("yt-search");
const ytdlDiscord = require("ytdl-core-discord");
var ytpl = require('ytpl');
const fs = require('fs');

module.exports = {
  name: 'playlist',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'play from Playlist',
  examples: ['playlist https://www.youtube.com/playlist?list=PLUcbF9vE4EPZuP-Kf4K4pQ3Rj-n1JyPcG'],
  parameters: ['url of playlist'],
  run:  async function (client, message, args) {
    const channel = message.member.voice.channel;
		if (!channel) return message.channel.send("I'm sorry but you need to be in a voice channel to play music!");
		const url = args[0] ? args[0].replace(/<(.+)>/g, "$1") : "";
		var searchString = args.join(" ");
		const permissions = channel.permissionsFor(message.client.user);
		if (!permissions.has("CONNECT")) return message.channel.send("I cannot connect to your voice channel, make sure I have the proper permissions!");
		if (!permissions.has("SPEAK")) return message.channel.send("I cannot speak in this voice channel, make sure I have the proper permissions!");

		if (!searchString||!url) return message.channel.send(`Usage: ${message.client.config.prefix}playlist <YouTube Playlist URL | Playlist Name>`);
		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			try {
				const playlist = await ytpl(url.split("list=")[1]);
				if (!playlist) return message.channel.send("Playlist not found")
				const videos = await playlist.items;
				for (const video of videos) {
					// eslint-disable-line no-await-in-loop
					await handleVideo(video, message, channel, true); // eslint-disable-line no-await-in-loop
				}
				return message.channel.send({
					embed: {
						color: "GREEN",
						description: `✅  **|**  Playlist: **\`${videos[0].title}\`** has been added to the queue`
					}
				})
			} catch (error) {
				console.error(error);
				return message.channel.send("Playlist not found :(",message.channel).catch(console.error);
			}
		} else {
			try {
				var searched = await yts.search(searchString)

				if (searched.playlists.length === 0) return message.channel.send("Looks like i was unable to find the playlist on YouTube")
				var songInfo = searched.playlists[0];
				let listurl = songInfo.listId;
				const playlist = await ytpl(listurl)
				const videos = await playlist.items;
				for (const video of videos) {
					// eslint-disable-line no-await-in-loop
					await handleVideo(video, message, channel, true); // eslint-disable-line no-await-in-loop
				}
				let sakuplconfirm = new MessageEmbed()
					.setAuthor("Playlist has been added to queue", "https://i.imgur.com/A0H2KZ6.png")
					.setColor(`#ffb6c1`)
					.setDescription(`✅  **|**  Playlist: **\`${songInfo.title}\`** has been added \`${songInfo.videoCount}\` video to the queue`)
				return message.channel.send(sakuplconfirm)
			} catch (error) {
				return message.channel.send("An unexpected error has occurred").catch(console.error);
			}
		}

		async function handleVideo(video, message, channel, playlist = false) {
			const serverQueue = message.client.queue.get(message.guild.id);
			const song = {
				id: video.id,
				title: Util.escapeMarkdown(video.title),
				views: video.views ? video.views : "-",
				ago: video.ago ? video.ago : "-",
                                duration: video.duration,
				url: `https://www.youtube.com/watch?v=${video.id}`,
				img: video.thumbnail,
				req: message.author
			};
			if (!serverQueue) {
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

				try {
					var connection = await channel.join();
					queueConstruct.connection = connection;
					play(message.guild, queueConstruct.songs[0]);
				} catch (error) {
					console.error(`I could not join the voice channel: ${error}`);
					message.client.queue.delete(message.guild.id);
					return message.channel.send(`I could not join the voice channel: ${error}`);

				}
			} else {
				serverQueue.songs.push(song);
				if (playlist) return;
				let sakuqueue = new MessageEmbed()
					.setAuthor("Song has been added to queue", "https://i.imgur.com/A0H2KZ6.png")
					.setColor(`#ffb6c1`)
					.addField("Title", song.title, true)
					.addField("Duration of song", song.duration, true)
					.addField("Requested by", song.req.tag, true)
					.setFooter(`Music System | \©️${new Date().getFullYear()} Mai`)
				return message.channel.send(sakuqueue);
			}
			return;
		}

async	function play(guild, song) {
			const serverQueue = message.client.queue.get(message.guild.id);
 let stream = null;
    if (song.url.includes("youtube.com")) {

      stream = await ytdl(song.url);
stream.on('error', function(er)  {
      if (er) {
        if (serverQueue) {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0]);
  	  return message.channel.send(`An unexpected error has occurred.\nPossible type \`${er}\``)

         }
       }
     });
}

      serverQueue.connection.on("disconnect", () => message.client.queue.delete(message.guild.id));
			const dispatcher = serverQueue.connection
         .play(ytdl(song.url,{quality: 'highestaudio', highWaterMark: 1 << 25 ,type: "opus"}))
        .on("finish", () => {
            const shiffed = serverQueue.songs.shift();
            if (serverQueue.loop === true) {
                serverQueue.songs.push(shiffed);
            };
            play(guild, serverQueue.songs[0]);
        })

    dispatcher.setVolume(serverQueue.volume / 100);
let sakuplayc = new MessageEmbed()
				.setAuthor("Started Playing Music!", "https://i.imgur.com/A0H2KZ6.png")
				.setColor(`#ffb6c1`)
				.addField("Title", song.title, true)
				.addField("Duration of song", song.duration, true)
				.addField("Requested by", song.req.tag, true)
				.setFooter(`Music System | \©️${new Date().getFullYear()} Mai`)
    serverQueue.textChannel.send(sakuplayc);
    }
	},
};
