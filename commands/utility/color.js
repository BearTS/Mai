const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'color',
  aliases: ['colour','hex'],
  group: 'utility',
  description: "Shows a random color or a preview of the given color!",
  examples: ["color [color]"],
  parameters: ['color'],
  run: async (client, message, args) => {

    const color = args.length && args.join('').startsWith('#') && /(0x)?[0-9a-f]{6}/.test(args.join('').split('#').slice(1)[0])
                  ? args.join('')
                  : `#${ Math.floor(Math.random() * 16777215).toString(16) }`

    return  message.channel.send( new MessageEmbed()
              .setColor(color)
              .setImage(`https://dummyimage.com/200/${color.slice(1)}`)
              .setFooter(`Color ${color.slice(1)} | \©️${new Date().getFullYear()} Mai`)
            )
  }
}
