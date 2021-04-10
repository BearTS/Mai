module.exports = class UserProfiles{
  constructor(client, obj){

    Object.defineProperty(this, 'client', { value: client });

    this.load(obj);
  };

  load(obj){
    const model = this.client.database['Profile'];

    if (!(obj instanceof model)){
      return false;
    };

    const { data } = obj;
    this.id = data._id;
    this.xp = data.global_xp;
    this.level = data.global_level;
    this.bio = data.profile.bio;
    this.background = data.profile.background;
    this.pattern = data.profile.pattern;
    this.emblem = data.profile.emblem;
    this.hat = data.profile.hat;
    this.wreath = data.profile.wreath;
    this.color = data.profile.color;
    this.birthday = data.profile.birthday;
    this.inventory = data.profile.inventory;
    this.credits = data.economy.credits;
    this.tips = {
      given: data.tips.given,
      received: data.tips.received,
      timestamp: data.tips.timestamp
    };
    this.votenotification = data.vote.notification;

    return true;
  }

  update(){
    return new Promise(async (resolve, reject) => {
      if (!this.client.database?.connected){
        reject('Couldn\'t connect to Database.');
      };

      const model = this.client.database['Profile'];
      const res = await model.findById(this.id);

      if (!res) res = await model.findById(this.id).save();

      const success = this.load(res);

      if (!success) reject('Could not load data to user.');

      for (const { id, xp } of res.data.xp){
        await this.client.shards.broadcastEval(
          `const guild = this.guilds.cache.get(${id});
          const member = guild.members.cache.get(${this.id});

          if (guild && member){
            this.guilds.cache.get(${id}).members.cache.get(${this.id}).xp = ${xp}
          }`
        );
      };

      resolve(this);
    });
  };
};
