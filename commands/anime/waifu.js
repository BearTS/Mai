const { MessageEmbed } = require('discord.js')
const waifuDB = require('../../assets/json/waifulist.json')

module.exports = {
  name: 'waifu'
  , aliases: []
  , group: 'anime'
  , description: 'Generates random waifu.'
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , examples: []
  , parameters: []
  , run: (client, message) => {

//---------------------------------WORK IN PROGRESS-----------------------------------//

if (!message.channel.nsfw)
  return message.channel.send(`This command is still work on progress. Images can be NSFW at times, to view how this command works, go to a NSFW channel.`)

//--------------------------------WORK IN PROGRESS------------------------------------//

    const {
        id
      , names: {
          en
        , jp
        , alt
      }
      , from: {
          name
        , type
      }
      , images
      , statistics: {
          fav
        , love
        , hate
        , upvote
        , downvote
      }
    } = waifuDB[Math.floor(Math.random() * (waifuDB.length))]

    const no = Math.floor(Math.random() * images.length)

    message.channel.send( new MessageEmbed()

      .setAuthor(`${
          en
        }${
          jp
          ? ` • ${jp}`
          :''
        }`, null, images[no])

      .setColor('GREY')

      .setDescription(`${
          alt
          ? `${alt}\n\n`
          : ''
        }${
          name
        }\n*${
          type
        }*\n\n\u200b`)

      .setImage(images[no])

      .setFooter(`💖 ${
          ( 100 * (((1 - hate / (love + fav)) * 0.6) + ((upvote / (upvote + downvote)) * 0.4)) ).toFixed(2)
        }% Likability | Image #${
          no + 1
        } of ${
          images.length
        }`)

    ).then( m => m.react('💖'))
  }
}
