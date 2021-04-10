const { Structures, Collection } = require('discord.js');

module.exports = Structures.extend('User', User => {
  class MaiUser extends User {
    constructor(client, data){
      super(client, data);

      this.profile = null;

      this.cooldown = new Collection();
    };

    loadProfile(){
      return new Promise(async (resolve, reject) => {
        if (this.client.database === null || !this.client.database.connected){
          reject('Couldn\'t connect to Database');
        };

        const model = this.client.database['Profile'];
        const res = await model.findById(this.id);

        if (!res) res = await new model({ _id: this.id }).save();

        this.profile = res;
        resolve(this.profile);
      })
    };

    setLanguage(code){
      return this.profile.data.language = code;
    };
  };

  return MaiUser;
});
