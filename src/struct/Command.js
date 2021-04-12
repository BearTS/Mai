const { Permissions, Message, MessageEmbed } = require('discord.js');
const PRMFLGS = Object.keys(Permissions.FLAGS);


module.exports = class Command{
  constructor(client, command, path){

    /**
		 * Client that this command is for
		 * @name Command#client
		 * @type {MaiClient}
		 * @readonly
		 */
		Object.defineProperty(this, 'client', { value: client });

    /**
		 * File Path for this command
		 * @type {Path}
		 * @readonly
		 */
    this.path = path; // must be path of the command file

    /**
     * Name of this command
     * @type {string}
     */
    this.name = command.name;

    /**
		 * Aliases for this command
		 * @type {string[]}
		 */
		this.aliases = command.aliases || [];
    if (!Array.isArray(this.aliases)){
      this.aliases = [];
    };

    /**
     * Cooldown for this command, if any exists
     * @type {Cooldown}
     */
    this.cooldown = command.cooldown || {};
    if (typeof this.cooldown !== 'object' || Array.isArray(this.cooldown)){
      this.cooldown = {};
    };
    if (typeof this.cooldown.time !== 'number'){
      this.cooldown = {};
    };
    if (this.cooldown.time < 1000){
      this.cooldown = {};
    };
    if (typeof this.cooldown.message !== 'string'){
      this.cooldown.message = 'You cannot use this command yet.';
    }

    /**
     * Required Permissions by the bot instance to function properly
     * @type {Permissions[]}
     */
    if (Array.isArray(command.clientPermissions)){
      this.clientPermissions = command.clientPermissions.filter(x => PRMFLGS.includes(x));
    } else {
      this.clientPermissions = [];
    };

    /**
     * Required Permissions for the command author
     * @type {Permissions[]}
     */
    if (Array.isArray(command.permissions)){
      this.permissions = command.permissions.filter(x => PRMFLGS.includes(x));
    } else {
      this.permissions = [];
    };

    /**
     * Group for this command
     * @type {CommandGroup}
     */
    if (typeof command.group !== 'string'){
      this.group = 'unspecified';
    } else {
      this.group = command.group;
    };

    /**
     * The description for this command
     * @type {string}
     */
    if (typeof command.description !== 'string'){
     this.description = 'No description.';
    } else {
     this.description = command.description;
    };

    /**
     * The required parameters for this command
     * @type {string}
     */
    if (!Array.isArray(command.parameters)){
      this.parameters = [];
    } else {
      this.parameters = command.parameters
    };

    /**
     * Examples of usage for this command
     * @type {usageExamples[]}
     */
    if (!Array.isArray(command.examples)){
     this.examples = [ this.name, ...this.aliases ];
    } else {
     this.examples = command.examples;
    };

    /**
     * Whether the command can only be used on guilds and not on DMs
     * @type {Boolean}
     * @default {true}
     */
    if (typeof command.guildOnly !== 'boolean'){
      command.guildOnly = true;
    };
    this.guildOnly = command.guildOnly;

    /**
     * Whether the command can only be used by the bot owner
     * @type {Boolean}
     * @default {false}
     */
    this.ownerOnly = typeof command.ownerOnly === 'boolean' && Boolean(command.ownerOnly);

    /**
     * Whether the command can only be used by members with `ADMINISTRATOR` permissions
     * @type {Boolean}
     * @default {false}
     */
    this.adminOnly = typeof command.adminOnly === 'boolean' && Boolean(command.adminOnly);

    /**
     * Whether the command can only be used on nsfw channels
     * @type {Boolean}
     * @default {false}
     */
    this.nsfw = typeof command.nsfw === 'boolean' && Boolean(command.nsfw);

    /**
     * Whether the command requires a database connection to execute
     * @type {Boolean}
     * @default {true}
     */
    if (typeof command.requiresDatabase !== 'boolean'){
      command.requiresDatabase = true;
    };
    this.requiresDatabase = command.requiresDatabase;

    /**
     * Whether the command requires the `EXPERIENCE_POINTS` feature
     * @type {Boolean}
     * @default {trues}
     */
    if (typeof command.rankcommand !== 'boolean'){
      command.rankcommand = true;
    };
    this.rankcommand = command.rankcommand;

    if (typeof command.run !== 'function'){
      this.run = this._run
    } else {
      this.run = command.run
    };

    this.used = 0;

    this.validate();
  };

  /**
   * Run a pseudocode for the invalidated run function.
   * @returns {void}
   */
  _run(){
    throw new Error(`Command ${this.name} doesn't have a run() method.`);
  };


  /**
   * Test permissions of this command against the message object
   * @param {Message} message The message object for this function to check with
   * @returns {string?} Error message when test fails, or false if test passes
   */
  async testPermissions(message){
    if (!(message instanceof Message)){
      throw new Error('argument must be a valid Discord Message!');
    };

    if (message.author.profile === null){
      await message.author.loadProfile();
    };

    if (message.guild.profile === null){
      await message.guild.loadProfile();
    };

    const langserv = this.client.services.LANGUAGE;
    const language = message.author.profile?.data.language || 'en-us';

    if (this.guildOnly && message.channel.type === 'dm'){
      const path = [ 'system', 'permissions', 'guildonly' ];
      return Promise.resolve(langserv.get({ path, language }));
    };

    if (this.adminOnly && !message.member?.hasPermission('ADMINISTRATOR')){
      const path = [ 'system', 'permissions', 'adminonly' ];
      return Promise.resolve(langserv.get({ path, language }));
    };

    if (this.nsfw && message.channel.nsfw){
      const path = [ 'system', 'permissions', 'nsfw'];
      return Promise.resolve(langserv.get({ path, language }));
    };

    if (this.nsfw && !this.client.database?.connected){
      const path = [ 'system', 'permissions', 'database'];
      return Promise.resolve(langserv.get({ path, language }));
    };

    if (this.ownerOnly && message.author.id !== this.client.owner){
      const path = [ 'system', 'permissions', 'owneronly'];
      return Promise.resolve(langserv.get({ path, language }));
    };

    if (message.channel.type !== 'dm'){
      if (this.permissions.length && !message.channel.permissionsFor(message.member).has(this.permissions)){
        const path = [ 'system', 'permissions', 'userperm' ];
        const parameters = {
          '%PERMISSIONS%': this.client.services.UTIL.ARRAY.join(Object
            .entries(message.channel.permissionsFor(message.member).serialize())
            .filter( p => this.permissions.includes(p[0]) && !p[1])
            .flatMap(c => c[0].split('_').map(x => x.charAt(0) + x.toLowerCase().slice(1)).join(' ')))
        };
        return Promise.resolve(langserv.get({ path, parameters, language }));
      };

      if (this.clientPermissions.length && !message.channel.permissionsFor(message.guild.me).has(this.permissions)){
        const path = [ 'system', 'permissions', 'clientperm' ];
        const parameters = {
          '%PERMISSIONS%': this.client.services.UTIL.ARRAY.join(Object
            .entries(message.channel.permissionsFor(message.guild.me).serialize())
            .filter(p => this.clientPermissions.includes(p[0]) && !p[1])
            .flatMap(c => c[0].split('_').map(x => x.charAt(0) + x.toLowerCase().slice(1)).join(' ')))
        };
        return Promise.resolve(langserv.get({ path, parameters, language }));
      };

      if (this.rankcommand && message.guild.profile === null){
        const prop = this.client.database?.connected ? 'srvpfl' : 'database';
        const path = [ 'system', 'permissions', prop ];
        return Promise.resolve(langserv.get({ path, language }));
      };

      if (this.rankcommand && message.guild.profile.xp.isActive){
        const path = [ 'system', 'permissions', 'servxp' ];
        return Promise.resolve(langserv.get({ path, language }));
      };

      if (this.rankcommand && message.guild.profile.xp.exceptions.includes(message.guild.id)){
        const path = [ 'system', 'permissions', 'chnlxp' ];
        return Promise.resolve(langserv.get({ path, language }));
      };
    };

    return Promise.resolve(false);
  };

  validate(){
    if (!this.guildOnly && this.adminOnly){
      throw new Error(`${this.name} command permission conflict. Enabling adminOnly requires guildOnly to be true.`);
    };

    if (!this.guildOnly && this.rankcommand){
      throw new Error(`${this.name} command permission conflict. \`rankcommand\` property must only be used with guildOnly property.`);
    };
  };
};
