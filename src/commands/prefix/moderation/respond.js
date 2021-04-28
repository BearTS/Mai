module.exports = {
  name             : 'respond<incomplete>',
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
  run              : (message, language, [id='', action='', ...reason]) => {

    return console.log(language)

    const parameters  = new language.Parameter({ '%AUTHOR%': message.author.tag });
    let suggestion_message;

    let channel = message.guild.profile?.channels.suggest;
    if (!channel){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'RESPOND_', parameters }));
    };

    channel = message.guild.channels.cache.get(channel);
    if (!channel){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'RESPOND_', parameters }));
    };

    if (!(id = id.match(/\d{17,19}/)?.[0])){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'RESPOND_', parameters }));
    };

    if (['accept','deny'].includes(action.toLowerCase())){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'RESPOND_', parameters }));
    };

    if (!reason.length || reason.length > 1024){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'RESPOND_', parameters }));
    };

    // if (suggestion_message = channel.messages.fetch(id).catch(() => null) !== null){
    //   return message.reply(language.get({ '$in': 'COMMANDS', id: 'RESPOND_', parameters }));
    // };

    const isNotFromMe  = suggestion_message.author.id !== client.user.id;
    const hasNoEmbed   = Boolean(suggestion_message.embeds.length);
    const isSuggestion = suggestion_message.embeds[0].title?.endsWith('Suggestion');
    const responded    = suggestion_message.embeds[0].fields.length > 1;
    const isAccepted   = action.toLowerCase() === 'accept';

    if (isNotFromMe || hasNoEmbed || !isSuggestion){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'RESPOND_', parameters }));
    };

    if (responded){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'RESPOND_', parameters }));
    };

    if (!suggestion_message.editable){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'RESPOND_', parameters }));
    };

    suggestion_message.embeds[0].fields[0].value = `${isAccepted ? 'Accepted' : 'Denied'} by **${message.author.tag}**`;
    return suggestion_message.edit(
      new MessageEmbed(suggestion_message.embeds[0])
      .setColor(isAccepted ? 'GREEN' : 'RED')
      .addField('Reason', reason.join(' '))
    )
    .then(()     => message.react('✅'))
    .catch(error => language.get({ '$in': 'COMMANDS', id: 'RESPOND_', parameters: parameters.assign({ '%ERROR%': error.message })}));
  }
};
