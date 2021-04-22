module.exports = {
  name            : 'reload',
  aliases         : [],
  ownerOnly       : true,
  group           : 'owner',
  requiresDatabase: false,
  rankcommand     : false,
  description     : 'Reloads a command',
  parameters      : [ 'command name/alias' ],
  examples        : [ 'reload anime' ],
  run             : (message, language, [command] ) => {
    
    const parameters = new language.Parameter({
      '%AUTHOR%' : message.author.tag,
      '%COMMAND%': command
    });

    if (!command){
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'RELOAD_CMDNOTFO', parameters }));
    };

    const { status, err, info } = message.client.commands.reload(command);

    if (status === 'FAILED'){
      parameters.assign({ '%ERROR%': err.stack });
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'RELOAD_FAILED', parameters }));
    };

    return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'RELOAD_SUCCESS', parameters }));
  }
};
