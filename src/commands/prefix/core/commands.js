const { MessageEmbed , Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'commands',
  description      : 'Sends a list of all commands from each specific command groups.',
  aliases          : [ 'cmd', 'command' ],
  cooldown         : null,
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  permissions      : [],
  group            : 'core',
  guildOnly        : false,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [],
  examples         : [ 'commands', 'cmd', 'command' ],
  run              : async (message, language) => {

    const parameters = new language.Parameter({
      '%AUTHOR%' : message.author.tag,
      '%CLIENT%': message.client.user.username,
      '%PREFIX%': message.client.prefix
    });
    const fields = [];
    for (const group of message.client.commands.groups){
      const commands = message.client.commands.store.filter(command => command.group === group);
      const value = message.client.services.UTIL.ARRAY.join(commands.map(command => `\`${command.name}\``));
      fields.push({ name: group[0].toUpperCase() + group.slice(1), inline: true, value });
    };
    const title  = language.get({ '$in': 'COMMANDS', id: 'COMMANDS_ETITLE', parameters });
    const desc   = language.get({ '$in': 'COMMANDS', id: 'COMMANDS_EDESC', parameters });
    const footer = language.get({ '$in': 'COMMANDS', id: 'COMMANDS_EFOOTR', parameters });
    const embed  = new MessageEmbed().setTitle(title).setDescription(desc).addFields(fields.sort((A,B) => B.value.length - A.value.length))
    .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`).setColor(0xe620a4)
    return message.channel.send(embed);
  }
};
