const { MessageEmbed } = require("discord.js")
const fetch = require('node-fetch')

module.exports.run = async ( client, message, [ sign ]) => {

  if (!sign) return message.channel.send(error(`Please give me a sign to get the horoscope of!`))

  if (!["capricorn","aquarius","pisces","aries","taurus","gemini","cancer","leo","virgo","libra","scorpio","sagittarius"].includes(sign.toLowerCase())) {

    return message.channel.send(error(`**${sign}** is not a valid sign!`))

  }

  const res = await fetch(`http://sandipbgt.com/theastrologer/api/horoscope/${sign}/today`).then(res=> res.json()).catch(()=>{})

  if (!res) return message.channel.send(error(`Oops! History API is currently down`))

  const { horoscope, sunsign, meta: { mood, intensity, keywords } } = res

  message.channel.send(new MessageEmbed()
    .setAuthor(sunsign ? sunsign : sign, null,'http://new.theastrologer.com')
    .setDescription(horoscope.replace('(c) Kelli Fox, The Astrologer, http://new.theastrologer.com', ''))
    .addField(`Mood`, mood ? mood : '\u200B', true)
    .addField(`Intensity`, intensity ? intensity : '\u200B', true)
    .addField(`Keywords`, keywords ? keywords : '\u200B', true)
    .setColor('GREY')
    .setFooter(`Today's Horoscope`)
  )
}

module.exports.config = {
  name: "horoscope",
  aliases: [],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "fun",
  description: "Find out what is your horoscope for today!" ,
  examples: ['horoscope cancer'],
  parameters: []
}

function error(err){
  return new MessageEmbed()
  .setDescription(`\u200B\n${err}\n\u200B`)
  .setColor('RED')
}
