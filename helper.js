const requireText = require('require-text')

module.exports = {

  //text Helpers
    TextHelpers: require('./utilities/String Utilities')

  //GraphiQl Templates
  , NextAirDate_NoQuery: requireText('./assets/graphql/NextAirDateWithoutQuery.graphql', require)
  , NextAirDate_Query: requireText('./assets/graphql/NextAirDateWithQuery.graphql', require)
  , Schedule: requireText('./assets/graphql/Schedule.graphql', require)
  , Seiyuu: requireText('./assets/graphql/Seiyuu.graphql', require)
  , Watching: requireText('./assets/graphql/Watching.graphql',  require)

  //Anilist Tools
  , AniListQuery: require('./utilities/Anilist Query')
  , AniListSchedule: require('./utilities/Anilist Schedule')

  //Error Tools
  , ErrorTools: require('./utilities/Errors')

  //Mongoose Models
  , MongooseModels: {
      bankSchema: require('./models/bankSchema')
    , guildInviteSchema: require('./models/guildInviteSchema')
    , guildProfileSchema: require('./models/guildProfileSchema')
    , guildWatchlistSchema: require('./models/guildWatchlistSchema')
    , malProfileSchema: require('./models/malProfileSchema')
    , xpSchema: require('./models/xpSchema')
  }

  //Databases
  , LocalDatabase: {
      animeDB: require('./assets/json/anime.json')
    , mangaDB: require('./assets/json/manga.json')
    , mai: require('./assets/json/mai.json')
  }

  //Classes
  , Classes: {
      Paginate: require('./struct/Paginate')
  }

  , Quiz: {
      collectPlayers: require('./utilities/quiz/collectPlayers')
    , loadQuestions: require('./utilities/quiz/loadQuestions')
    , sendQuestion: require('./utilities/quiz/sendQuestion')
  }

  //XP
  , addXP: require('./utilities/Add XP')

  //Permissions Checker
  , PermissionsCheck: require('./utilities/Permissions Checker')

  //Cooldowns Checker
  , CooldownsCheck: require('./utilities/Cooldowns Checker')

  //Chatbot
  , Chatbot: require('./utilities/Chatbot')

}
