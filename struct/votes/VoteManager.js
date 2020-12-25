const { URLSearchParams } = require('url');
const Top = require('dblapi.js');
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
      this.top_gg = new Top(process.env.TOP_GG_AUTH, client);

      const webhookPort = process.env.PORT;
      const webhookAuth = process.env.TOP_GG_AUTH;

      this.top_gg_wh = new Top(process.env.TOP_GG_AUTH, { webhookPort, webhookAuth });

      this.top_gg_wh.on('ready', hook => {
         console.log(`Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`);
      });

      this.top_gg_wh.on('vote', vote => {
        console.log(vote)
      });
    } else {
      // Do nothing..
    };
  };

  init(loop = {}){
    if (this.dbl){
      this.dbl.post();
    } else {
      // Do nothing..
    };

    if (this.dbl && loop.dbl){
      this.dbl.loopPost(loop.dbl);
    } else {
      return;
    };

    return;
  };
};
