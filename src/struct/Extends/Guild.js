const { Structures, Collection } = require('discord.js');

module.exports = Structures.extend('Guild', Guild => {
  class MaiGuild extends Guild {
    constructor(client, data){
      super(client, data);

      this.profile = null;

      this.xpcooldowns = new Collection();
    };

    loadProfile(){
      return new Promise(async (resolve, reject) => {
        if (this.client.database === null || !this.client.database.connected){
          reject('Couldn\'t connect to Database');
        };

        const model = this.client.database['GuildProfile'];
        const res = await model.findById(this.id);

        if (!res) res = await new model({ _id: this.id }).save();

        this.profile = res;
        resolve(this.profile);
      });
    };

    loadSlashCommands(fn){
      const data = (fn
      ? this.client.commands.slash.fliter(fn).array()
      : this.client.commands.slash.array()).map(file => {
        return file.data;
      });

      return this.client.api
      .applications(this.client.user.id)
      .guilds(this.id).commands.put({ data });
    };

    _inherit(arr){
      const res = arr.find(x => x._id === this.id);
      this.profile = res ? res : null;
      return this.profile ? true : false;
    };
  };

  return MaiGuild;
});
