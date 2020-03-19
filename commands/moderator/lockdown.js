const {RichEmbed} = require("discord.js");
const settings = require("./../../botconfig.json");

module.exports.run = (bot,message,args) => {

  checkPermissions(message).then(res => {
    if (res.err) return  message.react('👎').then(()=>message.reply(user.err)).catch(console.error)

    fetchType(args).then(async(type,err)=>{
      if (err) return message.react('👎').then(()=>message.reply(err)).catch(console.error)

      if (type === 'start') {
        await message.channel.overwritePermissions(message.guild.defaultRole, { SEND_MESSAGES: false }, `Lockdown initiated by ${message.author.tag}`);
        return message.channel.send(`Lockdown has initiated! Most users are now unable to send a message in this channel!\n\Please use \`lockdown stop\` to end the lockdown!`).then(()=>{  return message.react('👍')});
      } else if (type === 'stop') {
        await message.channel.overwritePermissions(message.guild.defaultRole, { SEND_MESSAGES: null }, `Lockdown terminated by ${message.author.tag}`);
        return message.channel.send('Lockdown ended!').then(()=>{  return message.react('👍')});
      }

    })
  })
}

module.exports.help = {
  name: 'lockdown',
  aliases: ['lock','ld','lockchannel'],
	group: 'moderator',
	description: 'Prevent users from messageing in a specific channel',
	examples: ['lockdown start','lockdown stop'],
	parameters: ['start/stop']
}

function fetchType(args){
  return new Promise((resolve,reject)=>{
    if (args.toString().toLowerCase() === 'start') resolve('start')
    if (args.toString().toLowerCase() === 'stop') resolve ('stop')
    reject('Please indicate whether to start or stop.')
  })
}

function checkPermissions(message){
  return new Promise ((resolve,reject)=>{
    client = message.guild.members.find(g=>g.id===message.client.user.id)
    author = message.member

    if (!client.hasPermission("MANAGE_MESSAGES")) resolve({err:`Sorry, I don't have the permission to initiate a lockdown!`})
    if (!author.hasPermission("MANAGE_MESSAGES")) resolve({err:`Sorry, you don't have the permission to initiate a lockdown!`})

    resolve(true)
      })
  }
