const { Structures } = require('discord.js');

module.exports = Structures.extend('GuildMember', Member => {
  class GuildMember extends Member {
    constructor(client, data, guild){
      super(client, data, guild);
    };

    // Add xp to this member
    addxp(amount, message){
      return new Promise(async (resolve,reject) => {
        if (!this.client.database?.connected){
          return reject('Couldn\'t connect to Database.');
        };

        const model = this.client.database['Profile'];
        const max = 25, min = 10, points = Math.round(amount) || Math.floor(Math.random() * (max - min)) + min;
        const res = await model.findById(this.id) || await new model({ _id: this.id }).save();

        if (!(res instanceof model)){
          return reject('DB returned an invalid data.');
        };

        let serverdata, guildrankup = 0, globalrankup = 0,
        index = res.data.xp.findIndex(x => x.id === this.guild.id);

        if (index === -1){
          res.data.xp.push({ id: this.guild.id, xp: 0, level: 1});
          index = res.data.xp.findIndex(x => x.id === this.guild.id);
        };

        [ serverdata ] = res.data.xp.splice(index, 1);

        serverdata.xp += points;
        serverdata.level = serverdata.level || 1;

        // define points
        let _xp = {
          global: {
            get cap(){ return (50 * Math.pow(res.data.global_level,2)) + (250 * res.data.global_level); },
            get next(){ return this.cap -  res.data.global_xp; },
          },
          local: {
            get cap(){ return (50 * Math.pow(serverdata.level, 2)) + (250 * serverdata.level); },
            get next(){ return this.cap - serverdata?.xp }
          }
        };

        // PROCESS GLOBAL XP
        // Add 3xp xp add on global based xp
        // Increment level if next is less than the current xp
        res.data.global_xp += 3;
        while (_xp.global.next < 1){
          res.data.global_level++
          globalrankup++
        };

        // PROCESS LOCAL XP
        // Add points which was previously randomized on server[local] based xp
        // increment level if next is less than the current xp.
        serverdata.xp += points;
        while (_xp.local.next < 1){
          serverdata.level++
          guildrankup++
        };

        res.data.xp.splice(index, 0, serverdata);

        return await res.save()
        .then(() => {
          this.user.profile = res;
          this.guild.xpcooldowns.set(this.id, Date.now());
          if (guildrankup > 0){
            this.client.emit('guildMemberLevelUpdate', 'guild', this, message);
          };
          if (globalrankup > 0){
            this.client.emit('guildMemberLevelUpdate', 'global', this, message)
          };
          return resolve('SUCCESS');
        })
        .catch(err => {
          return reject('DB rejected your save request: ' + err.message);
        });
      });
    };

    // Get the XP cap for the given level
    getXPCapByLevel(upperlimit){

      let level = 0, cap = 0;
      const lcf = (level) => Math.pow(level, 2);
      const scf = (level) => 250 * level;
      const base = 50;

      while (level < upperlimit){
        level++;
        cap = (base * lcf(level)) + scf(level);
      };

      return cap;
    };

    // READ ONLY PARAMETERS //
    // Get the current level
    get level(){
      return this.xpData?.level || null;
    };

    // Get the xp cap for the current level
    get levelcap(){
      return this.getXPCapByLevel(this.level);
    };

    // Get the xp requirement for level promotion
    get levelnext(){
      return this.levelcap - this.xp || null;
    };

    get warnings(){
      return this.user.profile?.data.infractions.warn.filter(x => x.guild === this.guild.id) || null;
    };

    // Get the current xp
    get xp(){
      return this.xpData?.xp || null;
    };

    // Get the xpData
    get xpData(){
      return this.user.profile?.data.xp.find(x => x.id === this.guild.id) || null;
    };

    // Check if member has xpData entry on the current guild
    get isEarningXP(){
      return Boolean(this.user.profile?.data.xp.find(x => x.id === this.guild.id));
    };
  };

  return GuildMember;
});
