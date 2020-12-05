module.exports = class GuildProfile{
  constructor(data, anischedCh){
    // *Goodbye Message refer to Leaving Member Announcer

    /**
    * The id of this profile identical to the guild ID
    * @type {string}
    */
    this.id = data.guildID;

    /**
    * The custom prefix for this guild.
    * @type {?string}
    */
    this.prefix = data.prefix || null;

    this.welcome = {

      /**
      * The channel ID for logging welcome messages (if enabled).
      * @type {?string<Snowflake>}
      */
      channel: data.welcomeChannel,

      /**
      * The text version of the message for logging welcome messages.
      * @type {?string}
      */
      message: data.welcomemsg,

      /**
      * Whether the welcome messages is enabled.
      * @type {Boolean}
      */
      enabled: data.welcomeEnabled,

      /**
      * The embedded version of the message for logging welcome messages.
      * @type {?MessageEmbed}
      */
      embed: data.welcomeEmbed,

      /**
      * Which type to use.
      * @type {string<default|text|embed>}
      */
      use: data.welcomeUse
    };

    this.goodbye = {

      /**
      * The channel ID for logging goodbye messages (if enabled).
      * @type {?string<Snowflake>}
      */
      channel: data.goodbyeChannel,

      /**
      * The text version of the message for logging goodbye messages.
      * @type {?string}
      */
      message: data.goodbyemsg,

      /**
      * Whether the goodbye messages is enabled.
      * @type {Boolean}
      */
      enabled: data.goodbyeEnabled,

      /**
      * The embedded version of the message for logging goodbye messages.
      * @type {?MessageEmbed}
      */
      embed: data.goodbyeEmbed,

      /**
      * Which type to use.
      * @type {string<default|text|embed>}
      */
      use: data.goodbyeUse
    };

    this.xp = {

      /**
      * Whether the xp system is active on the guild
      * @type {Boolean}
      */
      active: data.isxpActive,

      /**
      * The channel IDs to blacklist from xp system.
      * @type {string[]}
      */
      exceptions: data.xpExceptions
    };

    /**
    * ?Whether the guild's economy system is active.
    * Deprecated - Will remove in next release
    * @type {Boolean}
    */
    this.isEconomyActive = data.iseconomyActive;

    /**
    * Role IDs bound to specific bot function.
    * @type {string{}}
    */
    this.roles = {
      muted: data.muterole
    };

    /**
    * Channel IDs bound to specific bot function.
    * @type {string{}}
    */
    this.featuredChannels = {
      anisched: anischedCh,
      suggest: data.suggestChannel
    };
  };

  /**
   * Retrieves the channel id of the suggest channel, if it exists
   * @private
   */
  get anischedChannel(){
    return this.featuredChannels.anisched
  };

  /**
   * Retrieves the channel id of the suggest channel, if it exists
   * @private
   */
  get suggestChannel(){
    return this.featuredChannels.suggest
  };
};
