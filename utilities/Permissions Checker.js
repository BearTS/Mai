const { MessageEmbed } = require('discord.js')

module.exports = (message, command) => {

  const {
    group,
    name,
    guildOnly,
    ownerOnly,
    nsfw,
    adminOnly,
    permissions,
    clientPermissions,
    cooldown,
    rankcommand,
    economycommand
  } = command

  let reasons = []

  if (
    guildOnly
    && message.channel.type === 'dm'
  ) reasons.push('**Command is unavailable on DM** - This command can only be used on server channels.')


  if (
    ownerOnly
    && !message.client.config.owners.includes(message.author.id)
  ) reasons.push('**Limited to Devs** - This command can only be used by my developers.')


  if (
    adminOnly
    && !message.member.hasPermission('ADMINISTRATOR')
  ) reasons.push('**Limited to Admins** - This command requires the Administrator Permission which you don\'t have.')


  if (
    permissions
    && !message.channel.permissionsFor(message.member).has(permissions)
  ) reasons.push(
      '**No Necessary Permissions (User)** - Your current permission level doesn\'t allow you to use this command. You need:\n\u2000\u2000- '
    + Object.entries(
      message.channel.permissionsFor(message.member).serialize()
    ).filter(
      p => permissions.includes(p[0]) && !p[1]
    ).flatMap(
      c => c[0].split('_').map(
        x => x.charAt(0) + x.toLowerCase().slice(1)
      ).join(' ')
    ).join('\n\u2000\u2000- ')
  )


  if (
    clientPermissions
    && !message.channel.permissionsFor(message.guild.me).has(clientPermissions)
  ) reasons.push(
    '**No Necessary Permissions (Mai)** - My current permission level doesn\'t allow me to use this command. I need you to enable my permissions for:\n\u2000\u2000- '
    + Object.entries(
      message.channel.permissionsFor(message.guild.me).serialize()
    ).filter(
      p => clientPermissions.includes(p[0]) && !p[1]
    ).flatMap(
      c => c[0].split('_').map(
        x => x.charAt(0) + x.toLowerCase().slice(1)
      ).join(' ')
    ).join('\n\u2000\u2000- ')
  )


  if (
    nsfw
    && !message.channel.nsfw
  ) reasons.push(
    '**NSFW Command** - The command is categorized as NSFW and so cannot be used in a non-NSFW channel.'
  )


  if (
    guildOnly
    && rankcommand
    && (!message.client.guildsettings.get(message.guild.id)
    || !message.client.guildsettings.get(message.guild.id).xp.active
    || message.client.guildsettings.get(message.guild.id).xp.exceptions.includes(message.channel.id))
  ) reasons.push(
    !message.client.guildsettings.get(message.guild.id).xp.active
    ? '**Disabled XP** - XP is currently disabled in this server.'
    : '**Disabled XP on Channel** - XP is currently disabled in this channel.'
  )

  if (
    guildOnly
    && economycommand
    && (!message.client.guildsettings.get(message.guild.id)
    || !message.client.guildsettings.get(message.guild.id).isEconomyActive)
  ) reasons.push(
    '**Disabled Economy** - Economy has been **Disabled for this server**'
  )

  const embed = new MessageEmbed()
  .setColor('ORANGE')
  .setDescription(
      '\u2000\u2000⚠️\u2000\u2000|\u2000\u2000Oops, Command execution was blocked due to the following reasons:\n\n'
    + reasons.map(
      reason => '• ' + reason
    ).join('\n')
  )

  if (reasons.some(str => str.startsWith('**Disabled Economy')))
  embed.addField('\u200b',`If you are a server administrator, you may reenable it by typing \`${message.client.config.prefix}economytoggle\``)

  if (reasons.some(str => str.startsWith('**Disabled XP on Channel')))
  embed.addField('\u200b',`If you are a server administrator, you may reallow it by typing **${message.client.config.prefix}xpenable ${message.channel}**`)

  if (reasons.some(str => str.startsWith('**Disabled XP**')))
  embed.addField('\u200b',`If you are a server administrator, you may reenable it by typing \`${message.client.config.prefix}xptoggle\` command`)

  return {
    status: reasons.length
      ? 'Denied'
      : 'Accept'
  , embed }

}
