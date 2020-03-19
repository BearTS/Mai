const {RichEmbed} = require("discord.js");
const settings = require("./../../botconfig.json");

module.exports.run = (bot,message,args) => {

  checkUser(message).then((member,err)=>{
    if (member.err) return message.react('👎').then(()=>message.reply(member.err)).catch(console.error)

    checkPermissions(message,member).then((member,err)=>{
      if (member.err) return message.react('👎').then(()=>message.reply(member.err)).catch(console.error)

      isMuted(message,member).then(async (member)=>{
        if (member.err) return message.react('👎').then(()=>message.reply(member.err)).catch(console.error)

        try {
          await message.channel.overwritePermissions(member.user, {
            SEND_MESSAGES: true,
            ADD_REACTIONS: true
          })
          return message.react('👍')
        } catch (err) {
          message.channel.send(`There was an error trying to unmute ${member.displayName}`).then(()=>{message.react('👎')})
        }

      })
    })
  })

}

module.exports.help = {
  name: 'unmute',
  aliases: ['undeafen','speak'],
	group: 'moderator',
	description: 'Unmutes a muted user from this channel.',
	examples: ['unmute @Sakurajimai','speak @Sakurajimai'],
	parameters: ['user mention']
}

function checkUser(message){
  return new Promise((resolve,reject)=>{
    if (message.mentions.users.size<1) {
      resolve({err:`Please mention the user to unmute!`})
    }
    if (message.mentions.users.size>1){
      resolve({err:`I can't unmute more than one user.`})
    }
    resolve(message.mentions.users.first())
  })
}

function checkPermissions(message,member){
  return new Promise ((resolve,reject)=>{
    client = message.guild.members.find(g=>g.id===message.client.user.id)
    author = message.member
    member = message.guild.members.find(g=>g.id===member.id)

    //lets check the permissions of the client first
    if (!client.hasPermission("BAN_MEMBERS")) resolve({err:`Sorry, I don't have the permission to undeafen members!`})
    if (client.highestRole.position<member.highestRole.position) resolve({err:`I can't undeafen **${member.displayName}**! Their position is higher than mine!`})
    if (!client.hasPermission("MANAGE_CHANNELS")) resolve({err:`Sorry, you don't have the permission to undeafen members!`})

    //let's check the permissions of the author next

    if (!author.hasPermission("BAN_MEMBERS")) resolve({err:`Sorry, you don't have the permission to undeafen members!`})
    if (author.highestRole.position<member.highestRole.position) resolve({err:`You can't undeafen **${member.displayName}**! Their position is higher than you!`})
    if (!author.hasPermission("MANAGE_CHANNELS")) resolve({err:`Sorry, you don't have the permission to undeafen members!`})
    //checking the permission of the bannable member
    //check if the banUser is the serverOwner
    if (member.id === message.guild.ownerID) resolve({err:`Sorry, server Owners cannot be muted in the first place!`})
    //check if the banUser is the client
    if (member.id === client.id) resolve({err:`You can't deafen me using my command in the first place,!`})
    //check if the banUser is the member himself
    if (!member.bannable) resolve({err:`For some reason, I can't undeafen **${member.displayName}**!`})

    resolve(member)
      })
  }

  function isMuted(message,member){
    return new Promise((resolve,reject)=>{
        if (member.permissionsIn(message.channel).has("SEND_MESSAGES") && member.permissionsIn(message.channel).has("ADD_REACTIONS")) resolve({err:`**${member.displayName}** is not Muted on this channel`})

        resolve(member)
    })
  }
