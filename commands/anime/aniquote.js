const { MessageEmbed } = require('discord.js')
const { randomQuote } = require('animequotes')
const { searchAnime } = require('node-kitsu')

module.exports = {
  config: {
    name: "aniquote",
    aliases: ['aq','animequote'],
    guildOnly: false,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: 'anime',
  	description: 'Generate a random anime quote',
  	examples: [],
  	parameters: []
  },
  run: async ( client, message) => {

    const { quote, anime, id, name } = randomQuote()

    let image = null

    const res = await searchAnime(anime,0).catch(()=>{})

    if (res && res[0].attributes && res[0].attributes.coverImage && res[0].attributes.coverImage.original ) image = res[0].attributes.coverImage.original

    message.channel.send(new MessageEmbed()
    .setColor(`GREY`)
    .addField(`Quoted from ${anime}`,`${quote}\n\n-*${name}*`)
    .setImage(image)
    .setTimestamp()
    )
  }
}
