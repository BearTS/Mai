module.exports = {
  name: 'triggered',
  aliases: [],
  group: 'fun',
  description: 'Triggered users',
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

    return message.channel.send({
      files: [{
        name: 'triggered.gif',
        attachment: [
          'https://some-random-api.ml/canvas/triggered?avatar=',
          user.displayAvatarURL({ format: 'png', size: 1024 })
        ].join('')
      }]
    });
  }
};
