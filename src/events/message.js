module.exports = async (client, message) => {

  if (message.author.bot){
    return;
  };

  if (message.author.profile === null){
    await message.author.loadProfile();
  };

  if (message.guild.profile === null){
    await message.guild.loadProfile();
  };

  const language = message.author.profile?.data.language;
  const langservices = message.client.services.LANGUAGE;

  if (message.content.toLowerCase() === 'prefix'){
    const path = ['system', 'prefix'];
    const prop = {
      '%AUTHOR%': message.author.tag,
      '%CLIENTPREFIX%' : client.prefix,
      '%SERVERPREFIX%': message.guild.profile?.prefix || 'Not set'
    };
    const response = langservices.get({ parameters: prop, path, language });
    return message.reply(response);
  };

  const { executed, reason } = await client.commands.handle(message, langservices);

};
