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

    if (!command){
      return message.channel.send('Please enter a command name');
    };

    const { status, err, info } = message.client.commands.reload(command);

    if (status === 'FAILED'){
      return message.channel.send( err.stack,{ code: 'xl'});
    };

    return message.channel.send(`Successfully reloaded command **${command}**`);
  }
};
