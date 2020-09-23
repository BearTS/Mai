const xpSchema = require('../models/xpSchema')

module.exports = (guildID, userID, xp) => {

  if (typeof guildID != 'string' || typeof userID != 'string') throw new TypeError(`AddXP: Expected String, received ${typeof guildID != 'string' ? typeof guildID : typeof userID}`)

  if (typeof xp == 'object'){
    xp.maxnum = parseInt(xp.maxnum) ? parseInt(xp.maxnum) : 25
    xp.minnum = parseInt(xp.minnum) ? parseInt(xp.minnum) : 10
    xp = xp.random ? Math.floor(Math.random() * (xp.maxnum - xp.minnum)) + xp.minnum : xp
  } else if (typeof xp == 'number'){
    xp = xp
  } else {
    throw new TypeError(`AddXP: Expected object or number, received ${typeof xp}`)
  }

    return new Promise((resolve,reject)=>{
      xpSchema.findOne({ guildID, userID }, async (err,data) => {

        if (err) reject('Unable to connecto to database')

        if (!data) data = await new xpSchema({ guildID, userID }).save().catch(()=>null)

        if (!data) reject('Unable to save new document')

        let cap = 150 * (data.level * 2)
        let next = cap * data.level
        let difference = next - data.points

        data.points = data.points + xp

        while ( next <= data.points) {
          data.level++
          cap = 150 * (data.level * 2)
          next = cap * data.level
        }

        data.save()
          .then(()=> resolve(`Success`))
            .catch(()=> reject('Unable to save xp document'))
    })
  })
}
