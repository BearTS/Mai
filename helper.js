const requireText = require('require-text')

module.exports = {

  //text Helpers
    TextHelpers: require('./utilities/String Utilities.js')

  //GraphiQl Templates
  , NextAirDate_NoQuery: requireText('./assets/graphql/NextAirDateWithoutQuery.graphql', require)
  , NextAirDate_Query: requireText('./assets/graphql/NextAirDateWithQuery.graphql', require)
  , Schedule: requireText('./assets/graphql/Schedule.graphql', require)
  , Seiyuu: requireText('./assets/graphql/Seiyuu.graphql', require)
  , Watching: requireText('./assets/graphql/Watching.graphql',  require)

  //Anilist Tools
  , AniListQuery: require('./utilities/Anilist Query')
  , AniListSchedule: require('./utilities/Anilist Schedule.js')

  //Error Tools
  , ErrorTools: require('./utilities/Errors.js')

  //Mongoose Models
  , MongooseModels: {
      guildInviteSchema: require('./models/guildInviteSchema.js')
    , guildProfileSchema: require('./models/guildProfileSchema.js')
    , guildWatchlistSchema: require('./models/guildWatchlistSchema.js')
    , malProfileSchema: require('./models/malProfileSchema.js')
    , xpSchema: require('./models/xpSchema.js')
  }

  //Databases
  , LocalDatabase: {
      animeDB: require('./assets/json/anime.json')
    , mangaDB: require('./assets/json/manga.json')
    , mai: require('./assets/json/mai.json')
  }

  //Classes
  , Classes: {
      Paginate: require('./struct/Paginate.js')
  }

  , Quiz: {
      collectPlayers: require('./utilities/quiz/collectPlayers.js')
    , loadQuestions: require('./utilities/quiz/loadQuestions.js')
    , sendQuestion: require('./utilities/quiz/sendQuestion.js')
  }

  //XP
  , addXP: require('./utilities/Add XP.js')

  //Permissions Checker
  , PermissionsCheck: require('./utilities/Permissions Checker.js')
  , CooldownsCheck: require('./utilities/Cooldowns Checker.js')

}
