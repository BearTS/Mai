const { MongooseModels: { xpSchema }, TextHelpers: { ordinalize }} = require('../../helper')
const { Error: MongooseError } = require('mongoose')
const { createCanvas, loadImage } = require('canvas')
const { MessageAttachment, MessageEmbed } = require('discord.js')

module.exports = {
  name: 'rank'
  , aliases: [
    'lvl'
    , 'xp'
  ]
  , guildOnly: true
  , rankcommand: true
  , clientPermissions: [
    'ATTACH_FILES'
    , 'EMBED_LINKS'
  ]
  , group: 'core'
  , description: 'Shows the current xp, level, and rank of a user from the server if mentioned, or returns the data of the sender when none is mentioned.'
  , examples: []
  , parameters: []
  , run: async (client, message) => {


    const { exceptions, active } = client.guildsettings.get(message.guild.id).xp


    const embed = new MessageEmbed()
      .setColor('RED')
      .setThumbnail('https://i.imgur.com/qkBQB8V.png')


    if (!active)
      return message.channel.send(
        embed.setDescription(
          `**${message.member.displayName}**, XP is currently disabled in this server.\n\n`
          + `If you are the server Administrator, you may enable it by typing \`${client.config.prefix}xptoggle\`.\n`
          + `[Learn More](https://mai-san.ml/docs/features/XP_System) about Mai's XP System.`
        ).setAuthor('XP Systems Disabled','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setFooter(`XP Leaderboard | \©️${new Date().getFullYear()} Mai`)
      )


    if (exceptions.includes(message.channel.id))
      return message.channel.send(
        embed.setDescription(
          `**${message.member.displayName}**, XP is currently disabled in this channel.\n\n`
          + `To see which channels are xp-disabled, use the command \`${client.config.prefix}nonxpchannels\`\n`
          + `If you are the server Administrator, you may reenable it here by typing \`${client.config.prefix}xpenable #${message.channel.name}\`\n`
          + `[Learn More](https://mai-san.ml/docs/features/XP_System) about Mai's XP System.`
        ).setAuthor('Channel Blacklisted','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setFooter(`XP Leaderboard | \©️${new Date().getFullYear()} Mai`)
      )

    const match = message.content.match(/\d{17,19}/)

    const member = match
    ? await message.guild.members.fetch(match[0]).catch(()=> null) || message.member
    : message.member

    let document = await xpSchema.findOne({
        guildID: message.guild.id
      , userID: member.id
    }).catch((err)=> err)


    if (!document)
      document = await new xpSchema({
          guildID: message.guild.id
        , userID: member.id
      }).save().catch((err)=> err)


    if (document instanceof MongooseError)
      return message.channel.send(
        embed.setDescription(
          `**${message.member.displayName}**, I am unable to contact the database.\n\n`
          + `Please try again later or report this incident to my developer.`
        ).setAuthor('Database Error','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setFooter(`XP Leaderboard | \©️${new Date().getFullYear()} Mai`)
      )


    const { points, level } = document


    const cap = 150 * (level * 2)
    const currentLevel = {
        maxXP:  (level * cap) - ((level - 1) * (150 * (level - 1) * 2))
      , curXP:  points - ((level - 1) * (150 * (level - 1) * 2))
    }


    const percentage = Math.round((currentLevel.curXP / currentLevel.maxXP) * 100)

    const rank = await xpSchema.find({ guildID: message.guild.id})
      .then((res) => ordinalize(res.sort((a,b) => b.points - a.points).findIndex(user => user.userID === member.id) + 1))
        .catch(() => null)


    const wreath = [
        'https://i.imgur.com/xsZHQcW.png'
      , 'https://i.imgur.com/NmpP8oU.png'
      , 'https://i.imgur.com/bzhoYpa.png'
      , 'https://i.imgur.com/NSEbnek.png'
    ][parseInt(rank) > 3 && parseInt(rank) < 10
      ? 3
      : parseInt(rank) - 1
    ]


    const canvas = createCanvas(934, 282)
    const ctx = canvas.getContext('2d')
    const background = await loadImage('https://i.imgur.com/djHyEE0.png')

    ctx.drawImage(
        background
      , 0
      , 0
      , canvas.width
      , canvas.height
    )

    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    roundedRect(ctx, 25, 65, 897, 210, 20)
    ctx.fill()

    ctx.font = '50px sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(member.displayName, 245,110,500)

    ctx.font = '25px sans-serif'
    ctx.fillText(member.user.tag, 250, 142, 500)

    ctx.fillStyle = '#C0C0C0'
    ctx.fillText(
        `XP: ${currentLevel.curXP}/${currentLevel.maxXP} | Level: ${level}`
      , 850 - ctx.measureText(  `XP: ${currentLevel.curXP}/${currentLevel.maxXP} | Level: ${level}`).width
      , 250
    )

    ctx.font = '20px sans-serif'
    ctx.fillText('RANK:', 750, 95)

    ctx.font = '35px sans-serif'
    ctx.fillStyle = '#f0f0f0'
    ctx.fillText(rank, 810, 95)

    ctx.beginPath()
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'
    ctx.lineWidth = 50
    ctx.lineCap = 'round'
    ctx.moveTo(258, 196.71)
    ctx.lineTo(855, 196.71)
    ctx.stroke()

    const gradient = ctx.createLinearGradient(258, 0, 850, 0)
    gradient.addColorStop(0, "#ff00ff")
    gradient.addColorStop(0.5 ,"#0000ff")
    gradient.addColorStop(1.0, "#ff0000")

    ctx.beginPath()
    ctx.strokeStyle = gradient
    ctx.lineWidth = 30
    ctx.lineCap = 'round'
    ctx.moveTo(258,196.71)
    ctx.lineTo((258+(592*(percentage/100))),196.71)
    ctx.stroke()

    ctx.beginPath()
    ctx.arc(140, 141, 100, 0, Math.PI * 2, true)
    ctx.fillStyle = 'rgba(0,0,0,0.8)'
    ctx.closePath();
    ctx.fill()

    if (wreath){

      const wr = await loadImage(wreath)
      ctx.beginPath()
      ctx.arc(140, 141, 100, 0, Math.PI * 2, true)
      ctx.closePath()
      ctx.clip()
      ctx.drawImage(wr,40,41,200,200)

    }

    ctx.beginPath()
    ctx.arc(140,141,80,0,Math.PI * 2,true)
    ctx.closePath();
    ctx.clip()
    const avatar = await loadImage(member.user.displayAvatarURL({ format: 'png', dynamic: false}));
    ctx.drawImage(avatar,60, 61, 160, 160)

    if (wreath){

      const wr = await loadImage(wreath)
      ctx.beginPath()
      ctx.arc(140, 141, 100, 0, Math.PI * 2, true)
      ctx.closePath()
      ctx.clip()
      ctx.drawImage(wr,40,41,200,200)

    }

    return message.channel.send( new MessageAttachment(canvas.toBuffer(), 'rank.png'))

  }
}

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.lineTo(x + width - radius, y + height);
  ctx.arcTo(x + width, y + height, x + width, y + height-radius, radius);
  ctx.lineTo(x + width, y + radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.lineTo(x + radius, y);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.stroke();
}
