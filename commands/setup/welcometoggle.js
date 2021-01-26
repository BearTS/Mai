const { MessageEmbed } = require('discord.js');
const guilds = require('../../models/GuildProfile');

module.exports = {
  name: 'welcometoggle',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Toggle the \`Member Greeter\` on and off.',
  requiresDatabase: true,
  examples: [
    'welcometoggle'
  ],
  run: (client, message) => guilds.findById(message.guild.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    };

    if (!doc){
      doc = new guilds({ _id: message.guild.id });
    };

    doc.greeter.welcome.isEnabled = !doc.greeter.welcome.isEnabled;

    doc.save()
    .then(() => {
      const state = ['Disabled', 'Enabled'][Number(doc.greeter.welcome.isEnabled)];
      const profile = client.guildProfiles.get(message.guild.id);
      profile.greeter.welcome.isEnabled = doc.greeter.welcome.isEnabled;

      return message.channel.send(
        new MessageEmbed()
        .setColor('GREEN')
        .setFooter(`Member Greeter | \©️${new Date().getFullYear()} Mai`)
        .setDescription([
          '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000',
          `Member Greeter Feature has been successfully **${state}**!\n\n`,
          `To **${!doc.greeter.welcome.isEnabled ? 're-enable' : 'disable'}** this`,
          `feature, use the \`${client.prefix}welcometoggle\` command.`,
          !profile.greeter.welcome.message ? '\n\u2000 \\⚠️ Welcome Message has not been configured. [Learn](https://mai-san.ml/) how to customize one.' : '',
          !profile.greeter.welcome.channel ? `\n\u2000 \\⚠️ Welcome channel has not been set! Set one by using the \`${client.config.prefix}setwelcomech\` command!` : ''
        ].join(' '))
      );}).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
  })
};
