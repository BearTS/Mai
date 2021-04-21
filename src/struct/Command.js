const { Permissions: { FLAGS }, Message, MessageEmbed } = require('discord.js');
const PRMFLGS = Object.entries(FLAGS);


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
		this.aliases = Array(command.aliases).flat()
    .map(alias => String(alias || ''))
    .filter(Boolean);

    /**
     * Cooldown for this command, if any exists
     * @type {Cooldown}
     */
    this.cooldown = {
      time: command.cooldown?.time || 0,
      message: String(command.cooldown?.message) || null
    };

    /**
     * @param {string} permissions Required Permissions by the author of the message
     * @param {string} clientPermissions Required Permissions by the bot instance to function properly
     * @type {Permissions[]}
     */
    for (const PERMISSION_TYPE of ['permissions', 'clientPermissions']){
      this[PERMISSION_TYPE] = Array(command[PERMISSION_TYPE]).flat()
      .filter(x => PRMFLGS.some(([FLAG, BITS]) => x === FLAG || x === BITS))
      .map(permission => FLAGS[permission] || permission);
    };

    /**
     * The description for this command
     * The Group for this command
     * @type {string}
     */
    for (const [prop, def] of [['description', 'No description.'], ['group', 'unspecified']]){
      this[prop] = String(command[prop] || String(command[prop]) || def);
    };

    /**
     * Examples of usage for this command
     * The required parameters for this command
     * @type {string} parameters
     * @type {string} examples
     */
    for (const prop of ['examples', 'parameters']){
      this[prop] = Array(command[prop]).flat()
      .map(x => String(x || '')).filter(Boolean);
    };

    /**
     * Other parameters
     * @type {Boolean}
     */
    for (const [prop, def] of Object.entries({
      guildOnly: true,       // Whether the command can only be used on guilds and not on DMs
      ownerOnly: false,      // Whether the command can only be used by the bot owner
      adminOnly: false,      // Whether the command can only be used by members with `ADMINISTRATOR` permissions
      nsfw: false,           // Whether the command can only be used on nsfw channels
      requiresDatabase: true,// Whether the command requires a database connection to execute
      rankcommand: true      // Whether the command is a rank-based command
    })){
      this[prop] = typeof command[prop] === 'boolean' && Boolean(command[prop]);
    };

    this.run = typeof command.run === 'function' ? command.run : this._run;

    this.used = 0;
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
      throw new Error('Command#testPermissions: argument must be a valid Discord Message!');
    };

    for (const prop of ['author', 'guild']){
      if (message[prop].profile === null){
        await message[prop].loadProfile();
      };
    };

    const language = message.author.profile?.data.language || 'en-us';
    const getperms = (x,y) => Object.entries(message.channel.permissionsFor(x).serialize())
      .filter( p => this[y].includes(p[0]) && !p[1])
      .flatMap(c => c[0].split('_').map(x => x.charAt(0) + x.toLowerCase().slice(1)).join(' '));

    // Checking permissions on both DM and Guild
    for (const [prop, compare ] of Object.entries({
      guildOnly: message.channel.type === 'dm',
      ownerOnly: message.author.id !== this.client.owner,
      nsfw: message.channel.type !== 'dm' && !message.channel.nsfw,
      requiresDatabase: !this.client.database?.connected,
    })){
      if (this[prop] && compare){
        const langserv = this.client.services.LANGUAGE;
        const path = ['SYSTEM', `PERM_${prop.toUpperCase().substr(0,9)}`];
        return Promise.resolve(langserv.get({ path, language}));
      };
    };

    // Checking permissions on Guild
    if (message.channel.type === 'dm'){
      const langserv = this.client.services.LANGUAGE;
      // Checking if the message author has administrative permissions
      if (this.adminOnly && message.member.hasPermission(FLAGS.ADMINISTRATOR)){
        return Promise.resolve(langserv.get({ path: ['SYSTEM', 'PERM_ADMINONLY'], language }));
      } else

      // Checking if the message author has the required permissions
      if (this.permissions.length && !message.channel.permissionsFor(message.member).has(this.permissions)){
        return Promise.resolve(langserv.get({ language, path: ['SYSTEM', 'PERM_DISCOUSER'], parameters: {
          '%PERMISSIONS%': getperms(message.member, 'permissions')
        }}));
      } else

      // Checking if the client has the required permissions
      if (this.clientPermissions.length && !message.channel.permissionsFor(message.guild.me).has(this.clientPermissions)){
        return Promise.resolve(langserv.get({ language, path: ['SYSTEM', 'PERM_DISCLIENT'], parameters: {
          '%PERMISSIONS%': getperms(message.guild.me, 'clientPermissions')
        }}));
      } else

      // Checking if this command is a rank command
      if (this.rankcommand){
        for (const [ id, condition] of Object.entries({
          GUILDPROF : message.guild.profile === null,
          GUILDXPRC : message.guild.profile.xp.isActive,
          CHANNXPRC : message.guild.profile.xp.exceptions.includes(message.guild.id)
        })){
          if (condition){
            return Promise.resolve(langserv.get({ path: [ 'SYSTEM', `PERM_${id}`], language }));
          };
        };
      };
    };

    // If message passed the filters
    return Promise.resolve(false);
  };
};
