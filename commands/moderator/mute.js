const {RichEmbed} = require("discord.js");
const settings = require("./../../botconfig.json");

module.exports.run = (bot,message,args) => {
  checkUser(message).then((member,err) => {
    if (member.err) return message.react('👎').then(()=>message.reply(member.err)).catch(console.error)

    checkPermissions(message,member).then((member,err)=>{
      if (member.err) return message.react('👎').then(()=>message.reply(member.err)).catch(console.error)

      isMuted(message,member).then(async (member)=>{
        if (member.err) return message.react('👎').then(()=>message.reply(member.err)).catch(console.error)

       try {
          await message.channel.overwritePermissions(member.user, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false
          })
          return message.react('👍')
       } catch (err) {
         message.channel.send(`There was an error trying to mute ${member.displayName}`).then(()=>{message.react('👎')})
       }
      })
    })
  })
}

module.exports.help = {
  name: 'mute',
  aliases: ['deafen','silence','shut'],
	group: 'moderator',
	description: 'prevent a user from messageing in a specific channel',
	examples: ['deafen @Sakurajimai','shut @Sakurajimai'],
	parameters: ['user mentions']
}

function checkUser(message){
  return new Promise((resolve,reject)=>{
    if (message.mentions.users.size<1) {
      resolve({err:`Please mention the user to silence!`})
    }
    if (message.mentions.users.size>1){
      resolve({err:`I can't silence more than one user. use **bulkmute** to silence multiple users.`})
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
    if (!client.hasPermission("BAN_MEMBERS")) resolve({err:`Sorry, I don't have the permission to silence members!`})
    if (client.highestRole.position<member.highestRole.position) resolve({err:`I can't silence **${member.displayName}**! Their position is higher than mine!`})
    if (!client.hasPermission("MANAGE_CHANNELS")) resolve({err:`Sorry, you don't have the permission to silence members!`})

    //let's check the permissions of the author next

    if (!author.hasPermission("BAN_MEMBERS")) resolve({err:`Sorry, you don't have the permission to silence members!`})
    if (author.highestRole.position<member.highestRole.position) resolve({err:`You can't silence **${member.displayName}**! Their position is higher than you!`})
    if (!author.hasPermission("MANAGE_CHANNELS")) resolve({err:`Sorry, you don't have the permission to silence members!`})
    //checking the permission of the bannable member
    //check if the banUser is the serverOwner
    if (member.id === message.guild.ownerID) resolve({err:`Sorry, you cannot silence the Server Owner!`})
    //check if the banUser is the client
    if (member.id === client.id) resolve({err:`Please don't silence me!`})
    //check if the banUser is the member himself
    if (member.id === message.author.id) resolve({err:`I wouldn't dare silence you!`})
    //check if the banUser really is bannable
    if (!member.bannable) resolve({err:`For some reason, I can't silence **${member.displayName}**!`})

    resolve(member)
      })


  }

function isMuted(message,member){
  return new Promise((resolve,reject)=>{
      if (!member.permissionsIn(message.channel).has("SEND_MESSAGES") && !member.permissionsIn(message.channel).has("ADD_REACTIONS")) resolve({err:`**${member.displayName}** is already Muted on this channel`})

      resolve(member)
  })
}
