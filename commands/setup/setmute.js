const { MessageEmbed } = require('discord.js');
const guilds = require('../../models/GuildProfile');

module.exports = {
  name: 'setmute',
  aliases: [ 'setmuterole' ],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Set up the mute role.',
  requiresDatabase: true,
  parameters: ['Role <ID/Mention/Name>'],
  examples: [
    'setmute @muted',
    'setmute 73847566859304855',
    'setmute muted'
  ],
  run: (client, message, [ role ]) => guilds.findById(message.guild.id, (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc){
      doc = new guilds({ _id: message.guild.id });
    };

    const guildprofile = client.guildProfiles.get(message.guild.id);

    if (!role){
      if (!guildprofile?.roles?.muted){
        return message.channel.send(`\\❌ **${message.author.tag}**, Muterole not set!`);
      } else {
        const role = message.guild.roles.cache.get(guildprofile.roles.muted);
        if (!role){
          return message.channel.send(`\\❌ **${message.author.tag}**, Could not find this server's designated muterole!`);
        } else {
          return message.channel.send(`**${message.author.tag}**, the current muterole is ${role}`);
        };
      };
    } else {
      role = message.guild.roles.cache.get((role.match(/\d{17,19}/)||[])[0]) ||
      message.guild.roles.cache.find(r => r.name === role);

      if (!role){
        return message.channel.send(`\\❌ **${message.author}**, Invalid Role - Please supply the mention of the role, the ID of the role, or its Role Name.`)
      } else {

        if (!guildprofile){
          client.guildProfiles.set(message.guild.id, doc);
        } else {
          // do nothing..
        };

        doc.roles.muted = role.id;

        return doc.save()
        .then(() => {
          client.guildProfiles.get(message.guild.id).roles.muted = doc.roles.muted;
          return message.channel.send(`\\✔️ **${message.author.tag}**, Successfully set the muterole to ${role}!`);
        }).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`))
      };
    };
  })
};
