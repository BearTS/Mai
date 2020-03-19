const {RichEmbed} = require("discord.js");
const settings = require("./../../botconfig.json");

module.exports.run = (bot,message,args) => {

checkUser(message).then((user)=>{
  if (user.err) return message.react('👎').then(()=>message.reply(user.err)).catch(console.error)

  checkPermissions(message,user).then((member)=>{
    if (member.err) return message.react('👎').then(()=>message.reply(member.err)).catch(console.error)

    fetchReason(message).then(async reason=>{
      const warn = await message.channel.send(`Are you sure you want to ban **${member.displayName}**?`)
      const msg = await message.channel.awaitMessages(res => res.author.id === message.author.id, {max:1,time:30000})

      if (!msg.size || !['y','yes'].includes(msg.first().content.toLowerCase())) return message.channel.send(`Command was terminated!`)
      if (['n','no'].includes(msg.first().content.toLowerCase())) return message.channel.send(`Cancelled banning **${member.displayName}**!`)

      try {
        await member.send(`You were banned from **${message.guild.name}** by **${message.member.displayName}**(${message.author.tag}) for 7 days${(reason.join(' ')==='None') ? ".":` for **${reason.join(' ')}**`}`)
      } catch (err) {
        await message.channel.send(`Failed to DM **${member.displayName}**`)
      }

      if (!msg.first().deleted){
        msg.first().delete()
      }

      if (!warn.deleted){
        warn.delete()
      }

      await member.ban({
        days: 7,
        reason: `${message.author.tag}: ${reason.join(' ')}`
      })

      return await message.react('👍')
    })
  })
})

}

module.exports.help = {
  name: 'ban',
  aliases: [],
	group: 'moderator',
	description: 'ban a user from this server.',
	examples: ['ban @Sakurajimai'],
	parameters: ['user mention']
}

function checkUser(message){
  return new Promise((resolve,reject)=>{
    if (message.mentions.users.size<1) {
      resolve({err:`Please mention the user to ban!`})
    }
    if (message.mentions.users.size>1){
      resolve({err:`I can't ban more than one users. Use **bulkban** to ban multiple users.`})
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

  resolve(reason)
})

}

function checkPermissions(message,member){
  return new Promise ((resolve,reject)=>{
    client = message.guild.members.find(g=>g.id===message.client.user.id)
    author = message.member
    member = message.guild.members.find(g=>g.id===member.id)


    if (!client.hasPermission("BAN_MEMBERS")) resolve({err:`Sorry, I don't have the permission to ban members!`})

    if (!author.hasPermission("BAN_MEMBERS")) resolve({err:`Sorry, you don't have the permission to ban members!`})

    if (member.id === message.author.id) resolve({err:`I wouldn't dare ban you!`})
    if (member.id === client.id) resolve({err:`Please don't ban me!`})
    if (member.user.bot) resolve({err:`I'm friends with the other bots, I wouldn't ban them!`})
    if (member.id === message.guild.ownerID) resolve({err:`Sorry, you cannot ban a Server Owner!`})
    if (client.highestRole.position<member.highestRole.position) resolve({err:`I can't ban **${member.displayName}**! Their position is higher than mine!`})
    if (author.highestRole.position<member.highestRole.position) resolve({err:`You can't ban **${member.displayName}**! Their position is higher than you!`})
    if (!member.bannable) resolve({err:`For some reason, I can't ban **${member.displayName}**!`})

    resolve(member)
      })


  }
