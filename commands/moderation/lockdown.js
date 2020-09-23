module.exports = {
  name: 'lockdown',
  aliases: ['lock','ld','lockchannel'],
  guildOnly: true,
  permissions: ['MANAGE_MESSAGES','MANAGE_CHANNELS'],
  clientPermissions: ['MANAGE_CHANNELS'],
  group: 'moderation',
  description: '[Prevent/Allow] users from messaging in the current channel.\nNote: This resets all the permissions for the channel',
  examples: [],
  parameters: [],
  run: async ( client, message) => {


    channelPermissions = message.channel.permissionsFor(message.guild.roles.everyone)

    if (channelPermissions.has('SEND_MESSAGES')) {

      return message.channel.overwritePermissions(
          [
              {
                id: message.guild.roles.everyone.id
                , deny: ['SEND_MESSAGES']
              }
            , {
                id: message.guild.me.id
                , allow: ['SEND_MESSAGES']
              }
          ]
        , 'Mai-Lockdown Command'
      )
        .then(() => message.channel.send(`Lockdown has initiated! Most users are now unable to send a message in this channel!\nPlease use \`lockdown\` again to end the lockdown!`))
          .catch(() => message.channel.send(`Unable to lockdown this channel`))

    }

    return message.channel.overwritePermissions(
        [
          {
            id: message.guild.roles.everyone.id
            , allow: ['SEND_MESSAGES']
          }
        ]
      , 'Mai-Lockdown Command'
    )
      .then(()=> message.channel.send(`Lockdown ended.`))
        .catch(()=> message.channel.send(`Unable to restore channel.`))

  }
}
