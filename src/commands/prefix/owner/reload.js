module.exports = {
  name: 'reload',
  aliases: [],
  ownerOnly: true,
  group: 'owner',
  requiresDatabase: false,
  rankcommand: false,
  description: 'Reloads a command',
  parameters: [ 'command name/alias' ],
  examples: [
    'reload anime'
  ],
  run: (message, language, [command] ) => {

    const parameters = {
      "%AUTHOR%": message.author.tag,
      "%COMMAND%": command
    };

    if (!command){
      return message.channel.send(language.get({ parameters, id: 'NO_COMMAND' }));
    };

    const { status, err, info } = message.client.commands.reload(command);

    if (status === 'FAILED'){
      return message.channel.send(language.get({ parameters, id: 'FAILED' }));
    };

    return message.channel.send(language.get({ parameters, id: 'SUCCESS' }));
  }
};
