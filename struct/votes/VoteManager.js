const { URLSearchParams } = require('url');
const { MessageEmbed } = require('discord.js');
const Top = require('@top-gg/sdk');
const Dbl = require(`${process.cwd()}/struct/votes/DBL`);
const profile = require(`${process.cwd()}/models/Profile`);

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

      app.post('/dblwebhook', this.top_gg.webhook.middleware(), (req, res) => {

        this.client.emit('userVoted', req, res);

        return client.channels.cache.get(client.config.channels.votes)?.send(
          new MessageEmbed()
          .setTimestamp()
          .setColor('#50fa00')
          .setFooter(`Mai Bot`)
          .setDescription(`User Just \`${req.vote.user}\` Voted For Me`)
          .setTitle("Thank You For Voting")
          .addFields([{
              name: 'Go Vote For Mai',
              value: `**You get 800 Credits on Vote which you can use on [Market](https://market.mai-san.ml/)\nEvery Vote Counts! Your votes help us grow at faster rates\nDont forget to vote every 12 Hours`
            },
            {
              name: 'How Do I Vote?',
              value: `[Top.gg](${client.config.websites['top.gg']})\n[DBL](${client.config.websites['DBL']})`
            }
          ])
        );
        // Credits on Vote
        return profile.findById(req.vote.user, (err, doc) => {
          if (err) {
            return client.channels.cache.get(client.config.channels.creditlogs)?.send(`\`❌ [Vote Credits][DATABASE_ERR]:\` The database responded with error: ${err.name}`);
          } else if (!doc || doc.data.economy.wallet === null) {
            console.log(`\`❌ [Vote Credits] **${req.vote.user}**, **User had no wallet.**`);
          };
          const tba = doc.data.economy.wallet + 800
          doc.data.economy.wallet = tba > 50000 ? 50000 : Math.floor(tba);
          return doc.save()
           .then(() =>
           client.users.cache.get(req.vote.user).send(
                   new MessageEmbed()
                   .setColor('#50fa00')
                   .setFooter(`Mai`)
                  .setTitle("Thank You For Voting Me")
                  .setDescription(`I have added **800 Credits to your wallet** for voting \n\nDont Forget To vote after 12 Hours \n\n[Top.gg](${client.config.websites['top.gg']})\n[DBL](${client.config.websites['DBL']})`)
          ))
          .then(() =>client.channels.cache.get(client.config.channels.creditlogs)?.send(`\\✔️ [Vote Credits] Successfully added 800 credits to **${req.vote.user}**!`))
            .catch((err) => client.channels.cache.get(client.config.channels.creditlogs)?.send(`\`❌ [Vote Credits][DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
        })
        //
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
