const { URLSearchParams } = require('url');
const { Api, Webhook }    = require('@top-gg/sdk');
const fetch = require('node-fetch');

class TopGG{
  constructor(client){
    Object.defineProperty(this, 'client', { value: client });

    // This only need to be run once, run only on shard 0
    if (!this.client.shard.ids[0] !== 0){
      return;
    };

    this.api     = new Api(process.env.TOP_GG_AUTH);
    this.webhook = new Webhook('MaiBestWaifu');

    const application  = require('express')();
    const middleware   = this.webhook.middleware;
    const emitToClient = (req, res) => { this.client.emit('userVoted', req, res); res?.status(200)?.send('OK')};

    application.post('/dblwebhook', middleware(), (req, res) => emitToClient(req, res));
    application.listen(process.env.TOP_GG_PORT || 1200);

    require('topgg-autoposter')(process.env.TOP_GG_AUTH, client);
  };
};

class Dbl{
  constructor(client, options = {}){
    Object.defineProperty(this, 'client', { value: client });
    this.webhook = {
      url : typeof options.url === 'string' ? options.url : null
    };
  };
  async post(){
    const params  = new URLSearchParams();
    const baseURI = 'https://discordbotlist.com/api/v1';

    for (const parameter of ['guilds', 'users']){
      params.append(parameter, this.client[parameter].cache.size);
    };
    params.append('shard_id', this.client.shard.ids[0]);

    const options = {
      method : 'post',
      headers: { 'Authorization': process.env.DBL_AUTH },
      path   : { 'id': this.client.user.id },
      body   : params
    };

    const poststats = await fetch(`${baseURI}/bots/${this.client.user.id}/stats`, options);

    if (poststats.status !== 200){
      console.log(`Error on DBL poststats: ${poststats.status}`);
    } else {
      const json = await poststats.json().catch(err => err);
      this.client.emit('TOPGGPostStatistics', json);
    };
    return this;
  };
};

module.exports = class VoteManager{
  constructor(client){
    /**
     * The client that instantiated this Manager
     * @name VoteManager#client
     * @type {MaiClient}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client })

    this.dbl    = null;
    this.top_gg = null;

    if (!['702074452317307061','710432898792292393'].includes(client.user.id)){
      return this;
    };

    if (typeof process.env.DBL_AUTH === 'string'){
      this.dbl = new Dbl(client);
      this.client.loop(() => this.dbl.post(), 18e5);
    };

    if (typeof process.env.TOP_GG_AUTH === 'string'){
      this.top_gg = new TopGG(client);
    };
  };
};
