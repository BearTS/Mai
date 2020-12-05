module.exports = {
  name: 'resetchannel',
  aliases: [ 'resetch' ],
  guildOnly: true,
  permissions: [ 'MANAGE_CHANNELS' ],
  clientPermissions: [ 'MANAGE_CHANNELS' ],
  group: 'moderation',
  description: `Removes all permission overwrites and resets @everyone permissions to \`unset\``,
  get examples(){ return [ this.name, ...this.aliases ]},
  run: (client, message) => message.channel.overwritePermissions([
    { id: message.guild.roles.everyone.id }
  ])
  .then(ch => message.channel.send('\\✔️ Sucesssfully reset the permissions for this channel.'))
  .catch(() => message.channel.send('\\❌ Unable to reset the permissions for this channel.'))
};
