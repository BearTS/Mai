const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const signs = require('../../util/constants').horoscope;

module.exports = {
  name: 'horoscope',
  aliases: [],
  group: 'fun',
  description: 'Find out your horoscope for today!',
  clientPermissions: [ 'EMBED_LINKS' ],
  examples: [
    'horoscope libra',
    'horoscope sagittarius'
  ],
  run: async (client, message, [sign] ) => {

    if (!sign){
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Please give me a sign to get the horoscope of!`);
    };

    if (!Object.keys(signs).includes(sign.toLowerCase())){
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, **${sign}** is not a valid sign!`);
    };

    const data = await fetch(`http://sandipbgt.com/theastrologer/api/horoscope/${sign}/today`)
    .then(res => res.json())
    .catch(() => null);

    if (!data){
      return message.channel.send(`Server Error 5xx: Horoscope API is currently down!`);
    };

    return message.channel.send(
      new MessageEmbed()
      .setColor('GREY')
      .setFooter(`Horoscope | \©️${new Date().getFullYear()} Mai`)
      .setAuthor(signs[sign.toLowerCase()] + ' ' + data.sunsign || sign)
      .setDescription(data.horoscope.replace('(c) Kelli Fox, The Astrologer, http://new.theastrologer.com', ''))
      .addFields([
        { name: 'Mood', inline: true, value: data.meta.mood || '\u200b' },
        { name: 'Intensity', inline: true, value: data.meta.intensity || '\u200b' },
        { name: 'Keywords', inline: true, value: data.meta.keywords || '\u200b' }
      ])
    );
  }
};
