'use strict';

const GuildProfile = require('./GuildProfile');
const model = require('./models/GuildProfile');
const { Collection, Guild, GuildChannel, Role, GuildEmoji, GuildMember } = require('discord.js');

class GuildProfileHandler extends BaseHandler {
    constructor(client, data){
        super(client, GuildProfile, model);

        this.client
        /**
         * Automatically fetch or create the GuildProfile for the newly joined guild
         */
        .on('guildCreate', guild => this.fetch(guild, { cache: true, upsert: true, force: true }))
        /**
         * Automatically remove the guildProfile from cache for leaving guilds
         * @type {[type]}
         */
        .on('guildDelete', guild => this._cache.delete(guild.id));
    };

    /**
     * Fetches a GuildProfile or multiple GuildProfiles from the database
     * @param  {Array|Collection} ids=[]      An Array or Collection of GuildResolvables to use in fetching. Leave empty to fetch all. Empty array will bypass all options.
     * @param  {boolean}  options.upsert      Creates a document the specified id/ids do not exist on the database. Enable with checkGuilds to upsert only valid guild ids.
     * @param  {boolean}  options.cache       Whether to cache the fetched data. Enable with checkGuilds to cache only valid guild ids. Enabled by default.
     * @param  {boolean}  options.checkGuilds Whether to fetch only GuildProfile data that has guilds that exisits on GuildManager. Enabled by default
     * @param  {boolean}  options.force       Whether to skip checking the cache. Enable if you want up-to-date data. Disabled by default
     * @return {Promise<Collection<GuildProfile>|GuildProfile>} GuildProfile
     */
    async fetch(ids = [], options){
      if ((typeof ids === 'string') || (this.client.guilds.resolve(id) instanceof Guild))
          ids = [ ids ];
      if (ids instanceof Collection)
          ids = ids.toJSON();
      if (!Array.isArray(ids))
          throw new Error('GuildProfileHandler#fetch parameter must be a (type, collection, or an array of) GuildResolvables. Received ' + typeof ids);

      const cachedCollection = new Collection();

      /**
       * filters the id passed on this function to check if the id exist on guild cache
       * @name {options.checkGuilds}
       * @type {boolean}
       */
      if (ids.length && !(options.checkGuilds === false)){
          ids = ids.map(id => this.client.guilds.resolveId(id)).filter(Boolean);
          if (!ids.length)
              return cachedCollection;
      } else {
          ids = ids.map(el =>
              el instanceof GuildChannel ||
              el instanceof GuildMember ||
              el instanceof GuildEmoji ||
              el instanceof Role ||
              (el instanceof Invite && el.guild)
                  ? el.guild.id
                  : el
          );
      };

      /**
       * Skip cache checking if enabled
       * @name {options.force}
       * @type {boolean}
       */
      if (ids.length && options.force !== true){
          ids.forEach(id => this.client.guilds.has(id)
              ? cachedCollection.set(this.client.guilds.get(id))
              : undefined
          );
          ids = ids.filter(id => !cachedCollection.has(id));
          if (!ids.length) return cachedCollection;
      };

      const data = await this.super._fetch(ids);

      /**
       * Whether to upsert new document to the database for missing documents from the query
       * @param  {[type]} ids [description]
       * @return {[type]}     [description]
       */
      if (ids.length && ids.filter(id => !!data.map(x => x._id).includes(id).length && options.upsert === true){
          try {
              await this._patch(
                  ids.filter(id => !data.map(x => x._id).includes(id)),
                  new model().toJSON(),
                  { upsert: true }
              );
              data.concat(
                  await this.super._fetch(
                      ids.filter(id => !!data.map(x => x._id).includes(id))
                  )
              );
          } catch (e) {
              throw new Error(e.message);
              );
          }
      };

      /**
       * Whether to update the cache with the result
       * @name {cache}
       */
      if (ids.length && options.cache !== false)
          this.super._store(data);


        return data.concat(cachedCollection);
    };

    /**
     * Patches GuildProfile or multiple GuildProfiles from the database
     * @param  {Array|Collection} ids=[] An Array or Collection of GuildResolvables to patch
     * @param  {object}  update          The properties to update
     * @param  {object}  options         {@link FetchOptions}
     * @return {Promise<Collection<GuildProfile>|GuildProfile>} The updated guildProfile
     * @example
     *    Disable 2 servers's xp feature:
     * // client.database.guildProfiles.patch(
     * //   ['1234567890', '0987654321'],
     * //   { xp : { isActive: false }},
     * //   { force: true }
     * // ).then(x => console.log(x));
     */
    async patch(ids, update, options){
      if (typeof ids === 'string')
          ids = [ ids ];
      if (ids instanceof Collection)
          ids = ids.toJSON();
      if (this.client.guilds.resolve(id) instanceof Guild)
          ids = [ this.client.guilds.resolveId(ids) ];
      if (Array.isArray(ids))
          throw new Error(
            'Fetch parameter must be of type string or Array. Received ' + typeof ids,
            'DatabasePatchError'
          );

      ids = ids.map(x => this.client.guilds.resolveId(x));
      try {
          await this._patch(ids, update);
      } catch (e){
          throw new Error(e, 'DatabasePatchError');
      };
        return this.fetch(ids, { force: true, ...options });
    };
};

module.exports = GuildProfileHandler;
