const { MessageEmbed } = require('discord.js')
const gprofile = require('../../models/guildProfileSchema.js')
const { default : { prefix } } = require('../../settings.json')
const allowedResponses = ['welcome', 'goodbye', 'welcomemsg', 'goodbyemsg']

module.exports = {
  config: {
    name: 'automsg',
    aliases: [],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: true,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: 'setup',
    description: `Set the automessages of this guild.  Type \`${prefix}automsg help\` for a guide on how to set up one.`,
    examples: ['automsg help'],
    parameters: ['subcommands', 'queries']
  },
  run : async ( client, message, [ subcommand, ...queries ] ) => {

    if (!subcommand || subcommand.toLowerCase() === 'help') return help(message)

    if (!allowedResponses.includes(subcommand)) return message.channel.send(error(`[AUTOMSG_ERROR]: Invalid subcommand [${subcommand}]. To view available subcommands: type \`${prefix}automsg help\`.`))

    let data = await gprofile.findOne({ guildID: message.guild.id }).catch(()=>{})

    if (!data) data = await new gprofile( {guildID: message.guild.id, welcomeChannel: null, welcomemsg:null, goodbyeChannel: null, goodbyemsg: null, isxpActive: false, xpExceptions:[], iseconomyActive: false} ).save()

    if (!data) return message.channel.send(error('[AUTOMSG_ERROR]: Unable to connect to database...'))

    let gsettings = client.guildsettings.get(message.guild.id)

    if (!gsettings) gsettings = client.guildsettings.set(message.guild.id, data )

    switch(subcommand.toLowerCase()){
  //=============================================================================
      case 'welcome':

      if (!message.mentions.channels.size && data.welcomeChannel) {

  			data.welcomeChannel = null;
        data.save().then(() => {

          gsettings.welcomeChannel = null

          return message.channel.send(success('Disabled the welcome message!'))

        }).catch((err)=> message.react('👎'))

        } else if (!message.mentions.channels.size && !data.welcomeChannel) {

          return message.channel.send(error(`[AUTOMSG_ERROR]: Please specify the channel for welcome message!`))

        } else {

          data.welcomeChannel = message.mentions.channels.first().id
          data.save().then( (data) => {

            gsettings.welcomeChannel = data.welcomeChannel
            return message.channel.send(success(`Welcoming new members on <#${gsettings.welcomeChannel}> !!`))

          }).catch((err)=>  message.react('👎'))

        }
        break;
  //=============================================================================
        case 'goodbye':

        if (!message.mentions.channels.size && data.goodbyeChannel) {

          data.goodbyeChannel = null;
          data.save().then(()=>{

            gsettings.goodbyeChannel = null
            return message.channel.send(success('Disabled the goodbye message!'))

          }).catch( () => message.react('👎'))

        } else if (!message.mentions.channels.size && !data.goodbyeChannel){

          return message.channel.send(error(`[AUTOMSG_ERROR]: Please specify the channel for goodbye message!`))

        } else {

          data.goodbyeChannel = message.mentions.channels.first().id
          data.save().then( (data) => {

            gsettings.goodbyeChannel = data.goodbyeChannel
            message.channel.send(success(`Announcing leaving members on <#${gsettings.welcomeChannel}> !!`))

          }).catch((err)=>  message.react('👎'))
        }

        break;
  //=============================================================================
        case 'welcomemsg':

          if (!queries[0] || ['clear','default','remove'].includes(queries[0].toLowerCase())){
            if (!data.welcomemsg) return message.channel.send(error(`[AUTOMSG_ERROR]: Welcome message is already on default!`))

            data.welcomemsg = null
            data.save().then( (data) => {

              gsettings.welcomemsg = data.welcomemsg
              message.channel.send(success(`Cleared custom welcome message. Welcome message now set to default.`))

            }).catch((err)=>  message.react('👎'))

          } else if (!queries.length) {

            return message.channel.send(error(`[AUTOMSG_ERROR]: Please specify the welcome message`))

          } else {

          data.welcomemsg = queries.join(' ')
          data.save().then( data => {

            gsettings.welcomemsg = data.welcomemsg
            message.channel.send(success(`Custom welcome message was set!`))

          }).catch((err)=>  message.react('👎'))

        }

        break;
  //=============================================================================
        case 'goodbyemsg':

          if (!queries[0] || ['clear','default','remove'].includes(queries[0].toLowerCase())){
            if (!data.goodbyemsg) return message.channel.send(error(`[AUTOMSG_ERROR]: Goodbye message is already on default!`))

            data.goodbyemsg = null
            data.save().then( (data) => {

              gsettings.goodbyemsg = data.goodbyemsg
              message.channel.send(success(`Cleared custom goodbye message. Goodbye message now set to default.`))

            }).catch((err)=>  message.react('👎'))

          } else if (!queries.length) {

            return message.channel.send(error(`[AUTOMSG_ERROR]: Please specify the goodbye message`))

          } else {
            data.goodbyemsg = queries.join(' ')
            data.save().then( data => {

              gsettings.goodbyemsg = data.goodbyemsg
              message.channel.send(success(`Custom goodbye message was set!`))

            }).catch((err)=>  message.react('👎'))

          }

        break;
        default:
      }
  }

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

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}

function success(str){
  return new MessageEmbed()
  .setColor('GREEN')
  .setDescription(`\u200B\n${str}\n\u200B`)
}
