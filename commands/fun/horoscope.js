const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
const fetch = require('node-fetch');

module.exports.run = async (bot, message, args) => {
  const signs = [
      "capricorn",
      "aquarius",
      "pisces",
      "aries",
      "taurus",
      "gemini",
      "cancer",
      "leo",
      "virgo",
      "libra",
      "scorpio",
      "sagittarius"
  ];
  const icon = [
    "http://icons.iconarchive.com/icons/icons8/android/512/Astrology-Capricorn-icon.png",
    "https://cdn0.iconfinder.com/data/icons/zodiac-signs-14/100/Artboard_10-512.png",
    "https://cdn0.iconfinder.com/data/icons/astrology-symbols/100/astro-signs-12-512.png",
    "https://cdn3.iconfinder.com/data/icons/horoscope-2/30/aries-512.png",
    "https://cdn0.iconfinder.com/data/icons/zodiac-signs-14/100/Artboard_2-512.png",
    "https://cdn0.iconfinder.com/data/icons/zodiac-signs-12/48/Gemini-512.png",
    "http://icons.iconarchive.com/icons/icons8/android/512/Astrology-Cancer-icon.png",
    "https://cdn4.iconfinder.com/data/icons/horoscope-v2-outline/24/horoscope-horoscopes-sign-zodiac-stars-astrology-leo-512.png",
    "https://cdn1.iconfinder.com/data/icons/symbol-2/20/80-512.png",
    "https://cdn0.iconfinder.com/data/icons/zodiac-signs-12/48/Libra-512.png",
    "https://cdn0.iconfinder.com/data/icons/zodiac-signs-14/100/Artboard_8-512.png",
    "https://cdn3.iconfinder.com/data/icons/zodiac-horoscope/24/sagittarius-512.png"
  ];
  const sign = message.content.split(/\s+/g).slice(1).join(" ");
  if (!sign) return message.channel.send("Please give me a sign to get the horoscope of!");
  if (!signs.includes(sign.toLowerCase())) return message.channel.send('That is not a valid sign!');
  var i;
  for (i = 0; i < signs.length; i++){
    if (sign === signs[i]){
      iconId = i;
    }
  }

fetch(`http://sandipbgt.com/theastrologer/api/horoscope/${sign}/today`)
    .then(res => res.json())
    .then(json => {
      var replaced = json.horoscope.replace('(c) Kelli Fox, The Astrologer, http://new.theastrologer.com', '')
        const embed = new RichEmbed()
        .setThumbnail(icon[iconId])
        .setDescription(`**${json.sunsign ? json.sunsign : sign}** \n\n${replaced}`)
        .addField(`Mood`,json.meta.mood ? json.meta.mood : `No data.`,true)
        .addField(`Intensity`,json.meta.intensity ? json.meta.intensity : `No data.`,true)
        .addField(`keywords`,json.meta.keywords ? json.meta.keywords : `No data.`,true)
        .setColor(settings.colors.embedDefault);
        return new Promise(async(resolve,reject)=>{
          var hook = await message.channel.createWebhook(`Mikoto Aiura`,`https://i.imgur.com/PvDeHks.gif`)
          await hook.send(embed).catch(console.error);
          setTimeout(async function() {
              await hook.delete()
          }, 1000);
        })
    }
  ).catch(()=>{
    return new Promise(async(resolve,reject)=>{
      var hook = await message.channel.createWebhook(`Mikoto Aiura`,`https://i.imgur.com/PvDeHks.gif`)
      await hook.send(`Sorry! My API (Horoscope Machine) isn't working!`).catch(console.error);
      setTimeout(async function() {
          await hook.delete()
      }, 1000);
    })
  })

    }


  module.exports.help = {
    name: "horoscope",
    aliases: [],
  	group: 'fun',
  	description: 'Find out what is your horoscope for today!',
  	examples: ['horoscope'],
  	parameters: []
  }
