
module.exports = {
  config: {
    name: 'execute',
    aliases: [],
    guildOnly: false,
    ownerOnly: true,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: 'owner',
  	description: 'Force execute a Discord Event',
  	examples: ['execute guildMemberAdd'],
  	parameters: ['discord Event']
  },
  run: ( client, message, args ) => {

    switch(args[0]){
    case 'guildMemberAdd':
      guildMemberAdd(client,message.member,message)
    break;
    case 'guildMemberRemove':
      guildMemberRemove(client,message.member,message)
    break;
    }
  }
}

function guildMemberAdd(bot,member,message){
  try {
    const command = require('../../events/guildMemberAdd.js')
    return command(bot,member)
  } catch (err) {
    return message.channel.send(`Error:\n\`\`\`${err}\`\`\``)
  }
}

function guildMemberRemove(bot,member,message){
  try {
    const command = require('./../../events/guildMemberRemove.js')
    return command(bot,member)
  } catch (err) {
    return message.channel.send(`Error:\n\`\`\`${err}\`\`\``)
  }
}
