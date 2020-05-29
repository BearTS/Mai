 const { MessageEmbed } = require('discord.js')

module.exports = {
  config: {
    name: "lockdown",
    aliases: ['lock','ld','lockchannel'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: ['MANAGE_MESSAGES','MANAGE_CHANNELS'],
    clientPermissions: ['MANAGE_CHANNELS'],
    cooldown: null,
    group: 'moderation',
   	description: '[Prevent/Allow] users from messaging in the current channel.',
   	examples: ['lockdown [button]', 'lockdown start', 'lockdown stop', 'lockdown toggle'],
   	parameters: ['button']
  },
  run: async ( client, message, [ button ] ) => {

    if (!button) {

      return message.channel.send(error(`Please indicate whether to [start/stop] lockdown. Use toggle to either [start/stop].`))

    }

    if (!['start','stop','toggle'].includes(button.toLowerCase())) {

      return message.channel.send(error(`Invalid button [${button}].`))

    }

    current_perms = message.channel.permissionsFor(message.guild.roles.everyone)

    if (button.toLowerCase() === 'toggle') {

      if (current_perms.has('SEND_MESSAGES')) {

        const s = await message.channel.overwritePermissions([{id: message.guild.roles.everyone.id, deny: ['SEND_MESSAGES']}, {id: message.guild.me, allow: ['SEND_MESSAGES']}], `Mai-Lockdown command.`).catch(()=>{})

        if (!s) return message.channel.send(error(`Failed to lockdown channel.`))

        return message.channel.send(success(`Lockdown has initiated! Most users are now unable to send a message in this channel!\n\Please use \`lockdown stop\` or \`lockdown toggle\` to end the lockdown!`))

      } else {

        const s = await message.channel.overwritePermissions([{id: message.guild.roles.everyone.id, allow: ['SEND_MESSAGES']}], `Mai-Lockdown command.`).catch(()=>{})

        if (!s) return message.channel.send(error(`Failed to restore channel.`))

        return message.channel.send(success(`Lockdown ended.`))

      }

    } else if (button.toLowerCase() === 'start'){

      if (!current_perms.has('SEND_MESSAGES')) {

        return message.channel.send(error(`This channel is **already** on lockdown!`))

      }

      const s = await message.channel.overwritePermissions([{id: message.guild.roles.everyone.id, deny: ['SEND_MESSAGES']}, {id: message.guild.me, allow: ['SEND_MESSAGES']}], `Mai-Lockdown command.`).catch(()=>{})

      if (!s) return message.channel.send(error(`Failed to lockdown channel.`))

      return message.channel.send(success(`Lockdown has initiated! Most users are now unable to send a message in this channel!\n\Please use \`lockdown stop\` or \`lockdown toggle\` to end the lockdown!`))

    } else {

      if (current_perms.has('SEND_MESSAGES')) {

        return message.channel.send(error(`This channel is **not** on lockdown!`))

      }

      const s = await message.channel.overwritePermissions([{id: message.guild.roles.everyone.id, allow: ['SEND_MESSAGES']}], `Mai-Lockdown command.`).catch(()=>{})

      if (!s) return message.channel.send(error(`Failed to restore channel.`))

      return message.channel.send(success(`Lockdown ended.`))

    }
  }
}

 function error(err){
   return new MessageEmbed()
   .setColor('RED')
   .setDescription(`\u200B\n${err}\n\u200B`)
 }

 function success(msg){
   return new MessageEmbed()
   .setColor('GREEN')
   .setDescription(`\u200B\n${msg}\n\u200B`)
 }
