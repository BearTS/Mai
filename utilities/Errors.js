module.exports = {
  jikanError: (code) => {
    const err = {
      400: 'The request sent was invalid',
      404: 'No results found',
      429: 'I\'ve been rate-limited. Please try again in a few seconds...',
      500: 'The server responded with 500 HTTP error code, there is probably something wrong with Jikan.',
      503: 'The server responded with 503 HTTP error code, something is not working on MyAnimeList right now.'
    }
    return err[code] ? err[code] : 'The request I sent was rejected by MyAnimelist for some reason. Please report this incident to my developer.'
  }
}
