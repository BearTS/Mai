const {
    TextHelpers: {
      ordinalize
  }
  , MongooseModels: {
      guildWatchlistSchema
  }
  , AniListQuery: query
} = require('../../helper')
const { MessageEmbed } = require('discord.js')
const { Error: MongooseError } = require('mongoose')

module.exports = {
  name: 'cleanup',
  aliases: [],
  ownerOnly: true,
  group: 'owner',
  description: 'Remove all finished Anime from Scheduler',
  examples: [],
  parameters: [],
  run: async ( client, message) => {

//-------------------GET THE DATA FROM THE DATABASE---------------------------//

    let profiles = await guildWatchlistSchema.find({})
    .catch(err => err)

//------------------RETURN ERROR IF CONNECTION FAILS-------------------------//
//This prevents the bot from crashing altogether

    if (profiles instanceof MongooseError)
    return message.channel.send(
      new MessageEmbed().setColor('RED')
        .setDescription(
          '\u200b\n\n\u2000\u2000<:cancel:712586986216489011>|\u2000\u2000'
        + 'Unable to contact the database.'
        + '\u2000\u2000\n\n\u200b'
      )
    )

//--------------Get all the media Id from each server-----------------------//

    const ids = []

    for (const { data } of profiles){
      for (const id of data){
        if (!ids.includes(id))
        ids.push(id)
      }
    }

//-----------Check the airing status of these IDs---------------------------//

//query from Anilist

    const data = await query(`query ($ids: [Int]) { Page { media(id_in:$ids) { id status }}}`, {ids})

//check for errors
    if (data.errors)
    return message.channel.send(
      new MessageEmbed().setColor('RED')
        .setDescription(
          '\u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000'
        + 'AniList Returned (an) Error(s).\n\n'
        + data.errors.map(e => `\\⚠️ \`[${e.status}]\` - *${e.message}*`).join('\n')
      )
    )

    //extract metadata
    const { data: { Page: { media }}} = data

    //get ids with 'FINISHED STATUS o CANCELLED STATUS'
    const finished = []

    for (const info of media){
      if (['CANCELLLED','FINISHED'].includes(info.status))
      finished.push(info.id)
    }

    //iterate over server's schema and remove the ids from 'finished' Array

    for (const i of profiles){

      //get individual profile
      let profile = await guildWatchlistSchema.findOne({
        guildID: i.guildID
      }).catch(err => err)

      //check again for errors
      if (profile instanceof MongooseError)
      return message.channel.send(
        new MessageEmbed().setColor('RED')
          .setDescription(
            '\u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000'
          + 'Unable to contact the database.'
        )
      )

      //iterate over the server's list
      for (const id of profile.data){
        //compare ids
        if (finished.includes(id))
        profile.data.splice(profile.data.indexOf(id), 1)
      }

      //save info, then check if the data was actually saved
      await profile.save().catch(()=> message.channel.send(
        new MessageEmbed().setColor('RED')
          .setDescription(
            '\u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000'
          + 'Unable to save information for the server'
          + profile.guildID
          )
        )
      )
    }

    //send a confirmation message
    return message.channel.send(
      new MessageEmbed().setDescription(
          '\u2000\u2000<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
          + 'Cleaned Watchlists'
      ).setColor('GREEN')
    )

  }
}
