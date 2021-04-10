const { Structures } = require('discord.js');

module.exports = Structures.extend('GuildMember', Member => {
  class GuildMember extends Member {
    constructor(client, data, guild){
      super(client, data, guild);

      this.xp = null;
    };

    addxp(amount){
      return new Promise(async (resolve,reject) => {
        if (!this.client.database?.connected){
          return reject('Couldn\'t connect to Database.');
        };

        if (this.guild.xpcooldowns.get(this.id) + 6e4 > Date.now()){
          return reject('Member has recently talked.');
        };

        if (this.guild.profile === null){
          await this.guild.loadProfile().catch(() => reject(`Couldn't load guild profile`));
        };

        if (!this.guild.profile.xp.isActive){
          return reject('Guild has disabled xp gains.');
        };

        const model = this.client.database['Profile'];
        const max = 25, min = 10, points = Math.round(amount) || Math.floor(Math.random() * (max - min)) + min;
        const res = await model.findById(this._id) || await new model({ _id: this._id }).save();

        if (!(res instanceof model)){
          return reject('DB returned an invalid data.');
        };

        let serverdata, index = res.data.xp.findIndex(x => x.id === this.guild.id);

        if (index === -1){
          res.data.xp.push({ id: this.guild.id, xp: 0});
          index = res.data.xp.findIndex(x => x.id === this.guild.id);
        };

        [ serverdata ] = res.data.xp.splice(index, 1);

        serverdata.xp += points;
        this.xp = serverdata.xp;

        res.data.xp.spice(index, 0, serverdata);

        await res.save()
        .then(() => {
          this.guild.xpcooldown.set(this.id, Date.now())
          return resolve('SUCCESS');
        })
        .catch(() => {
          return reject('REJECTED');
        });
      });
    };

    getxp(){
      if (this.xp !== null){
        return Promise.resolve(this.xp);
      } else {
        return new Promise(async (resolve, reject) => {

          if (!this.client.database?.connected){
            return reject('Couldn\'t connect to Database.');
          };

          const model = this.client.database['Profile'];
          const res = await model.findById(this._id) || await new model({ _id: this._id }).save();
          const xp = res.find(x => x.id === this.guild.id) || 0;

          return resolve(xp);
        });
      };
    };

    _setxp(value){
      return this.xp = value;
    };

  };

  return GuildMember;
});
