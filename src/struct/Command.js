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
   * Test cooldowns of this command against the message object
   * @param {Message} message The message object for this function to check with
   * @returns {CooldownGrant} The cooldown grant for this command when tested
   */
  testCooldown(message){

  };

  /**
   * Test permissions of this command against the message object
   * @param {Message} message The message object for this function to check with
   * @returns {PermissionGrant} The permission grant for this command when tested
   */
  async testPermissions(message){
    if (!(message instanceof Message)){
      throw new Error('argument must be a valid Discord Message!');
    };

    let reasons = [], profile = message.guild.profile

    if (profile === null){
      await message.guild.loadProfile();
    };

    if (this.guildOnly && message.channel.type === 'dm'){
      reasons.push([
        '**Command is unavailable on DM**',
        'This command can only be used inside servers.'
      ].join(' - '));
    };

    if (this.adminOnly && !message.member?.hasPermission('ADMINISTRATOR')){
      reasons.push([
        '**Limited to Admins**',
        'This command can only be used by server administrators.'
      ].join(' - '));
    };

    if (this.nsfw && message.channel.nsfw){
      reasons.push([
        '**NSFW Command**',
        'You can only use this command on a nsfw channel.'
      ].join(' - '));
    };

    if (this.requiresDatabase && !this.client.database?.connected){
      reasons.push([
        '**Connection to Database not Found**',
        'This command requires a database connection.'
      ].join(' - '));
    };

    if (this.ownerOnly && message.author.id !== this.client.owner){
      reasons.push([
        '**Limited to Dev**',
        'This command can only be used by my developer.'
      ].join(' - '));
    };


    if (message.channel.type !== 'dm'){
      if (this.permissions.length && !message.channel.permissionsFor(message.member).has(this.permissions)){
        reasons.push([
          '**No Necessary Permissions (User)** - ',
          'You need the following permission(s):\n\u2000\u2000- ',
          Object.entries(message.channel.permissionsFor(message.member).serialize())
          .filter( p => this.permissions.includes(p[0]) && !p[1])
          .flatMap(c => c[0].split('_').map(x => x.charAt(0) + x.toLowerCase().slice(1)).join(' '))
          .join('\n\u2000\u2000- ')
        ].join(''));
      };

      if (this.clientPermissions.length && !message.channel.permissionsFor(message.guild.me).has(this.permissions)){
        reasons.push([
          '**No Necessary Permissions (Mai)** - ',
          'I need the following permission(s):\n\u2000\u2000- ',
          Object.entries(message.channel.permissionsFor(message.guild.me).serialize())
          .filter(p => this.clientPermissions.includes(p[0]) && !p[1])
          .flatMap(c => c[0].split('_').map(x => x.charAt(0) + x.toLowerCase().slice(1)).join(' '))
          .join('\n\u2000\u2000- ')
        ].join(''));
      };

      if (this.rankcommand && profile === null){
        reasons.push(this.client.database?.connected
          ? [
            '**Unable to fetch Server Profiles**',
            'Database is connected, but no server profile is found.'
          ].join(' - ')
          : [
            '**Connection to Database not found**',
            'Server profile is required to execute this command.'
          ].join(' - ')
        );
      };

      if (this.rankcommand && (profile.xp.isActive || profile.xp.exceptions.includes(message.channel.id))){
        reasons.push([
          !profile.xp.isActive ? '**Disabled XP**' : '**Disabled XP on Channel**',
          !profile.xp.isActive ? 'XP is currently disabled in this server.' : ' XP is currently disabled in this channel.'
        ].join(' - '));
      };
    };

    const embed = new MessageEmbed()
    .setAuthor('Command Execution Blocked!')
    .setColor('ORANGE')
    .setDescription(`Reasons:\n\n${reasons.map(reason => '• ' + reason).join('\n')}`);

    if (reasons.some(str => str.startsWith('**Disabled XP on Channel'))){
      embed.addField('\u200b',`If you are a server administrator, you may reallow it by typing **${message.client.prefix}xpenable ${message.channel}**`);
    } else {
      // Do nothing..
    };

    if (reasons.some(str => str.startsWith('**Disabled XP**'))){
      embed.addField('\u200b',`If you are a server administrator, you may reenable it by typing \`${message.client.prefix}xptoggle\` command`);
    } else {
      // Do nothing..
    };

    return Promise.resolve({ accept: !reasons.length, embed });
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
