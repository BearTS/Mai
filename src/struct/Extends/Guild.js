const { Structures, Collection } = require('discord.js');

module.exports = Structures.extend('Guild', Guild => {
  class MaiGuild extends Guild {
    constructor(client, data){
      super(client, data);

      this.profile = null;

      this.xpcooldowns = new Collection();
    };

    async loadProfile(){
      if (this.client.database === null || !this.client.database.connected){
        return Promise.reject('Couldn\'t connect to Database');
      };

      const profile = this.client.database['GuildProfile'];
      const document = await profile.findById(this.id);

      if (!(document instanceof profile)){
        document = await new profile({ _id: this.id }).save().catch(() => {});
        if (!document) return Promise.reject('Error while saving the guild profile document for ' + this.id);
      };

      this.profile = document;
      return Promise.resolve(this.profile);
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
