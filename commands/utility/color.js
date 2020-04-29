const { MessageEmbed } = require('discord.js')

module.exports.run = (client, message, args) => {

  let color;

  if (!args.length ) color = `#${ Math.floor(Math.random() * 16777215).toString(16) }`

  if (args.join('').startsWith('#') && /(0x)?[0-9a-f]{6}/.test(args.join('').split('#').slice(1)[0])) color = args.join('')

  else color = `#${ Math.floor(Math.random() * 16777215).toString(16) }`

  return  message.channel.send( new MessageEmbed().setColor(color).setThumbnail(`https://dummyimage.com/125/${color.slice(1)}`).setFooter(color))


}

module.exports.config = {
  name: "color",
  aliases: ['colour','hex'],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "utility",
  description: "Shows a random color or a preview of the given color!",
  examples: ["color [color]"],
  parameters: ['color']
}
