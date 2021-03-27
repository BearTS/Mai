const { URLSearchParams } = require('url');
const Top = require('@top-gg/sdk');
const Dbl = require(`${process.cwd()}/struct/votes/DBL`);

module.exports = class VoteManager{
  constructor(client){
    /**
     * The client that instantiated this Manager
     * @name VoteManager#client
     * @type {MaiClient}
     * @readonly
     */
    Object.defineProperty(this, 'client', { value: client })

    this.dbl = null;
    this.top_gg = null;

    if (typeof process.env.DBL_AUTH === 'string'){
      this.dbl = new Dbl(client);
    } else {
      // Do nothing..
    };

    if (typeof process.env.TOP_GG_AUTH === 'string'){

      const app = require('express')();

      this.top_gg = {
        api: new Top.Api(process.env.TOP_GG_AUTH),
        webhook: new Top.Webhook('MaiBestWaifu')
      };

      app.post('/dblwebhook', this.top_gg.webhook.middleware(), (req ,res) => {
        this.client.emit('userVoted', req, res);
        
        res?.status(200)?.send('OK');
      });

      app.listen(1200);
    } else {
      // Do nothing..
    };
  };

  _post(){
    const serverCount = this.client.guilds.cache.size;
    this.dbl?.post();
    this.top_gg?.api.postStats({ serverCount });
  };

  init(loop){
    if (loop){
      this._post(); setInterval(() =>  this._post() , 1800000);
    } else {
      this._post();
    };
    return;
  };
};
