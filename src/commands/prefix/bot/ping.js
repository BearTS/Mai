module.exports = {
  name             : 'ping',
  description      : 'Display various pings this bot is connected to.',
  aliases          : [ 'latency' ],
  cooldown         : null,
  clientPermissions: [],
  permissions      : [],
  group            : 'bot',
  guildOnly        : false,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [],
  examples         : [],
  run              : async (message, language, args) => {

    const  parameters = new language.Parameter({ '%UTHOR%': message.author.tag });
    const  prompt     = await message.reply(language.get({ '$in': 'COMMANDS', id: 'PING_PROMPT', parameters }));
    parameters.assign({ '%PING%': message.client.ws.ping, '%ROUNDTRIP%': prompt.createdAt - message.createdAt, '%ICON%': '\\🏓' });
    return prompt.edit(language.get({ '$in': 'COMMANDS', id: 'PING_RESULT', parameters }));
  }
};
