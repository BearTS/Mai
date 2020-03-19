const {RichEmbed} = require("discord.js");
const settings = require("./../../botconfig.json");

module.exports.run = (bot,message,args) => {

checkUser(message).then((member)=>{
  if (member.err) return message.react('👎').then(()=>message.reply(member.err)).catch(console.error)

  checkPermissions(message,member).then((member) => {
      if (member.err) return message.react('👎').then(()=>message.reply(member.err)).catch(console.error)

    fetchReason(message).then(async (reason) => {
      const warn = await message.channel.send(`Are you sure you want to kick **${member.displayName}**?`)
      const msg = await message.channel.awaitMessages(res => res.author.id === message.author.id, {max:1,time:30000})

      if (!msg.size || !['y','yes'].includes(msg.first().content.toLowerCase())) return message.channel.send(`Command was terminated!`)
      if (['n','no'].includes(msg.first().content.toLowerCase())) return message.channel.send(`Cancelled kickning **${member.displayName}**!`)

      try {
        await member.send(`You were kicked from **${message.guild.name}** by **${message.member.displayName}**(${message.author.tag})${(reason.join(' ')==='None') ? ".":` for **${reason.join(' ')}**`}`)
      } catch (err) {
        await message.channel.send(`Failed to DM **${member.displayName}**`)
      }

      if (!msg.first().deleted){
        msg.first().delete()
      }

      if (!warn.deleted){
        warn.delete()
      }


      await member.kick(`${message.author.tag} : ${reason.join(' ')}`)
      return await message.react('👍')
    })
  })
})
}

module.exports.help = {
  name: 'kick',
  aliases: [],
	group: 'moderator',
	description: 'kick a user from the server.',
	examples: ['kick @Sakurajimai'],
	parameters: ['user mention']
}

function checkUser(message){
  return new Promise((resolve,reject)=>{
    if (message.mentions.users.size<1) {
      resolve({err:`Please mention the user to kick!`})
    }
    if (message.mentions.users.size>1){
      resolve({err:`I can't kick more than one users`})
    }
    resolve(message.mentions.users.first())
  })
}

function fetchReason(message){
return new Promise((resolve,reject)=>{
  let arr1 = message.cleanContent.split(/ +/).slice(1)
  let arr2 = message.content.split(/ +/).slice(1)
  reason = []

  arr1.forEach(word => {if (arr2.includes(word)) reason.push(word)})

  if (reason.length===0) resolve(['None'])

  reason.join(' ')
  resolve(reason)
})

}

function checkPermissions(message,member){
  return new Promise ((resolve,reject)=>{
    client = message.guild.members.get(message.client.user.id)
    author = message.member
    member = message.guild.members.get(member.id)

    if (!client.hasPermission("KICK_MEMBERS")) resolve({err:`Sorry, I don't have the permission to kick members!`})

    if (!author.hasPermission("KICK_MEMBERS")) resolve({err:`Sorry, you don't have the permission to kick members!`})

    if (member.id === message.author.id) resolve({err:`I wouldn't dare kick you!`})
    if (member.id === client.id) resolve({err:`Please don't kick me!`})
    if (member.user.bot) resolve({err:`I'm friends with the other bots, I wouldn't kick them!`})
    if (member.id === message.guild.ownerID) resolve({err:`Sorry, you cannot kick a Server Owner!`})
    if (client.highestRole.position<member.highestRole.position) resolve({err:`I can't kick **${member.displayName}**! Their position is higher than mine!`})
    if (author.highestRole.position<member.highestRole.position) resolve({err:`You can't kick **${member.displayName}**! Their position is higher than you!`})
    if (!member.kickable) resolve({err:`For some reason, I can't kick **${member.displayName}**!`})


    resolve(member)
      })


  }
