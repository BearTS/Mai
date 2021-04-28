const { Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'addemoji',
  description      : 'Add an emoji to the server using the supplied image URL and name (optional)',
  aliases          : [ ],
  cooldown         : null,
  clientPermissions: [ FLAGS.MANAGE_EMOJIS ],
  permissions      : [ FLAGS.MANAGE_EMOJIS ],
  group            : 'moderation',
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'Image URL', 'Emoji Name', 'image upload' ],
  examples         : [ 'addemoji https://some-url/path-to-image.format emojiname' ],
  run              : async (message, language, args) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag })
    const regex      = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
    const url        = message.attachments.first()?.url || args.join(' ').match(regex)?.[0];
    const name       = args.join(' ').split(url)[0]?.split(/ +/)[0]?.trim();

    if (!url){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'ADDEMOJI_NO_URL', parameters }));
    };

    return message.guild.emojis.create(url, name || 'new_emoji')
    .then(emoji  => message.channel.send(language.get({ '$in': 'COMMANDS', id: 'ADDEMOJI_SUCCES', parameters: parameters.assign({ '%EMOJI_NAME%': emoji.name, '%EMOJI%': emoji.toString() }) })))
    .catch(error => message.reply(language.get({ '$in': 'COMMANDS', id: 'ADDEMOJI_FAILED', parameters: parameters.assign({ '%ERROR%': error.message.replace(`Invalid Form Body\nimage:`,'') }) })));
  }
};
