const xpSchema = require('../../models/xpSchema.js')
const { magenta } = require('chalk')
const { connection } = require('mongoose')
const { MessageEmbed } = require('discord.js')
const { ordinalize } = require('../../helper.js')
const { constructImage } = require('../../utils/pointsystem/xpImage.js')

module.exports.run = (client, message, args ) => {

  if (!client.guildsettings.get(message.guild.id) || !client.guildsettings.get(message.guild.id).isxpActive) {
    return message.channel.send(new MessageEmbed().setColor('RED').setDescription(`XP is currently disabled in this server.`))
  }

  const { xpExceptions } = client.guildsettings.get(message.guild.id)

  if (xpExceptions.includes(message.channel.id)) return message.channel.send(new MessageEmbed().setColor('RED').setDescription(`XP is currently disabled in this channel.`))

  const member = message.mentions.members.first() || message.member

  xpSchema.findOne({guildID: message.guild.id, userID: member.id}, async (err, xp) => {

    if (err) return console.log(`${magenta('[Mai-Promise ERROR]')} : Unable to connect to MongoDB.`)

    if (!xp) {

      xp = await new xpSchema({ guildID: message.guild.id, userID: member.id, points: 0, level: 1, bg: 'https://i.imgur.com/djHyEE0.png'}).save()

    }

    if (!xp) return console.log(`${magenta('[Mai-Promise ERROR]')} : Failed to create new server xp document for ${message.guild.name}.`)

    let level = xp.level
    let points = xp.points
    let cap = 150 * (level * 2)
    let maxXPThisLevel = (level * cap) - ((level -1) * (150 * (level-1) * 2))
    let curXPThisLevel = points - ((level-1) * (150 * (level-1) * 2))

    let percentage = Math.round((curXPThisLevel / maxXPThisLevel) * 100)



    connection.db.collection('xperiencepoints', (err, collection) => {

      if (err) return message.channel.send( new MessageEmbed().setColor('RED').setDescription(`An unexpected error occured!`))
      collection.find({}).toArray( async (err, rankings) => {

        if (err) return message.channel.send( new MessageEmbed().setColor('RED').setDescription(`An unexpected error occured!`))

        rankings = rankings.filter(m => m.guildID === message.guild.id)
        rankings.sort( (a,b) => b.points - a.points)

        const rank = ordinalize(rankings.findIndex(item => item.userID === message.author.id) + 1)
        const wreaths = ['https://i.imgur.com/xsZHQcW.png','https://i.imgur.com/NmpP8oU.png','https://i.imgur.com/bzhoYpa.png','https://i.imgur.com/NSEbnek.png']
        const indexer = rankings.findIndex(item => item.userID === message.author.id)
        let wreath = wreaths[indexer]

        if (!wreath && (indexer > 3 && indexer < 10)) wreath = wreaths[3]

        const image = await constructImage(member,{ curXPThisLevel: curXPThisLevel, maxXPThisLevel: maxXPThisLevel, level: level, rank: rank, percentage: percentage, wreath: wreath },xp.bg)

        message.channel.send(image)

      })
    })
  })
}

module.exports.config = {
  name: "rank",
  aliases: ['lvl','xp'],
  cooldown:{
    time: 30,
    msg: "Please limit the usage of this command."
  },
  group: "core",
  guildOnly: true,
  description: "Shows the current xp, level, and rank of a user from the server if mentioned, or returns the data of the sender when none is mentioned.",
  examples: [],
	parameters: []
}
