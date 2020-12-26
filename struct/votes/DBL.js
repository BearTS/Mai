// const EventEmitter = require('events');
const { URLSearchParams } = require('url');
const fetch = require('node-fetch');

module.exports = class DiscordBotList{
  constructor(client, config = {}){

    /**
     * The client that instantiated this Manager
     * @name DiscordBotList#client
     * @type {MaiClient}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client })

    this.webhook = {};

    if (typeof config.webhookURL === 'string'){
      this.webhook.url = config.webhookURL;
    } else {
      this.webhook.url = null;
    };
  };

  post(){
    const params = new URLSearchParams();
    params.append('guilds', this.client.guilds.cache.size);
    params.append('users', this.client.guilds.cache.reduce((a,b) => a + b.memberCount, 0));

    fetch(`https://top.gg/api/bots/${this.client.user.id}/stats`, {
      method: 'post',
      path: { 'id': this.client.user.id },
      body: params,
      headers: { 'Authorization': process.env.DBL_AUTH }
    }).then(res => res.json().catch(err => err))
    .then(json => this.client.emit('TOPGGPostStatistics', json));

    return this;
  };

  loopPost(delay){
    return setInterval(() => this.post(), Number(delay) || 3000000 );
  };
};
