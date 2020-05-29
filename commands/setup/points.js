const { MessageEmbed } = require('discord.js')
const gprofile = require('../../models/guildProfileSchema.js')
const { default : { prefix } } = require('../../settings.json')
const allowedResponses = ['xptoggle', 'economytoggle', 'xpexcempt', 'xpallow', 'excemptedchannels', 'xpreset', 'economyreset']
const experience = require('../../models/xpSchema.js')
const econschema = require('../../models/bankSchema.js')

module.exports = {
	config: {
	  name: 'pointsystem',
	  aliases: ['ps'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: true,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: 'setup',
  	description: `Set the pointing system of this guild.  Type \`${prefix}pointsystem help\` for a guide on how to set up one.`,
		examples: ['pointsystem help'],
		parameters: ['subcommands', 'queries'],
	},
	run: async (client, message, [ subcommand, ...queries ]) => {

		if (!subcommand ||subcommand.toLowerCase() === 'help') return help(message)

		if (!allowedResponses.includes(subcommand)) return message.channel.send(error(`[AUTOMSG_ERROR]: Invalid subcommand [${subcommand}]. To view available subcommands: type \`${prefix}pointsystem help\`.`))

		let data = await gprofile.findOne({ guildID: message.guild.id }).catch(()=>{})

	  if (!data) data = await new gprofile({ guildID: message.guild.id, welcomeChannel: null, welcomemsg:null, goodbyeChannel: null, goodbyemsg: null, isxpActive: false, xpExceptions:[], iseconomyActive: false }).save()

	  if (!data) return message.channel.send(error('[POINTSYSTEM_ERROR]: Unable to connect to database...'))

	  let gsettings = client.guildsettings.get(message.guild.id)

	  if (!gsettings) gsettings = client.guildsettings.set(message.guild.id, data )

	  switch(subcommand.toLowerCase()){
	//=============================================================================
	    case 'xptoggle':

	      if (data.isxpActive){

	        data.isxpActive = false
	        data.save().then(()=> {

	          gsettings.isxpActive = false
	          message.channel.send(success(`Disabled the xp system!`))

	        }).catch((err)=>  message.react('👎'))

	      } else {

	        data.isxpActive = true
	        data.save().then(()=>{

	          gsettings.isxpActive = true
	          message.channel.send(success(`Enabled the xp system!`))

	        }).catch((err)=>  message.react('👎'))
	      }
	    break;
	//=============================================================================
	    case 'economytoggle':

	      if (data.iseconomyActive){

	        data.iseconomyActive = false
	        data.save().then(() => {

	          gsettings.isxpActive = false
	          message.channel.send(success(`Disabled the economy system.`))

	        }).catch(()=> message.react('👎'))

	      } else {

	        data.iseconomyActive = true
	        data.save().then(()=>{

	          gsettings.iseconomyActive = true
	          message.channel.send(success(`Enabled the economy system!`))

	        }).catch(() => message.react('👎'))
	      }
	    break;
	//=============================================================================
	    case 'xpexcempt':
	      if (!message.mentions.channels.size) return message.channel.send(error(`[POINTSYSTEM_ERROR]: Please mention a channel.`))

	      let channels = []
	      message.mentions.channels.each( channel => {
	        if (!data.xpExceptions.includes(channel.id)) channels.push(channel.id)
	      })

	      newInfo = data.xpExceptions.concat(channels)

	      data.xpExceptions = newInfo

	      data.save().then(()=>{

	        gsettings.xpExceptions = newInfo
	        message.channel.send(success(`Disabled xp on <#${channels.join('>, <#')}>`))

	      }).catch(() => message.react('👎'))

	    break;
	//=============================================================================
	    case 'xpallow':
	      if (!message.mentions.channels.size) return message.channel.send(error(`[POINTSYSTEM_ERROR]: Please mention a channel.`))

	      let ch = []
	      message.mentions.channels.each( channel => {
	        if (data.xpExceptions.includes(channel.id)) ch.push(channel.id)
	      })

	      if (!ch.length) return message.channel.send(error(`[POINTSYSTEM_ERROR]: The mentioned channels are not on the exception list!`))

	      ch.forEach( id => {
	        data.xpExceptions.splice(ch.indexOf(id),1)
	      })

	      data.save().then( (data) => {

	        gsettings.xpExceptions = data.xpExceptions
	        message.channel.send(success(`Reenabled xp on <#${ch.join('>, <#')}>`))

	      })

	    break;
	//=============================================================================
	    case 'excemptedchannels':
	      if (!data.isxpActive) return message.channel.send(error(`[POINTSYSTEM_ERROR]: The xp system is currently disabled in the server.`))
	      if (!data.xpExceptions.length) return message.channel.send(success(`The xp system is enabled on all channels.`))
	      message.channel.send(success(`The xp system is disabled on <#${data.xpExceptions.join('>, <#')}>`))
	    break;
	//=============================================================================
	    case 'xpreset':
	    if (message.guild.ownerID !== message.author.id) return message.channel.send(error(`[POINTSYSTEM_ERROR]: XP reset can only be toggled by server owner.`))
	    experience.deleteMany({ guildID: message.guild.id}, (err,del) => {
	      message.channel.send(success(`**The XP has been reset!**`))
	    })
	    break;
	//=============================================================================
	    case 'economyreset':
	    if (message.guild.ownerID !== message.author.id) return message.channel.send(error(`[POINTSYSTEM_ERROR]: Economy reset can only be toggled by server owner.`))
	    econschema.deleteMany({ guildID: message.guild.id}, (err,del) => {
	      message.channel.send(success(`**The economy has been reset!**`))
	    })
	    break;
	//=============================================================================
	    default:

			}

		}
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
