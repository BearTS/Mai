const { APIMessage } = require('discord.js');

module.exports = class Interaction{
  constructor(client){

    Object.defineProperty(this, 'client', { value: client });

    this.client.ws.on('INTERACTION_CREATE', interaction => this._process(interaction));

    this.InteractionResponse = class InteractionResponse {
      constructor(channel, member, guild, user, interaction){
        this.channel = channel;
        this.guild = guild;
        this.member = member
        this.user = user;
        this.interaction = interaction
      };

      async send(content, { ephemeral }){
        let data = { content };

        if (typeof content === 'object'){
          const channel = this.user.client.channels.resolve(this.interaction.channel_id);
          const { data: messageData, files } = await APIMessage.create(channel, content).resolveData().resolveFiles();
          data = { ...messageData, files };
        };

        if (ephemeral === true && data.content){
          data.flags = 1 << 6;
        };

        return this.user.client.api.interactions(this.interaction.id, this.interaction.token).callback.post({ data: { type: 4, data }});
      };
    };

 };

 _getChannel(interaction){
   return this.client.channels.cache.get(interaction.channel_id);
 }

 _getCommand(interaction){
   return this.client.commands.slash.get(interaction.data.name);
 };

 _getGuild(interaction){
   return this.client.guilds.cache.get(interaction.guild_id);
 };

 _getMember(interaction){
   return this.client.guilds.cache.get(interaction.guild_id)?.members.fetch(interaction.member.user.id);
 }

 _getUser(interaction){
   return this.client.users.fetch(interaction.member.user.id);
 };

 async _process(interaction){
   const command = this._getCommand(interaction);
   const user = await this._getUser(interaction);
   const guild = this._getGuild(interaction);
   const channel = this._getChannel(interaction);
   const member = await this._getMember(interaction);

   const response = new this.InteractionResponse(channel, member, guild, user, interaction);
   return command.response(response, interaction);
 };
};
