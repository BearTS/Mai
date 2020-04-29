const { MessageEmbed } = require('discord.js');
const { version, author} = require('../../package.json');
const { heapUsed, heapTotal } = process.memoryUsage()
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
const os = require('os');

module.exports.run = (client, message, args) => {

  let recieved = 0
  client.guilds.cache.each( guild => {
    guild.channels.cache.each( channel => {
      if (channel.type !== 'text') return
      recieved += channel.messages.cache.filter(m => m.author.id !== client.user.id).size
    })
  })

  let sent = 0
  client.guilds.cache.each( guild => {
    guild.channels.cache.each( channel => {
      if (channel.type !== 'text') return
      sent += channel.messages.cache.filter(m => m.author.id === client.user.id).size
    })
  })

  return message.channel.send(new MessageEmbed()
  .setAuthor(`${client.user.username} version Bunny[Pyon-Pyon]-${version} by ${author}`,client.user.displayAvatarURL({format:'png',dynamic:true}))
  .setColor(message.guild.me.displayColor !== 0 ? message.guild.me.displayColor : '#a9a9a9')
  .addField(`❯\u2000Received Msg`,recieved, true)
  .addField(`❯\u2000Sent Msg`, sent, true)
  .addField(`❯\u2000Commands`, client.commands.size, true)
  .addField(`❯\u2000Server`,client.guilds.cache.size, true)
  .addField(`❯\u2000Channels`, client.channels.cache.size, true)
  .addField(`❯\u2000Users`, client.users.cache.size, true)
  .addField(`❯\u2000OS`, process.platform, true)
  .addField(`❯\u2000Version`, os.release(), true)
  .addField(`❯\u2000Node`, process.version, true)
  .addField(`❯\u2000Uptime`, moment.duration(client.uptime, 'milliseconds').format('D [days] H [hours] m [minutes] s [seconds]'), true)
  .addField('❯\u2000Memory', `${heapUsed / 1000 < 999 ? roundTo(heapUsed,2)+'KiB' : roundTo(heapUsed / 1000000,2) + 'MiB'} [${roundTo(heapUsed / heapTotal * 100,2)}%]`, true)
  .addField('❯\u2000\Links', `•\u2000\[Website](https://maisans-maid.github.io/MaiSakurajima/)\n\•\u2000\[GitHub](https://github.com/maisans-maid/MaiSakurajima/)`,true)
)

}

module.exports.config = {
  name: "stats",
  aliases: [],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "bot",
  description: "Returns bot stats",
  examples: [],
  parameters: []
}

function roundTo(n, digits) {
    var negative = false;
    if (digits === undefined) {
        digits = 0;
    }
        if( n < 0) {
        negative = true;
      n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(2);
    if( negative ) {
        n = (n * -1).toFixed(2);
    }
    return n;
}
