const { readdirSync } = require('fs');
const { join } = require('path');
const requiretext = require('require-text');
const GPQL = {}, LANG = {}, list = new Intl.ListFormat('en');

for (const graphql of readdirSync(join(__dirname, '..', 'assets/graphql'))){
  GPQL[graphql.split('.graphql')[0]] = requiretext(join(__dirname, '..', 'assets/graphql', graphql), require);
};

for (const language of readdirSync(join(__dirname, '..', 'assets/language'))){
  LANG[language.split('.json')[0]] = require(join(__dirname, '..', 'assets/language', language))
};

const Language = require('./Language');

class Services{
  constructor(client){
    /**
     * The client that instantiated this Manager
     * @name CommandManager#client
     * @type {MaiClient}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    this.LANGUAGE = new Language(client, LANG);
    this.GRAPHQL = GPQL;
    this.ANILIST = {};
    this.MAL = {};
    this.UTIL = { STRING: {}, NUMBER: {}, ARRAY: {}, };

    this.ANILIST.fetch = function fetch(query ,variables){
      return fetch('https://graphql.anilist.co', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ query, variables })
      })
      .then(res => res.json())
      .catch(err => err);
    }

    this.MAL.producers = require(join(__dirname, '..', 'assets/json/MAL_Producers.json'));

    this.MAL.genres = {
      action: 1,
      adventure: 2,
      cars: 3,
      comedy: 4,
      dementia: 5,
      demons: 6,
      mystery: 7,
      drama: 8,
      ecchi: 9,
      fantasy: 10,
      game: 11,
      hentai: 12,
      historical: 13,
      horror: 14,
      kids: 15,
      magic: 16,
      'martial arts': 17,
      mecha: 18,
      music: 19,
      parody: 20,
      samurai: 21,
      romance: 22,
      school: 23,
      'sci-fi': 24,
      shoujo: 25,
      'shoujo ai': 26,
      shounen: 27,
      'shounen ai': 28,
      space: 29,
      sports: 30,
      'super power': 31,
      vampire: 32,
      yaoi: 33,
      yuri: 34,
      harem: 35,
      'slice of life': 36,
      supernatural: 37,
      military: 38,
      police: 39,
      psychological: 40,
      thriller: 41,
      seinen: 42,
      josei: 43
    };

    this.MAL.sources = {
      'Light novel':'lightnovels',
      'Manga':'manga',
      'Web manga':'manhwa',
      'One-shot':'oneshots',
      'Doujinshi':'doujin',
      'Novel':'novels',
      'Manhwa':'manhwa',
      'Manhua':'manhua'
    };

    /**
     * TextTruncate -> Shortens the string to desired length
     * @param {string} str the string to test with
     * @param {number} length the length the string should have
     * @param {string} end the end of the string indicating it's truncated
     * @returns {string} Truncated string
     */
    this.UTIL.STRING.truncate = function truncate(str = '', length = 100, end = '...'){
      return String(str).substring(0, length - end.length) + (str.length > length ? end : '');
    };

    this.UTIL.STRING.clean = function clean(str){
      return String(text).replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
    };

    /**
     * Appends ordinal suffixes to input numbers. Max input before failing is 10e307
     * @param {number|string} n the Number to append ordinal suffix to
     * @example ordinalize(10) -> returns `10th`; ordinalize(22) -> returns `22nd`
     * @returns {string} Ordinalized number
     * @note Does not support negative numbers!
     */
    this.UTIL.NUMBER.ordinalize = function ordinalize(n = 0){
      return Number(n)+[,'st','nd','rd'][n/10%10^1&&n%10]||Number(n)+'th';
    };

    /**
     * Converts number to string and adds a comma separator
     * @param {number|string} number the Number to convert
     * @param {number} maximumFractionDigits the number of decimal places to include in result
     * @example commatize(11235) will return `11,235`; commatize(1234.567, 2) will return `1,234.57`
     * @returns {string} number with commas
     * @note Numbers greater than 10e307 will return '∞'
     */
    this.UTIL.NUMBER.separate = function separate(number, maximumFractionDigits = 2){
      return Number(number || '').toLocaleString('en-US', { maximumFractionDigits });
    };

    /**
     * Converts a number to a stringified compact version
     * @param {number|string} number the Number to convert
     * @param {number} maximumFractionDigits the number of decimal places to include in result
     * @example compactNum(11235) will return `11.24K`; commatize(1234.567, 0) will return `1K`
     * @returns {string} compact version of the number
     * @note Maximum number for optimal usage is 10e13
     */
    this.UTIL.NUMBER.compact = function compact(number, maximumFractionDigits = 2){
      return Number(number || '').toLocaleString('en-US', { notation: 'compact', maximumFractionDigits });
    };

    /**
     * Joins array via oxford comma and append 'and' on last 2 items
     * @param {array} array the array to join
     * @returns {string} the joined array
     */
    this.UTIL.ARRAY.join = function join(array = []){
      return list.format(array.map(x => String(x)));
    };

    /**
     * Join array and add a limiter.
     * @param {array} array the array to join
     * @param {number} limit the maximum length of the string output
     * @param {string} connector similar to param of `array.join()`
     * @example joinArrayAndLimit([1,2,3,4,5,6,7,8,9,10,11]) will return  text: '1, 2, 3, 4', excess: 6
     * @returns {object.text} The joined array
     * @returns {object.excess} The number of elements not included on join
     * @note Will throw a typeerror array.reduce is not a function if param1 is not of type array.
     */
    this.UTIL.ARRAY.joinAndLimit = function joinAndLimit(array = [], limit = 1000, connector = '\n'){
      return array.reduce((a,c,i,x) => a.text.length + String(c).length > limit
      ? { text: a.text, excess: a.excess + 1 }
      : { text: a.text + (!!i ? connector : '') + String(c), excess: a.excess }
      , { text: '', excess: 0});
    };

    /**
     * Shuffles the original array
     * @param {Array} array the array to shuffle
     * @returns {void}
     */
    this.UTIL.ARRAY.shuffle = function shuffle(arr){
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      };
    };
 };
};

module.exports = Services;
