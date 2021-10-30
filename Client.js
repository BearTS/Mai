const { Client } = require('discord.js');
const Manager = require('./database/Manager.js');

class MaiClient extends Client {
  constructor(options = {}){
    super(options);

    if (!this.token && 'DISCORD_TOKEN' in process.env){
      this.token = process.env.DISCORD_TOKEN;
    };

    this.database = new Manager(this, options.database);

    this.once('ready', () => {
      if (typeof process.env.MONGO_URI !== 'string'){
        console.log('[MAI_WARNING]: Database connection not found!');
      };
      console.log('[MAI_LOGS]   : The client is now ready!');
    });
  };
};
