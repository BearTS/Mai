'use strict';

const { Collection } = require('discord.js');

class BaseHandler {
    constructor(client, holds, model){
      Object.defineProperty(this, 'client', { value: client });

      Object.defineProperty(this, '_cache', { value: new Collection() });

      Object.defineProperty(this, '_holds', { value: holds });

      Object.defineProperty(this, '_model', { value: model });
    };

    /** [READ]
     * Fetches multiple document from the database (or all if no ids were provided)
     * Always check if the database is available for fetching before using this function
     * @param  {[Snowflake]} ids        An array of Data ids to fetch
     * @return {Promise<Collection<*>>}   Collection of the fetched data
     * @private
     */
    fetch(ids = []){
        const options = ids.length ? { _id: { '$in': ids }} : {};
        const data = await this._model.find(options);
        return data.reduce((coll, document) => coll.set(document._id, new this._holds(this.client, this, document)), new Collection());
    };

    /** [UPDATE]
     * Patches multiple documents with common update entry.
     * @param  {[Snowflake]} ids    Array of Discord Snowflakes that holds the identifier the patch is applied to.
     * @param  {Object} [update={}] The update entry
     * @param  {Object} options     UpdateMany Options. See https://mongoosejs.com/docs/api.html#model_Model.updateMany
     * @return {Object} UpdateMany return object
     * @private
     */
    patch(ids = [], update = {}, options){
        const data = await this._model.updateMany({ _id: { '$in': ids }}, update, options);
        return data;
    };

    /**
     * Stores an iterable to the cache
     * @param  {[*]} iterable
     * @return {void}
     * @private
     */
    _store(iterable){
        for (const item of iterable){
            this._cache.set(item._id, new this._holds(item));
        };
    };

    /**
     * Clears out the cache for this handler
     * @return {void}
     */
    clearCache(){
        this._cache = new Collection();
    };

    /**
     * The cache for this handler
     * @return {Collection}
     */
    get cache(){
        return this._cache;
    };
};

module.exports = BaseHandler;
