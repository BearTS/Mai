const mongoose = require('mongoose');
const { join } = require('path');
const { readdirSync } = require('fs');

module.exports = class Mongoose{
  constructor(client, options = {}){

    /**
     * The client that instantiated this
     * @name Mongoose#client
     * @type {MaiClient}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client });

    /**
     * The connection URI for this instance
     * @type {string}
     */
    this.connector = process.env.MONGO_URI;

    /**
     * The connection settings for this instance
     * @type {object}
     */
    this.settings = options;

    /**
     * instance of mongoose library
     * @type {object}
     */
    this.db = mongoose;

    for (const func of readdirSync(join(__dirname, '..', 'models'))){
      this[func.split('.js')[0]] = require(join(__dirname, '..', 'models', func));
    };

    /**
     * whether the client is connected to the database
     * @type {string}
     */
    this.connected = false;

    this.db.connection
    .on('connected', () => this.connected = true)
    .on('disconnected', () => this.connected = false);

  };

  /**
   * Initialize this database
   * @returns {MaiClient}
   */
  init(){

    this.db.connect(this.connector, this.settings).catch(e => {
      return console.log(`\x1b[31m[MAI_DATABASE]\x1b[0m: ${e.message}`);
    });

    this.db.set('useFindAndModify', false);
    this.db.Promise = global.Promise;

    this.db.connection.on('connected', () => {
      return console.log(`\x1b[33m[SHARD_${this.client.shard.ids.join(' ')}] \x1b[32m[MAI_DATABASE]\x1b[0m: Connected!`)
    });

    return this.client;
  };
};
