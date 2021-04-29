'use strict';

const { Client, version } = require('discord.js');
const { readdirSync }     = require('fs');
const { join }            = require('path');

const Anischedule = require('./Anischedule');
const Commands    = require('./Commands');
const Images      = require('./Images');
const Interaction = require('./Interaction');
const Mongoose    = require('./Mongoose');
const Music       = require('./Music');
const Services    = require('./Services');
const VoteManager = require('./VoteManager');

module.exports = class MaiClient extends Client{
  constructor(settings){
    super(settings);

    if (typeof settings.prefix !== 'string'){
      settings.prefix = 'm!';
    };
    if (!this.token && 'TOKEN' in process.env){
      this.token = process.env.TOKEN;
    };

    this.once('ready', () => this.votes = new VoteManager(this));

    this.anischedule = new Anischedule(this);
    this.commands    = new Commands(this);
    this.images      = new Images();
    this.interaction = new Interaction(this);
    this.music       = new Music(this);
    this.services    = new Services(this);

    if ('MONGO_URI' in process.env){
      this.database = new Mongoose(this, settings.database);
      this.database.init();
      this.database.db.connection.once('connected', () => {
        if (!this.readyAt){
          this.once('ready', () => {
            this.anischedule.init();
            this.loadProfiles()
          });
        } else {
          this.anischedule.init();
          this.loadProfiles();
        };
      });
    } else {
      this.database = null;
    };

    this.owners      = Array.isArray(settings.owners) ? settings.owners : [];
    this.prefix      = settings.prefix;
    this.uploadch    = settings.uploadch;

  };

  async loadProfiles(){
    const res = await this.database['GuildProfile'].find({ _id: { '$in': [...this.guilds.cache.keys()]}});
    this.guilds.cache.each(guild => guild._inherit(res));
  };

  /**
   * Load event files to this client instance
   * @returns {undefined}
   */
  loadEvents(){
    const eventpath = join(__dirname, '..', 'events');
    const eventdir = readdirSync(eventpath);
    for (const dir of eventdir.filter(x => !x.startsWith('_'))){
      const file = require(join(eventpath, dir));
      this.on(dir.split('.')[0], file.bind(null, this));
    };
    console.log(`\x1b[35m[SHARD_${this.shard.ids.join(' ')}] \x1b[32m[MAI_EVENTS]\x1b[0m: Loaded \x1b[32m${eventdir.length}\x1b[0m event files!`)
  };

  /**
  * Executes a function once and then loops it
  * @param {function} function The function to execute
  * @param {number} delay The delay between each execution
  * @param {params} parameter Additional parameters for the Interval function
  * @returns {Timeout} timeout returns a Timeout object
  */
  loop(fn, delay, ...param){
    fn();
    return setInterval(fn, delay, ...param);
  };

  get version(){
    return {
      library: version,
      client: require(join(__dirname, '../..', 'package.json')).version
    };
  };
};
