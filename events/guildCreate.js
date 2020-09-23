const { MongooseModels: { guildProfileSchema }} = require('../helper')
const { Error } = require('mongoose')

module.exports = async (client, guild) => {


  let data = await guildProfileSchema.findOne({
    guildID: guild.id
  }).catch((err)=> err)

  if (!data) data = new guildProfileSchema({
    guildID: guild.id
  }).save()
      .catch((err)=> err)

  if (data instanceof Error){
    console.error(
        'Unable to find/register guild '
      + guild
      + 'on/to mongo Database.\n'
      + data.name
    )
  }

  client.guildsettings.set(
      guild.id
    , data
      ? data
      : { guildID : guild.id }
    )


}
