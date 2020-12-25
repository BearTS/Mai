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

    if ('DBL_AUTH' in process.env && process.env.DBL_AUTH){
      this.dbl = new Dbl(client);
    } else {
      // Do nothing..
    };

    if ('TOP_GG_AUTH' in process.env && process.env.TOP_GG_AUTH){
      this.top_gg = new Top(process.env.TOP_GG_AUTH, client);
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
