const { MessageEmbed } = require("discord.js");
const lyricsFinder = require("lyrics-finder");

module.exports = {
  name: 'lyrics',
  aliases: [],
  guildOnly: true,
  permissions: [],
  clientPermissions: [],
  group: 'music',
  description: 'Get lyrics for the currently playing song',
  examples: ['lyrics'],
  parameters: [],
  run:  async function (client, message, args) {

    const queue = message.client.queue.get(message.guild.id);
       if (!queue) return sendError("There is nothing playing.",message.channel).catch(console.error);

       let lyrics = null;

       try {
         lyrics = await lyricsFinder(queue.songs[0].title, "");
         if (!lyrics) lyrics = `No lyrics found for ${queue.songs[0].title}.`;
       } catch (error) {
         lyrics = `No lyrics found for ${queue.songs[0].title}.`;
       }

       let sakulyrics = new MessageEmbed()
         .setAuthor(`${queue.songs[0].title} — Lyrics`, "https://i.imgur.com/A0H2KZ6.png")
         .setColor(`#ffb6c1`)
         .setDescription(lyrics)
         .setFooter(`Music System | \©️${new Date().getFullYear()} Mai`);

       if (sakulyrics.description.length >= 2048)
         sakulyrics.description = `${sakulyrics.description.substr(0, 2045)}...`;
       return message.channel.send(sakulyrics).catch(console.error);
     },
   };
