const guildProfileSchema = require(`${process.cwd()}/models/GuildProfile`);
const consoleUtil = require(`${process.cwd()}/util/console`);
const { Error } = require('mongoose');

module.exports = async (client, guild) => {

  let data = await guildProfileSchema.findOne({
    guildID: guild.id
  }).catch((err) => null) || await new guildProfileSchema({
    guildID: guild.id
  }).save().catch(err => err);

  if (data instanceof Error){
    consoleUtil.error(
        'Unable to find/register guild '
      + guild
      + 'on/to mongo Database.\n'
      + data.name
    );
  };

  client.guildProfiles.set(
      guild.id
    , data || { guildID : guild.id }
  );
};
