const profile = require('../../models/Profile');

module.exports = {
  name: 'userxpreset',
  aliases: ['resetuserxp','resetxpuser'],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Reset the xp of a particular user in this server.',
  requiresDatabase: true,
  parameters: [ 'User Mention/ID' ],
  examples: [
    'userxpreset @user',
    'resetuserxp 782939405931123456'
  ],
  run: async (client, message ) => {
    const match = message.content.match(/\d{17,19}/)?.[0] || ' ';

    if (!match){
      return message.channel.send(`\\❌ **${message.author.tag}**, Please mention the user whose xp needs resetting.`);
    };

    const member = await message.guild.members.fetch(match).catch(() => {});

    if (!member){
      return message.channel.send(`\\❌ **${message.author.tag}**, Couldn't find that member in this server!`);
    } else if (member.user.bot){
      return message.channel.send(`\\❌ **${message.author.tag}**, A bot cannot earn experience points!`);
    };

    await message.channel.send(`This will **reset** **${member.displayName}**\'s experience points in this server (Action irreversible). Continue?`);
    const collector = message.channel.createMessageCollector( res => message.author.id === res.author.id );

    const continued = await new Promise( resolve => {
      const timeout = setTimeout(()=> collector.stop('TIMEOUT'), 30000)
      collector.on('collect', (message) => {
        if (['y','yes'].includes(message.content.toLowerCase())) return resolve(true)
        if (['n','no'].includes(message.content.toLowerCase())) return resolve(false)
      });
      collector.on('end', () => resolve(false));
    });

    if (!continued){
      return message.channel.send(`\\❌ **${message.author.tag}**, cancelled the userxpreset command!`);
    };

    return profile.findById(member.id, (err, doc) => {

      if (err){
        return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
      } else if (!doc){
        return message.channel.send(`\\❌ **${message.author.tag}**, **${member.user.tag}** has not started earning xp!`);
      };

      const index = doc.data.xp.findIndex(x => x.id === message.guild.id);

      if (index < 0){
        return message.channel.send(`\\❌ **${message.author.tag}**, **${member.user.tag}** has not started earning xp!`);
      };

      doc.data.xp.splice(index, 1);

      return doc.save()
      .then(() => message.channel.send(`\\✔️ **${member.user.tag}**'s Experience Points has been sucessfully reset!`))
      .catch(() => message.channel.send(`\\❌ **${member.user.tag}**'s Experience Points reset attempt failed!`))
    });
  }
};
