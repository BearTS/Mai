const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  name: "horoscope"
  , aliases: []
  , group: "fun"
  , description: "Find out what is your horoscope for today!"
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , examples: [
    'horoscope cancer'
  ]
  , parameters: []
  , run: async ( client, message, [ sign ]) => {

    if (!sign)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Please give me a sign to get the horoscope of!`)

    if (![
      'capricorn'
      , 'aquarius'
      , 'pisces'
      , 'aries'
      , 'taurus'
      , 'gemini'
      , 'cancer'
      , 'leo'
      , 'virgo'
      , 'libra'
      , 'scorpio'
      , 'sagittarius'
    ].includes(sign.toLowerCase())
  ) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, **${sign}** is not a valid sign!`)

    const res = await fetch(`http://sandipbgt.com/theastrologer/api/horoscope/${sign}/today`).then(res=> res.json()).catch(()=>null)

    if (!res) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Oops! History API is currently down!`)


    const symbol = {
        cancer: '♋'
      , aquarius: '♒'
      , aries: '♈'
      , taurus: '♉'
      , virgo: '♍'
      , scorpio: '♏'
      , libra: '♎'
      , gemini: '♊'
      , leo: '♌'
      , sagittarius: '♐'
      , capricorn: '♑'
      , pisces: '♓'
    }

    const {
        horoscope
      , sunsign
      , meta: { mood, intensity, keywords }
    } = res

    message.channel.send(new MessageEmbed()

      .setAuthor(
          `${symbol[sign.toLowerCase()]} ${
            sunsign
            ? sunsign
            : sign
          }`
        , null
        , 'http://new.theastrologer.com'
      )

      .setDescription(horoscope.replace('(c) Kelli Fox, The Astrologer, http://new.theastrologer.com', ''))

      .addField(
          `Mood`
        , mood
          ? mood
          : '\u200B'
        , true
      )

      .addField(
          `Intensity`
        , intensity
          ? intensity
          : '\u200B'
        , true
      )

      .addField(
          `Keywords`
        , keywords
          ? keywords
          : '\u200B'
        , true
      )

      .setColor('GREY')

      .setFooter(`Horoscope | \©️${new Date().getFullYear()} Mai`)
    )
  }
}
