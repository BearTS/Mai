module.exports = {
  name: 'softlockdown',
  aliases: [ 'softlock', 'softld', 'softlockchannel' ],
  guildOnly: true,
  permissions: [ 'MANAGE_MESSAGES', 'MANAGE_CHANNELS' ],
  clientPermissions: [ 'MANAGE_CHANNELS' ],
  group: 'moderation',
  description: `[Prevent/Allow] users without special permissions from sending messages in the current channel. Permission Overwrites will be kept.`,
  examples: [
    'softlockdown',
    'softlock'
  ],
  run: (client, message) => message.channel.updateOverwrite(
    message.guild.roles.everyone,
    {
      SEND_MESSAGES: !message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')
    },
    `Mai Soft-Lockdown Command: ${message.author.tag}`)
  .then((ch) => message.channel.updateOverwrite(client.user, { SEND_MESSAGES: true }))
  .then((ch) => message.channel.send(
    ch.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')
    ? '\\✔️ Lockdown Ended! Everyone can now send messages on this channel'
    : '\\✔️ Lockdown has initiated! Users without roles or special permissions will not be able to send messages here!'
  )).catch(() => message.channel.send(
    message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')
    ? '\\❌ Unable to Soft-lockdown this channel!'
    : '\\❌ Unable to restore this channel!'
  ))
};
