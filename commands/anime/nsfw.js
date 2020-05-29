const { MessageEmbed } = require('discord.js')
const nekos = require('nekos.life')
const validTypes = [`anal`, `avatar`, `bJ`, `blowJob`, `boobs`, `classic`, `cumArts`, `cumsluts`, `ero`, `eroFeet`, `eroKemonomimi`, `eroKitsune`, `eroNeko`, `eroYuri`, `feet`, `feetGif`, `femdom`, `futanari`, `girlSolo`, `girlSoloGif`, `hentai`, `holo`, `holoEro`, `kemonomimi`, `keta`, `kitsune`, `kuni`, `lesbian`, `neko`, `nekoGif`, `pussy`, `pussyArt`, `pussyWankGif`, `randomHentaiGif`, `yuri`, `tits`, `trap`]

module.exports = {
  config: {
    name: "nsfw",
    aliases: ['lewd'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: {
      time: 10,
      msg: 'Oops! Aren\'t you a bit hawny?!'
    },
    group: 'anime',
    description: 'Generate random anime nsfw image depending on the category.\n\nHere are the complete list of categories:\n\n`anal`, `avatar`, `bJ`, `blowJob`, `boobs`, `classic`, `cumArts`, `cumsluts`, `ero`, `eroFeet`, `eroKemonomimi`, `eroKitsune`, `eroNeko`, `eroYuri`, `feet`, `feetGif`, `femdom`, `futanari`, `girlSolo`, `girlSoloGif`, `hentai`, `holo`, `holoEro`, `kemonomimi`, `keta`, `kitsune`, `kuni`, `lesbian`, `neko`, `nekoGif`, `pussy`, `pussyArt`, `pussyWankGif`, `randomHentaiGif`, `yuri`, `tits`, `trap`',
  	examples: ['nsfw boobs','nsfw ','nsfw avatar'],
  	parameters: ['Category']
  },
  run: async ( client, message, [ type ] ) => {

    if (!message.channel.nsfw) {

      client.cooldowns.get('nsfw').delete(message.author.id, 10 * 1000)
      return message.channel.send(error(`Sorry! This command is only valid on a **nsfw** channel!`))

    }

    if (!type) type = validTypes[Math.floor(Math.random() * (validTypes.length - 1))]

    if (['category','categories','type','types','help'].includes(type.toLowerCase())) {

      return message.channel.send(new MessageEmbed()
      .setColor('RED')
      .setAuthor('NSFW Valid Types / Categories list')
      .setDescription(validTypes.join(', '))
      .addField('\u200B','*Types and / or Categories are case sensitive.')
      )

    }

    if (!validTypes.includes(type)) {

      alt = validTypes.find(m => m.toLowerCase() === type.toLowerCase())
      client.cooldowns.get('nsfw').delete(message.author.id)
      return message.channel.send(error(`**${type}** category was not found on NSFW categories list. ${alt ? `Did you mean **${alt}**?` : ''}`))

    }

    const { nsfw } = new nekos()

    const { url } = await nsfw[type]().catch(()=>{})

    if (!url) return message.channel.send(error(`Could not connect to nekos.life`))

    message.channel.send( new MessageEmbed()
      .setAuthor(type,null,url)
      .setImage(url)
      .setColor('RED')
    )
  }
}


function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
