const { MessageEmbed } = require('discord.js');
const guilds = require('../../models/GuildProfile');

module.exports = {
  name: 'xptoggle',
  aliases: ['togglexp'],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Toggle the xp system on/off for the server.',
  requiresDatabase: true,
  examples: [
    'xptoggle'
  ],
  run: (client, message) => guilds.findById(message.guild.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc){
      doc = new guilds({ _id: message.guild.id });
    };

    doc.xp.isActive = !doc.xp.isActive;

    doc.save()
    .then(() => {
      const state = ['Disabled', 'Enabled'][Number(doc.xp.isActive)];
      const profile = client.guildProfiles.get(message.guild.id);
      profile.xp.isActive = doc.xp.isActive;

      return message.channel.send(
        new MessageEmbed()
        .setColor('GREEN')
        .setFooter(`XP | \©️${new Date().getFullYear()} Mai`)
        .setDescription([
          '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000',
          `XP Feature has been successfully **${state}**!\n\n`,
          `To **${!doc.xp.isActive ? 're-enable' : 'disable'}** this`,
          `feature, use the \`${client.prefix}xptoggle\` command.`
        ].join(' '))
      );}).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
  })
};
