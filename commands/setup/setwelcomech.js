const { MessageEmbed } = require('discord.js');
const guilds = require('../../models/GuildProfile');

module.exports = {
  name: 'setwelcomech',
  aliases: [],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Set up the welcome channel',
  requiresDatabase: true,
  parameters: ['Channel ID/Mention'],
  examples: [
    'setwelcomech 72838485961627384',
    'setwelcomech #member-joins'
  ],
  run: (client, message, [channel='']) => guilds.findById(message.guild.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc){
      doc = new guilds({ _id: message.guild.id });
    };

    const channelID = (channel.match(/\d{17,19}/)||[])[0];
    channel = message.guild.channels.cache.get(channelID);

    if (!channel || channel.type !== 'text'){
      return message.channel.send(`\\❌ **${message.member.displayName}**, please provide a valid channel ID or channel mention.`);
    } else if (!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')){
      return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to send messages on ${channel} and try again.`);
    } else if (!channel.permissionsFor(message.guild.me).has('EMBED_LINKS')){
      return message.channel.send(`\\❌ **${message.member.displayName}**, I need you to give me permission to embed links on ${channel} and try again.`);
    };

    doc.greeter.welcome.channel = channel.id;
    return doc.save()
    .then(() => {
      const profile = client.guildProfiles.get(message.guild.id);
      profile.greeter.welcome.channel = doc.greeter.welcome.channel;

      return message.channel.send(
        new MessageEmbed()
        .setColor('GREEN')
        .setFooter(`Member Greeter | \©️${new Date().getFullYear()} Mai`)
        .setDescription([
          '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000',
          `Successfully set the welcome channel to ${channel}!\n\n`,
          !profile.greeter.welcome.isEnabled ? `\\⚠️ Welcome greeter is disabled! To enable, type \`${client.prefix}welcometoggle\`\n` :
          `To disable this feature, use the \`${client.prefix}welcometoggle\` command.`
        ].join(''))
      );})
    .catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`))
  })
};
