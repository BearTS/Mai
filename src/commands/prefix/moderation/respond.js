module.exports = {
  name             : 'respond',
  description      : 'Respond to user suggestion.',
  aliases          : [ 'resetroles', 'removeroles', 'removerole', 'purgerole' ],
  cooldown         : null,
  clientPermissions: [],
  permissions      : [],
  group            : 'moderation',
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : true,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'Message ID', 'accept/deny', 'reason' ],
  examples         : [ 'respond 690105173087223812 deny Doesn\'t make much sense to do this' ],
  run              : async (message, language, [id='', action='', ...reason]) => {

    const parameters  = new language.Parameter({ '%AUTHOR%': message.author.tag });
    let suggestion_message;

    let channel = message.guild.profile?.channels.suggest;
    if (!channel){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'RESPOND_CNOTSET', parameters }));
    };

    channel = message.guild.channels.cache.get(channel);
    if (!channel){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'RESPOND_CINVALD', parameters }));
    };

    if (!(id = id.match(/\d{17,19}/)?.[0])){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'RESPOND_IDINVLD', parameters }));
    };

    if (!(suggestion_message = await channel.messages.fetch(id, false).catch(() => null))) {
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'RESPOND_IDINVLD', parameters }));
    };

    if (['accept','deny'].includes(action.toLowerCase())){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'RESPOND_ACINVLD', parameters }));
    };

    if (!reason.length || reason.length > 1024){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'RESPOND_XREASON', parameters }));
    };

    const isNotFromMe  = suggestion_message.author.id !== client.user.id;
    const hasNoEmbed   = Boolean(suggestion_message.embeds.length);
    const isSuggestion = suggestion_message.embeds[0].title?.endsWith('Suggestion');
    const responded    = suggestion_message.embeds[0].fields.length > 1;
    const isAccepted   = action.toLowerCase() === 'accept';

    if (isNotFromMe || hasNoEmbed || !isSuggestion){
      parameters.assign({ '%MESSAGEID%': id.match(/\d{17,19}/)[0] });
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'RESPOND_NOTSUGG', parameters }));
    };

    if (responded){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'RESPOND_ALRESP', parameters }));
    };

    if (!suggestion_message.editable){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'RESPOND_NOEDIT', parameters }));
    };

    suggestion_message.embeds[0].fields[0].value = `${isAccepted ? 'Accepted' : 'Denied'} by **${message.author.tag}**`;

    return suggestion_message.edit(
      new MessageEmbed(suggestion_message.embeds[0])
      .setColor(isAccepted ? 'GREEN' : 'RED')
      .addField('Reason', reason.join(' '))
    )
    .then(async () => {
      await message.react('✅');
      let user = suggestion_message.embeds[0].thumbnail.url?.match(/\d{17,19}/)?.[0];
      if (!user || !(user = await message.client.users.fetch(user).catch(() => {}))){
         return;
      };
      const DICT = language.getDictionary([ 'accepted', 'denied' ]);
      parameters.assign({
        '%USER%'     : user.tag,
        '%STATUS%'   : DICT[action.toLowerCase() === 'accept' ? 'accepted' : 'denied'],
        '%GUILDNAME%': message.guild.name,
        '%LINK%'     : `https://discord.com/channels/${message.guild.id}/${suggestion_message.channel.id}/${suggestion_message.id}`
      });
      await user.send(language.get({ '$in': 'COMMANDS', id: 'RESPOND_SENDUSR', parameters }));
    })
    .catch(error => language.get({ '$in': 'COMMANDS', id: 'RESPOND_ERROR', parameters: parameters.assign({ '%ERROR%': error.message })}));
  }
};
