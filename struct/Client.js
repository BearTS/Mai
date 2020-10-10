const { Client } = require('discord.js')
const CommandManager = require('./CommandManager')
const GuildSettingsManager = require('./GuildSettingsManager')
const PersonalizedCollections = require('./PersonalizedCollections')
const Mongoose = require('./Mongoose')

module.exports = class MaiClient extends Client{
    constructor({ clientSettings, collections, enableDatabase, debug = false, prefix = 'm!', chatbot, commandgroups, token, mongoSettings, mongoPassword, owners, uploadchannel, bootTimeStart }){
        super(clientSettings);
        this.bootTimeStart = bootTimeStart
        this.uploadchannel = uploadchannel
        this.messages = { received: 0, sent: 0}
        this.commands = new CommandManager({ groups: commandgroups })
        this.collections = new PersonalizedCollections(collections)
        this.guildsettings = new GuildSettingsManager(this)
        this.database = enableDatabase ? new Mongoose({settings: mongoSettings, password: mongoPassword}) : null
        this.config = { prefix, token, chatbot, owners, debug, commanddir: commandgroups, pings: {},
            github: 'https://maisans-maid/Mai#readme',
            website: 'https://maisans-maid.github.io/mai.moe'
         }
    }

    connect(){

      if (this.database) this.database.init()
      this.login(this.config.token)
        .then(()=> {
          console.log('Successfully Logged In! Waiting for the Client to become ready...')
          require('../utilities/Load Pings')(this)
          setInterval(()=>require('../utilities/Load Pings')(this), 5 * 60 * 1000)
        }).catch(console.error)
    }
}
