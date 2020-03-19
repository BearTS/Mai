# animequotes

![npm](https://img.shields.io/npm/v/animequotes?style=flat-square) ![npm](https://img.shields.io/npm/dt/animequotes?style=flat-square) ![NPM](https://img.shields.io/npm/l/animequotes?style=flat-square) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)

Anime Quotes for Node.


## Install

`npm install animequotes`


## Usage

```javascript
const animeQuotes = require('animequotes')

// Get Random Quote
console.log(animeQuotes.randomQuote())

// Get Quote by ID
console.log(animeQuotes.getQuote(1))

// Get Quotes by Anime
console.log(animeQuotes.getQuotesByAnime('Naruto'))

// Get Quotes by Character
console.log(animeQuotes.getQuotesByCharacter('Itachi Uchiha'))
```


## Example Object

```json
{
  "quote": "You are weak. Why are you so weak? Because you lack... hatred.",
  "anime": "Naruto",
  "id": 635,
  "name": "Itachi Uchiha"
}
```


## The More the Merrier

* Total Quotes: 8510
* No. of unique Characters: 2334
* No. of unique anime: 787


## Changelog

See [CHANGELOG.md](CHANGELOG.md).


## License

 - **MIT** : http://opensource.org/licenses/MIT
