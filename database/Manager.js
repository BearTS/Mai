'use strict';

const mongoose = require('mongoose');
const GuildProfileHandler = require('./GuildProfileHandler');

/*
 There are currently no method to control the caching mechanism of this manager
 */
class DatabaseManager {
    constructor(client, options){

        Object.defineProperty(this, 'client', { value: client })

        /**
         * The provider for the database service
         * @type {mongoose}
         */
        this.provider = mongoose;

        /**
         * The Handler for the guildProfile
         * @type {GuildProfileHandler}
         */
        this.guildProfiles = new GuildProfileHandler(client);

        /**
         * The Handler for the userProfile
         * @type {userProfileHandler}
         */
        this.userProfiles = new userProfileHandler(client);

        /**
         * Whether the database is available for querying or not
         * @type {Boolean}
         */
        this.available = false;

        /**
         * Set of options required for connecting to the mongo Database
         * All options can be found at {@link https://mongoosejs.com/docs/connections.html#options}
         * @type {Object}
         */
        this.options = {
            ...options,
            useUnifiedTopology: typeof options.useUnifiedTopology === 'boolean' ? options.useUnifiedTopology : true,
            useNewUrlParser: typeof options.useNewUrlParser === 'boolean' ? options.useNewUrlParser : true,
            autoIndex: typeof options.autoIndex === 'boolean' ? options.autoIndex : true,
            connectTimeoutMS: typeof options.connectTimeoutMS === 'number' ? options.connectTimeoutMS : true,
            family: typeof options.family === 'number' ? options.family : 4
        };

        /**
         * [Promise description]
         * @type {[type]}
         */
        this.provider.Promise = global.Promise;

        /**
         * Read important event to modify database availability
         * @type {EventEmitter}
         */
        this.provider.connection

            /**
             * Sets the availability to true when mongoose sucessfully connects or whenever it reconnects
             * @type {boolean}
             */
            .on('connected', () => this.available = true)

            /**
             * Sets the availability to false whenever mongoose disconnects
             * @type {boolean}
             */
            .on('disconnected', () => this.available = false)

            /**
             * Emits the error warning received from mongoose to client, if enabled
             * @type {boolean}
             */
            .on('error', (e) => this.options.emitError === true ? this.client.emit('error', e));


      /**
       * Checks if the user has provided a mongo URL
       * @param  {[type]} typeof [description]
       * @return {[type]}        [description]
       */
        if (typeof process.env.MONGO_URI !== 'string'){
            return;
        };

        this.init();
    };

    init(){
        return this.provider.connect(process.env.MONGO_URI, this.options);
    };
};

module.exports = DatabaseManager;
