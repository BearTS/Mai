const { connection } = require('mongoose')
const gp = require('../../models/guildProfileSchema.js')


module.exports.loadguilddata = async (client) => {

  const res = await gp.find({})

  if (!res.length) return

  res.forEach( guildData => {
    client.guildsettings.set(guildData.guildID, guildData)
  })

}
