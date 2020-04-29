
module.exports.run = ( client, message, args ) => {

  switch(args[0]){
  case 'guildMemberAdd':
    guildMemberAdd(client,message.member,message)
  break;
  case 'guildMemberRemove':
    guildMemberRemove(client,message.member,message)
  break;
  }
}

module.exports.config = {
  name: 'execute',
  aliases: [],
	group: 'owner',
	description: 'Force execute a Discord Event',
	examples: ['execute guildMemberAdd'],
	parameters: ['discord Event']
}

function guildMemberAdd(bot,member,message){
  try {
    const command = require('../../events/guildMemberAdd.js')
    command(bot,member)
  } catch (err) {
    message.channel.send(`Error:\n\`\`\`${err}\`\`\``)
  }
}

function guildMemberRemove(bot,member,message){
  try {
    const command = require('./../../events/guildMemberRemove.js')
    command(bot,member)
  } catch (err) {
    message.channel.send(`Error:\n\`\`\`${err}\`\`\``)
  }
}
