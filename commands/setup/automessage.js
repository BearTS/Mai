const { MessageEmbed } = require('discord.js')
const gprofile = require('../../models/guildProfileSchema.js')
const { default : { prefix } } = require('../../settings.json')
const allowedResponses = ['welcome','goodbye','welcomemsg','goodbyemsg']

module.exports.run = (client, message, args) => {

  if (!args.length || args[0].toLowerCase() === 'help') return help(message)

  if (!allowedResponses.includes(args[0])) return message.react("👎")

  gprofile.findOne({guildID: message.guild.id}, async (err, data) => {

    if (err) return console.log(`${magenta('[Mai-Promise ERROR]')} : Unable to connect to MongoDB.`)

    if (!data) data = await new gprofile( {guildID: message.guild.id, welcomeChannel: null, welcomemsg:null, goodbyeChannel: null, goodbyemsg: null, isxpActive: false, xpExceptions:[], iseconomyActive: false} ).save()

    let gsettings = client.guildsettings.get(message.guild.id)
    if (!gsettings) gsettings = client.guildsettings.set(message.guild.id, data )

    switch(args[0].toLowerCase()){
//=============================================================================
      case 'welcome':

      if (!message.mentions.channels.size && data.welcomeChannel) {

        data.welcomeChannel = null;
        data.save().then(()=>{

          gsettings.welcomeChannel = null
          message.reply('Disabled the welcome message!')

        }).catch((err)=>  message.react('👎'))

      } else if (!message.mentions.channels.size && !data.welcomeChannel){

        return message.channel.send(`Please specify the channel for welcome message!`)

      } else {

        data.welcomeChannel = message.mentions.channels.first().id
        data.save().then( (data) => {

          gsettings.welcomeChannel = data.welcomeChannel
          message.reply(`Welcoming new members on <#${gsettings.welcomeChannel}> !!`)

        }).catch((err)=>  message.react('👎'))
      }

      break;
//=============================================================================
      case 'goodbye':

      if (!message.mentions.channels.size && data.goodbyeChannel) {

        data.goodbyeChannel = null;
        data.save().then(()=>{

          gsettings.goodbyeChannel = null
          message.reply('Disabled the goodbye message!')

        }).catch((err)=>  message.react('👎'))

      } else if (!message.mentions.channels.size && !data.goodbyeChannel){

        return message.channel.send(`Please specify the channel for goodbye message!`)

      } else {

        data.goodbyeChannel = message.mentions.channels.first().id
        data.save().then( (data) => {

          gsettings.goodbyeChannel = data.goodbyeChannel
          message.reply(`Announcing leaving members on <#${gsettings.welcomeChannel}> !!`)

        }).catch((err)=>  message.react('👎'))
      }

      break;
//=============================================================================
      case 'welcomemsg':

        if (['clear','default','remove'].includes(args[1].toLowerCase())){
          if (!data.welcomemsg) return message.channel.send(`Welcome message is already on default!`)

          data.welcomemsg = null
          data.save().then( (data) => {

            gsettings.welcomemsg = data.welcomemsg
            message.reply(`Cleared custom welcome message. Welcome message now set to default.`)

          }).catch((err)=>  message.react('👎'))

        } else if (args.length > 2) {

          data.welcomemsg = args.slice(1).join(' ')
          data.save().then( data => {

            gsettings.welcomemsg = data.welcomemsg
            message.reply(`Custom welcome message was set!`)

          }).catch((err)=>  message.react('👎'))

        } else return message.channel.send(`Please specify the welcome message`)

      break;
//=============================================================================
      case 'goodbyemsg':

        if (['clear','default','remove'].includes(args[1].toLowerCase())){
          if (!data.goodbyemsg) return message.channel.send(`Goodbye message is already on default!`)

          data.goodbyemsgbye = null
          data.save().then( (data) => {

            gsettings.goodbyemsg = data.goodbyemsg
            message.reply(`Cleared custom goodbye message. Goodbye message now set to default.`)

          }).catch((err)=>  message.react('👎'))

        } else if (args.length > 2) {

          data.goodbyemsg = args.slice(1).join(' ')
          data.save().then( data => {

            gsettings.goodbyemsg = data.goodbyemsg
            message.reply(`Custom goodbye message was set!`)

          }).catch((err)=>  message.react('👎'))

        } else return message.channel.send(`Please specify the goodbye message`)

      break;
      default:
    }
  })
}


module.exports.config = {
  name: 'automsg',
  aliases: [],
  group: 'setup',
  description: `Set the automessages of this guild.  Type \`${prefix}automsg help\` for a guide on how to set up one.`,
  guildOnly: true,
  examples: ['automsg help'],
  parameters: ['subcommands', 'queries'],
  adminOnly: true
}

function help(message){
  message.channel.send( new MessageEmbed().setTitle('Auto Messages Help [Additional Commands List]')
  .setAuthor(message.client.user.username + "| Auto Messages", message.client.user.avatarURL)
  .setColor(3092790)
  .setDescription("The Auto Messages is an extension command from the previous version of this bot.\nYou can use this feature to toggle welcome and goodbye messages as well as customize those messages.\n\nUsage of the commands are `" + prefix + "automsg [subcommand] [parameter <if required>]`\n\n\u200B**Subcommand List**")
  .addFields(
    {name:'help',value:'Prints out all available sub-commands with a short description.'},
    {name:'goodbye',value:'Toggle the goodbye message on/off for the server. Requires the channel mention from which the message must be sent.'},
    {name:'goodbyemsg',value:'Customize the goodbye message being sent by the bot. Add `[clear]` to set to default message. Typing {user} and {membercount} resolves to the user (who left) mention and guild member count, respectively.'},
    {name:'welcome',value:'Toggle the welcome message on/off for the server. Requires the channel mention from which the message must be sent'},
    {name:'welcomemsg',value:'Customize the welcome message being sent by the bot. Add `[clear]` to set to default message. Typing {user} and {membercount} resolves to the user (who joined) mention and guild member count, respectively.'}
    )
  )
}
