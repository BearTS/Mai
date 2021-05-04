/*
>>>>>>>>>>>>>>>>>>>>>>> DISCLAIMER <<<<<<<<<<<<<<<<<<<<<<<

This is a modified version of TehNut's Anischedule bot for discord. Please
support him by adding star on https://github.com/TehNut/Anischedule. If you
like this one please do add a star on this repository. If you have more
questions regarding the bot you can join Mai's support server @ support.mai-san.ml

>>>>>>>>>>>>>>>>>>>>>>>>>>>> <<<<<<<<<<<<<<<<<<<<<<<<<<<<
*/

require('moment-duration-format');
const { duration } = require('moment');
const { MessageEmbed, Permissions: { FLAGS }, TextChannel } = require('discord.js');
const _fetch = require('node-fetch');

module.exports = class Anischedule{
  constructor(client){

    /**
     * The client that instantiated this Scheduler
     * @name Anischedule#client
     * @type {MaiClient}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client })

    /**
     * the queuedNotifications for the current running instance of {@link} Anischedule#makeAnnouncement
     * @type {array}
     */
    this.queuedNotifications = [];

    this.info = {
      /**
       * Media Formats for the fetched data
       * @type {array}
       */
      mediaFormat: {
        TV: 'TV',
        TV_SHORT: 'TV Shorts',
        MOVIE: 'Movie',
        SPECIAL: 'Special',
        ONA: 'ONA',
        OVA: 'OVA',
        MUSIC: 'Music',
        MANGA: 'Manga',
        NOVEL: 'Light Novel',
        ONE_SHOT: 'One Shot Manga'
      },
      months: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
      ],
      weeks: [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday'
      ],
      defaultgenres: [
        'Action',
        'Adventure',
        'Comedy',
        'Drama',
        'Sci-Fi',
        'Mystery',
        'Supernatural',
        'Fantasy',
        'Sports',
        'Romance',
        'Slice of Life',
        'Horror',
        'Psychological',
        'Thriller',
        'Ecchi',
        'Mecha',
        'Music',
        'Mahou Shoujo',
        'Hentai'
      ],
      langflags: [
        { lang: 'Hungarian', flag: '🇭🇺' },
        { lang: 'Japanese', flag: '🇯🇵' },
        { lang: 'French' , flag: '🇫🇷' },
        { lang: 'Russian' , flag:'🇷🇺' },
        { lang: 'German', flag: '🇩🇪' },
        { lang: 'English', flag: '🇺🇸' },
        { lang: 'Italian', flag: '🇮🇹' },
        { lang: 'Spanish', flag: '🇪🇸' },
        { lang: 'Korean', flag: '🇰🇷' },
        { lang: 'Chinese', flag: '🇨🇳' },
        { lang: 'Brazilian', flag: '🇧🇷' }
      ]
    };
  };

  /**
   * Fetch data on the Anilist API using the query and variable.
   * @param {string} query The [Graphiql] string to query with
   * @param {object} variables The variables to fetch with
   * @returns {Promise<data>}
   */
  fetch(query, variables){
    return _fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query, variables })
    })
    .then(res => res.json())
    .catch(err => err);
  };

  /**
   * Fetch all media id from the guild watchlists.
   * @returns {Promise<array>} array of unique ids from the watchlist
   */
  getAllWatched(){
    return new Promise(async resolve => {
      const list = await this.client.database['GuildWatchlist'].find({ _id: { '$in': [...this.client.guilds.cache.keys()]}}).catch(err => err);
      if (list instanceof Error) return (console.log(`\x1b[35m[SHARD_${this.client.shard.ids[0]}] \x1b[31m[MAI_ANISCHEDULE]\x1b[0m: ${error.message}`));
      return resolve([...new Set(list.flatMap(guild => guild.data))]);
    });
  };

  /**
   * Embedify a media object.
   * @param {data} entry the media object to embedify
   * @param {Date} date The airing date of the media.
   * @returns {MessageEmbed}
   */
  getAnnouncementEmbed(entry, date){
    const sites = [
      'Amazon', 'Animelab', 'AnimeLab',
      'Crunchyroll', 'Funimation',
      'Hidive', 'Hulu', 'Netflix', 'Viz'
    ];

    const watch = entry.media.externalLinks?.filter(x => sites.includes(x.site)).map(x => {
      return `[${x.site}](${x.url})`;
    }).join(' • ') || [];

    const visit = entry.media.externalLinks?.filter(x => !sites.includes(x.site)).map(x => {
      return `[${x.site}](${x.url})`;
    }).join(' • ') || [];

    return new MessageEmbed()
    .setColor(entry.media.coverImage.color || 0xe620a4)
    .setThumbnail(entry.media.coverImage.large)
    .setAuthor('Mai Anischedule')
    .setTimestamp(date)
    .setDescription([
      `Episode **${entry.episode}** of **[${entry.media.title.romaji}](${entry.media.siteUrl})**`,
      `${entry.media.episodes === entry.episode ? ' **(Final Episode)** ' : ' '}`,
      `has just aired.${watch ? `\n\nWatch: ${watch}` : ''}${visit ? `\n\nVisit: ${visit}` : ''}`,
      `\n\nIt may take some time to appear on the above service(s).`
    ].join(''))
    .setFooter([
      `${entry.media.format ? `Format: ${this.info.mediaFormat[entry.media.format] || 'Unknown'}`:''}`,
      `${entry.media.duration ? `Duration: ${ duration(entry.media.duration * 60, 'seconds') .format('H [hr] m [minute]') }  `:''}`,
      `${!!entry.media.studios.edges.length ? `Studio: ${ entry.media.studios.edges[0].node.name }` : ''}`
    ].filter(Boolean).join('  •  '));
  };

  /**
   * Get the Date instance of the next (number of) day(s)
   * @param {number} days Number of days to fetch timestamp with
   * @returns {Date}
   */
  getFromNextDays(days = 1){
    return new Date(new Date().getTime() + (864e5 * days));
  };

  /**
   * Handle the scheduler
   * Fetch the data and append timeout functions to data to execute
   * @param {*} nextDay the timestamp of the date to grab data from
   * @param {*} page The current page returned from data via graphiql Pagination
   * @returns {Promise<void>}
   */
  async handleSchedules(nextDay, page){
    const watched = await this.getAllWatched().catch(() => null);
    const schedule = this.client.services.GRAPHQL.Schedule;

    if (!watched || !watched.length){  //Retry in 1 minute if database fetching fails due to some error.
      if (watched === null) setTimeout(() => this.handleSchedules(nextDay, page), 6e4);
      return console.log(`\x1b[35m[SHARD_${this.client.shard.ids.join(' ')}] \x1b[33m[MAI_ANISCHEDULE]\x1b[0m: Missing Data from Database.\nNo lists were found on the database. Please ignore this message if this is the first time setting the bot.`);
    };

    const res = await this.fetch(schedule, { page, watched, nextDay });

    if (res.errors){
      // If error occurs, anischedule will fail to display the anime, so we will refetch if the error is
      // caused by a ratelimiting error, which is on code 429. If it is, we will retry it.
      if (res.errors.some(error => error.status === 429)) setTimeout(() => this.handleSchedules(nextDay, page), 18e5);
      return console.log(`\x1b[31m[MAI_ANISCHEDULE]\x1b[0m: FetchError\n${res.errors.map(err => err.message).join('\n')}`);
    };

    for (const entry of res.data.Page.airingSchedules.filter(e => !this.queuedNotifications.includes(e.id))){
      const date = new Date(entry.airingAt * 1e3);
      const entry_t = Object.values(entry.media.title).filter(Boolean)[0];
      const tbefair = duration(entry.timeUntilAiring, 'seconds').format('H [hours and] m [minutes]');

      console.log(`\x1b[35m[SHARD_${this.client.shard.ids.join(' ')}] \x1b[32m[MAI_ANISCHEDULE]\x1b[0m: Episode \x1b[36m${entry.episode}\x1b[0m of \x1b[36m${entry_t}\x1b[0m airs in \x1b[36m${tbefair}\x1b[0m.`);
      setTimeout(() => this.makeAnnouncement(entry, date), entry.timeUntilAiring * 1e3);

      this.queuedNotifications.push(entry.id);
    };

    if (res.data.Page.pageInfo.hasNextPage){
      this.handleSchedules(nextDay, res.data.Page.pageInfo.currentPage + 1);
    };
  };

  /**
   * Initialize the scheduler
   * @returns {Interval}
   */
  async init(){
    return this.client.loop(() => this.handleSchedules(Math.round(this.getFromNextDays().getTime()/1e3)),864e5);
  };

  /**
   * Send the announcement to a valid text channel
   * @returns {Promise<void>}
   */
  async makeAnnouncement(entry, date){

    this.queuedNotifications = this.queuedNotifications.filter(e => e !== entry.id);
    const embed = this.getAnnouncementEmbed(entry, date);
    const list = await this.client.database['GuildWatchlist'].find({}).catch(()=> []);

    for (const guild of list.filter(x => x.data.includes(entry.media.id))){
      const channel = this.client.channels.cache.get(guild.channelID);
      const isValCh = channel instanceof TextChannel;
      const reqperm = [ FLAGS.SEND_MESSAGES, FLAGS.EMBED_LINKS ];
      const entry_t = Object.values(entry.media.title).filter(Boolean)[0];
      const dstintn = isValCh ? channel.guild.name : guild.channelID;
      const freason = isValCh ? 'of \x1b[31mmissing\x1b[0m \'SEND_MESSAGES\' and/or \'EMBED_LINKS\' permissions.' : 'such channel \x1b[31mdoes not exist\x1b[0m.';

      if (!isValCh || !channel.permissionsFor(channel.guild.me).has(reqperm)){
        console.log(`\x1b[35m[SHARD_${this.client.shard.ids.join(' ')}] \x1b[31m[MAI_ANISCHEDULE]\x1b[0m: Announcement for ${entry_t} has \x1b[31mfailed\x1b[0m in ${dstintn} because ${freason}`);
        continue;
      };

      await channel.send(embed)
      .then(message => console.log(`\x1b[35m[SHARD_${this.client.shard.ids.join(' ')}] \x1b[32m[MAI_ANISCHEDULE]\x1b[0m: Announcing new episode for \x1b[36m${entry_t}\x1b[0m to \x1b[36m${message.guild.name}\x1b[0m`))
      .catch(error => console.log(`\x1b[35m[SHARD_${this.client.shard.ids.join(' ')}] \x1b[31m[MAI_ANISCHEDULE]x1b[0m: Announcement for \x1b[36m${entry_t} \x1b[31mfailed\x1b[0m: ${error.name}`));
    };

    return;
  };
};
