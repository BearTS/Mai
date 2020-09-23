const fetch = require('node-fetch')

module.exports = async (client) => {

  const now = Date.now()

  const [
      jikan
    , anilist
    , reddit
    , jisho
    , steam
    , time_is
    , urban ] = await Promise.all([

      fetch('https://api.jikan.moe/v3/character/1')
        .then(()=> (Date.now() - now).toFixed())
          .catch(()=> null)

    , fetch('https://graphql.anilist.co',{ method: 'POST', body: JSON.stringify({query:`{Media{id}}`})})
        .then(()=> (Date.now() - now).toFixed())
          .catch(()=> null)


    , fetch('https://reddit.com/r/animemes.json')
        .then(() => (Date.now() - now).toFixed())
          .catch(()=> null)

    , fetch(`https://jisho.org/api/v1/search/words?keyword=konnichiwa`)
        .then(() => (Date.now() - now).toFixed())
          .catch(()=> null)

    , fetch('https://store.steampowered.com/api/storesearch/?cc=us&l=en&term=DDLC')
        .then(() => (Date.now() - now).toFixed())
          .catch(()=> null)

    , fetch('https://time.is/tokyo')
        .then(() => (Date.now() - now).toFixed())
          .catch(()=> null)

    , require('relevant-urban')('Starting up')
        .then(() => (Date.now() - now).toFixed())
          .catch(()=> null)

    ])

  return client.config.pings = {
      jikan
    , anilist
    , reddit
    , jisho
    , steam
    , time_is
    , urban
    , lastUpdatedAt: new Date()
  }
}
