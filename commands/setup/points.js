const { MessageEmbed } = require('discord.js')
const gprofile = require('../../models/guildProfileSchema.js')
const { default : { prefix } } = require('../../settings.json')
const allowedResponses = ['xptoggle','economytoggle','xpexcempt','xpallow','excemptedchannels','xpreset','economyreset']
const experience = require('../../models/xpSchema.js')
const econschema = require('../../models/bankSchema.js')

module.exports.run = (client, message, args) => {

if (!args.length || args[0].toLowerCase() === 'help') return help(message)

if (!allowedResponses.includes(args[0])) return message.react("👎");

gprofile.findOne({guildID: message.guild.id}, async (err, data) => {

  if (err) return console.log(`${magenta('[Mai-Promise ERROR]')} : Unable to connect to MongoDB.`)

  if (!data) data = await new gprofile( {guildID: message.guild.id, welcomeChannel: null, welcomemsg:null, goodbyeChannel: null, goodbyemsg: null, isxpActive: false, xpExceptions:[], iseconomyActive: false} ).save()

  let gsettings = client.guildsettings.get(message.guild.id)
  if (!gsettings) gsettings = client.guildsettings.set(message.guild.id, data )

  switch(args[0].toLowerCase()){
//=============================================================================
    case 'xptoggle':

      if (data.isxpActive){

        data.isxpActive = false
        data.save().then(()=> {

          gsettings.isxpActive = false
          message.reply(`Disabled the xp system!`)

        }).catch((err)=>  message.react('👎'))

      } else {

        data.isxpActive = true
        data.save().then(()=>{

          gsettings.isxpActive = true
          message.reply(`Enabled the xp system!`)

        }).catch((err)=>  message.react('👎'))
      }
    break;
//=============================================================================
    case 'economytoggle':

      if (data.iseconomyActive){

        data.iseconomyActive = false
        data.save().then(() => {

          gsettings.isxpActive = false
          message.reply(`Disabled the economy system.`)

        }).catch(()=> message.react('👎'))

      } else {

        data.iseconomyActive = true
        data.save().then(()=>{

          gsettings.iseconomyActive = true
          message.reply(`Enabled the economy system!`)

        }).catch(() => message.react('👎'))
      }
    break;
//=============================================================================
    case 'xpexcempt':
      if (!message.mentions.channels.size) return message.reply(`Please mention a channel.`)

      let channels = []
      message.mentions.channels.each( channel => {
        if (!data.xpExceptions.includes(channel.id)) channels.push(channel.id)
      })

      newInfo = data.xpExceptions.concat(channels)

      data.xpExceptions = newInfo

      data.save().then(()=>{

        gsettings.xpExceptions = newInfo
        message.reply(`Disabled xp on <#${channels.join('>, <#')}>`)

      }).catch(() => message.react('👎'))

    break;
//=============================================================================
    case 'xpallow':
      if (!message.mentions.channels.size) return message.reply(`Please mention a channel.`)

      let ch = []
      message.mentions.channels.each( channel => {
        if (data.xpExceptions.includes(channel.id)) ch.push(channel.id)
      })

      if (!ch.length) return message.reply(`The mentioned channels are not on the exception list!`)

      ch.forEach( id => {
        data.xpExceptions.splice(ch.indexOf(id),1)
      })

      data.save().then( (data) => {

        gsettings.xpExceptions = data.xpExceptions
        message.reply(`Reenabled xp on <#${ch.join('>, <#')}>`)

      })

    break;
//=============================================================================
    case 'excemptedchannels':
      if (!data.isxpActive) return message.reply(`The xp system is currently disabled in the server.`)
      if (!data.xpExceptions.length) return message.reply(`The xp system is active on all channels.`)
      message.reply(`The xp system is disabled on <#${data.xpExceptions.join('>, <#')}>`)
    break;
//=============================================================================
    case 'xpreset':
    if (message.guild.ownerID !== message.author.id) return message.reply(`XP reset can only be toggled by server owner.`)
    experience.deleteMany({ guildID: message.guild.id}, (err,del) => {
      message.reply(`**The XP has been reset!**`)
    })
    break;
//=============================================================================
    case 'economyreset':
    if (message.guild.ownerID !== message.author.id) return message.reply(`Economy reset can only be toggled by server owner.`)
    econschema.deleteMany({ guildID: message.guild.id}, (err,del) => {
      message.reply(`**The economy has been reset!**`)
    })
    break;
//=============================================================================
    default:
    }
  })
}


module.exports.config = {
  name: 'pointsystem',
  aliases: ['ps'],
  group: 'setup',
  description: `Set the pointing system of this guild.  Type \`${prefix}pointsystem help\` for a guide on how to set up one.`,
  guildOnly: true,
  examples: ['pointsystem help'],
  parameters: ['subcommands', 'queries'],
  adminOnly: true
}

function help(message){
  message.channel.send( new MessageEmbed().setTitle('Point System Help [Additional Commands List]')
  .setAuthor(message.client.user.username + "| Point System", message.client.user.avatarURL)
  .setColor(3092790)
  .setDescription("The Point System is an extension command from the previous version of this bot.\nThe point system uses [mongoDB](https://mongodb.com) as it's database.\n\nUsage of the commands are `" + prefix + "pointsystem [subcommand] [parameter <if required>]`\n\n\u200B**Subcommand List**")
  .addFields(
    {name:'economytoggle',value:'Toggle the economy system on/off for the server.'},
    {name:'excemptedchannels',value:'Display the channels where the xp system is disabled.'},
    {name:'help',value:'Prints out all available sub-commands with a short description.'},
    {name:'xpallow',value:'Allow xp system on mentioned channel(s) if disabled.'},
    {name:'xpexcempt',value:'Excempt xp system on mentiond channel(s) if enabled.'},
    {name:'xptoggle',value:'Toggle the xp system on/off for the server.'},
    {name:'xpreset',value:'Reset the xp of everyone in this server (Only server owner can execute this command).'},
    {name:'economyreset',value:'Reset the economy of everyone in this server (Only server owner can execute this command).'}
    )
  )
}
