const { Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'comment',
  description      : 'Comment something and return a youtube-like comment.',
  aliases          : [],
  cooldown         : { time: 1e4 },
  clientPermissions: [ FLAGS.ATTACH_FILES ],
  permissions      : [],
  group            : 'fun',
  guildOnly        : false,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'Question answerable by Yes/No' ],
  examples         : [ 'comment I never thought this would be the effect.' ],
  run              : async (message, language, args) => {
    const baseURI = 'https://some-random-api.ml/canvas/youtube-comment?';
    const avatar  = encodeURIComponent(message.author.displayAvatarURL({format: 'png', size:1024}));
    const name    = encodeURIComponent(message.member?.displayName || message.author.username);
    const comment = encodeURIComponent(args.join(' '));
    return message.channel.send({ files: [{ name: 'youtube.png', attachment: `${baseURI}avatar=${avatar}&username=${name}&comment=${comment}` }] });
  }
};
