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
     * @param  {[String]} ids An array of Data ids to fetch
     * @return {Promise<Collection<>}   Collection of the fetched data]
     * @private
     */
    _fetch(ids = []){
        const options = ids.length ? { _id: { '$in': ids }} : {};
        const data = await this._model.find(options);
        return data.reduce((coll, document) => coll.set(document._id, new this._holds(this.client, this, document)), new Collection());
    };

    /** [UPDATE]
     * Patches multiple documents with common update entry.
     * @param  {Array}    [ids=[]]    [description]
     * @param  {Object}   [update={}] [description]
     * @return {[object]}             [description]
     * @private
     */
    _patch(ids = [], update = {}){
        const data = await this._model.updateMany({ _id: { '$in': ids }}, update);
        return data;
    };

    /**
     * Stores an interable to the cache
     * @param  {[type]} iterable [description]
     * @return {[type]}          [description]
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

    get cache(){
        return this._cache;
    };
};

module.exports = BaseHandler;
