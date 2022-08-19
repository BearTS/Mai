'use strict';

const { deployCommandsOnStartup } = require('../config.json');
const { Client } = require('discord.js');
const { success, error, info } = require('../utils/console.js');
const Commands = require('./Commands.js');

module.exports = class MaiClient extends Client {
    constructor(options = {}){
        try {
            super(options);
        } catch (e) {
            console.error(error, e.code, e.message);
            process.exit(1)
        };

        if (!this.token && 'DISCORD_TOKEN' in process.env){
            this.token = process.env.DISCORD_TOKEN
        };

        this.database = null;
        this.commands = new Commands(this);

        this.once('ready', () => {
            console.log(success, `Connected to Discord as ${this.user.tag}`);
            if (deployCommandsOnStartup){
                console.info(info, `deployCommandOnStartup is enabled. Deploying commands...`)
                this.commands.deploy()
                    .then(res => console.log(success, 'Deployed', res.size, 'commands!'))
                    .catch(err => console.error(error, 'commandDeploymentError', err.message))
                    .finally(() => console.info(info, 'Deploying commands has been limited by discord. Make sure to disable deploying commands on every startup to avoid getting ratelimited.'))
            };
        });
    };

    /*
    Logs in to discord while attempting to connect to database.
    Race condition is negligible in this case
     */
    login(param){
        if (param) {
            console.warn(warn, 'TokenConfig', 'Parameters for client.login() will be ignored. Please set up your token on an environment variable.')
        };

        if (!this.token){
            console.error(error, 'MissingToken', 'Client token was not provided.');
            process.exit(1);
        };

        this.database = require('mongoose');
        if ('MONGO_URI' in process.env){
            this.database.connect(process.env.MONGO_URI, {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                autoIndex: false,
                connectTimeoutMS: 10_000,
                family: 4
            }).catch(err => (
                console.error(error, err.name, err.message)
            ));
            this.database.Promise = global.Promise;
            this.database.connection.once('connected', () => (
                console.log(success, 'Successfully connected to MongoDB via mongoose.')
            ))
        } else {
            console.warn(warn, 'NoDatabase', 'MONGO_URI was not provided. This may hinder functionality on some commands.')
        };

        return super.login(this.token)
    };
};
