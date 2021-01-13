const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'invert',
  aliases: [],
  group: 'fun',
  description: 'Invert the colors on user avatar',
  clientPermissions: [ 'ATTACH_FILES' ],
  parameters: [ 'User ID', 'User Mention' ],
  get examples(){ return [ this.name, ...this.aliases]
    .map(x => x + ' ' + '<User>'); },
  run: async (client, message ) => {

    const match = message.content.match(/\d{17,19}/);
    let user;

    if (message.guild){
      const member = await message.guild.members
      .fetch((match || [message.author.id])[0])
      .catch(() => message.member);

      user = member.user;
    } else {
      user = message.author;
    };
    
    const embed = new MessageEmbed()
                .setColor('GREY')
                .setDescription('Inverted Avatar!')
                .setImage("attachment://inverted.png")
                .setFooter(`Image Manipulation | \©️${new Date().getFullYear()} Mai`);
    
    return message.channel.send({
      embed: embed,
      files: [{
        name: 'inverted.png',
        attachment: [
          'https://some-random-api.ml/canvas/invert?avatar=',
          user.displayAvatarURL({ format: 'png', size: 1024 })
        ].join('')
      }]
    });
  }
};
