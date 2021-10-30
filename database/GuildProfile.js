'use strict';

const DataProfile = require('./DataProfile');
const { MessageEmbed, Collection } = require('discord.js');

class GuildProfile extends DataProfile {
    constructor(client, handler, data){
        super(client, handler, data);
    };
    /*
      The methods below performs a soft validation on most of the data required.
        * Parameters [GuildRoleResolvable] performs a cache check on the guild's role manager.
        * Parameters [GuildChannelResolvable] performs a cache check on the guild's channel manager.
        * Parameters [String] performs a type check.
        * Parameters [MessageEmbed] Performs a server-side validation check on message embed entries.
          >> Parameters failing the validation check will not be saved.
          >> To bypass validation check please use the method on the parent class [modify()]
          >> [modify()] function do not return the class, but the changed value, so chaining functions is not possible

      Some methods do not provide or is lacking some steps for a validation check on the passed parameter:
        * Parameters [GuildChannelResolvable] do not check the channel type (text, voice, category, etc.)
        * [addWatchlistIds()] does not validate the Anilist Id passed in the parameter.
        * [setLanguage()] only checks for the data type and not the language code.
          >> Please use your self-made validation check on your command modules if none exist here.

      These methods do not throw an error when validations fail, to find if the data has changed you can check if
      the passed parameter is now the value when you use the [getValue()] method from the parent class.

      If you added more properties on the Schema, you still use the [getValue()] to read it, and [modify()] to edit it

      Make sure to call the [patch()] method after every edit to save the edits to the database.
      Values stored on the [_impendingValues] will be reset when fetch function is called before the values were saved
    */

    /**
     * Sets the language preference for this server
     * @param {String} [language] The language code to use
     * @return {GuildProfile} this instance
     */
    setLanguage(language = this.super.getValue('language')){
        this.super.modify(
            'language',
            typeof language === 'string' ? language : this.super.getValue('language')
        );
        return this;
    };

    /**
     * Sets the welcome channel for the greeter feature.
     * @param {ChannelResolvable} channel The ChannelResolvable of the greeter to use.
     * @return {GuildProfile} this instance
     */
    setWelcomeChannel(channel){
        const path = 'greeter.welcome.channel';
        this.super.modify(
            path,
            this.discordGuild.channels.resolveId(channel) || this.super.getValue(path),
        );
        return this;
    };

    /**
     * Sets the welcome message for the greeter feature
     * @param {String} message The Message of the greeter to use
     * @return {GuildProfile} this instance
     */
    setWelcomeMessage(message)){
        const path = 'greeter.welcome.message';
        this.super.modify(
            path,
            typeof message === 'string' ? message : this.super.getValue(path)
        );
        return this;
    };

    /**
     * Sets the embed for the welcome greeter feature
     * @param {MessageEmbed} embed The MessageEmbed for the greeter to use
     * @return {GuildProfile} this instance
     */
    setWelcomeEmbed(embed)){
        const path = 'greeter.welcome.embed';
        try {
            embed = new MessageEmbed(embed);
        } catch {
            embed = this.super.getValue(path);
        }
        this.super.modify(path, embed);
        return this;
    };

    /**
     * Sets the type for this greeter feature
     * @param {String} type The type of the greeter (embed, text, or both)
     * @return {GuildProfile} this instance
     */
    setWelcomeType(type){
        const path = 'greeter.welcome.type';
        this.super.modify(
            path,
            typeof path === 'string' ? path : this.super.getValue(path);
        );
        return this;
    };

    /**
     * Sets the leaving channel for the greeter feature.
     * @param {ChannelResolvable} channel The ChannelResolvable of the greeter to use.
     * @return {GuildProfile} this instance
     */
    setLeavingChannel(channel)){
        const path = 'greeter.leaving.channel';
        this.super.modify(
            path,
            this.discordGuild.channels.resolveId(channel) || this.super.getValue(path)
        );
        return this;
    };

    /**
     * Sets the leaving message for the greeter feature
     * @param {String} message The Message of the greeter to use
     * @return {GuildProfile} this instance
     */
    setLeavingMessage(message)){
        const path = 'greeter.leaving.message';
        this.super.modify(
            path,
            typeof message === 'string' ? message : this.super.getValue(path)
        );
        return this;
    };

    /**
     * Sets the embed for the leaving greeter feature
     * @param {MessageEmbed} embed The MessageEmbed for the greeter to use
     * @return {GuildProfile} this instance
     */
    setLeavingEmbed(embed)){
        const path = 'greeter.leaving.embed';
        try {
            embed = new MessageEmbed(embed);
        } catch {
            embed = this.super.getValue(path);
        }
        this.super.modify(path, embed);
        return this;
    };

    /**
     * Sets the type for this greeter feature
     * @param {String} type The type of the greeter (embed, text, or both)
     * @return {GuildProfile} this instance
     */
    setLeavingType(type){
        const path = 'greeter.leaving.type';
        this.super.modify(
            path,
            typeof path === 'string' ? path : this.super.getValue(path);
        );
        return this;
    };

    /**
     * Toggles or set the xpActive property on the guild
     * @param  {boolean} boolean Whether to force activate or deactivate the xp system
     * @return {GuildProfile} this instance
     */
    toggleXP(boolean){
      this.super.modify('xp.isActive', typeof boolean === 'boolean'
        ? boolean
        : !this.super.getValue('xp.isActive')
      );
      return this;
    };

    /**
     * Adds new channels to xp exceptions (a.k.a. xp blacklisted channel)
     * * Channels not belonging to the cache will be ignored.
     * @param {Collection<Channel>|Array<Channel>|Channel} channels An (Instance, Array, or a Collection) of Channel resolvable(s) to add to exceptions.
     * @return {GuildProfile} this instance
     */
    addXPExceptions(channels){
        const path = 'xp.exceptions';
        if (Array.isArray(channels) || channels instanceof Collection){
            channels = channels.map(x => this.discordGuild.channels.resolveId(x))
        } else {
            channels = [this.discordGuild.channels.resolveId(channels)];
        };
        this.super.modify(
            path,
            this.constructor.addItemsToArray(channels, this.super.getValue(path));
        );
        return this;
    };

    /**
     * Removes channels from xp exceptions (a.k.a. xp blacklisted channel)
     * @param {Collection<Channel>|Array<Channel>|Channel} channels An (Instance, Array, or a Collection) of Channel resolvable(s) to remove from exceptions.
     * @return {GuildProfile} this instance
     */
    removeXPExceptions(channels){
        const path = 'xp.exceptions';
        if (Array.isArray(channels) || channels instanceof Collection){
            channels = channels
                .map(x => this.discordGuild.channels.resolveId(x) || x)
                .filter(x => typeof x === 'string');
        } else {
            items = [this.discordGuild.channels.resolveId(channels)]
                .filter(x => typeof x === 'string');
        };
        this.super.modify(
            path,
            this.constructor.removeItemsFromArray(channels, this.super.getValue(path))
        );
        return this;
    };

    /**
     * Adds roles for xp rewards
     * * Roles not belonging to the cache will be ignored.
     * @param {Collection<Role>|Array<Role>|Role} roles An (Instance, Array, or a Collection) of Role Resolvable(s) to add to rewards.
     * @return {GuildProfile} this instance
     */
    addXPRewards(roles){
        const path = 'xp.rewards';
        if (Array.isArray(roles) || roles instanceof Collection){
            roles = roles.map(x => this.discordGuild.roles.resolveId(x))
        } else {
            roles = [this.discordGuild.roles.resolveId(roles)];
        };
        this.super.modify(
            path,
            this.constructor.addItemsToArray(roles, this.super.getValue(path))
        );
        return this;
    };

    /**
     * Removes roles from xp rewards
     * @param {Collection<Role>|Array<Role>|Role} roles An (Instance, Array, or a Collection) of Role Resolvable(s) to remove from rewards.
     * @return {GuildProfile} this instance
     */
    removeXPRewards(roles){
        const path = 'xp.rewards';
        if (Array.isArray(roles) || roles instanceof Collection){
            roles = roles
                .map(x => this.discordGuild.roles.resolveId(x) || x)
                .filter(x => typeof x === 'string');
        } else {
            items = [this.discordGuild.roles.resolveId(roles)]
                .filter(x => typeof x === 'string');
        };
        this.super.modify(
            path,
            this.constructor.removeItemsFromArray(roles, this.super.getValue(path))
        );
        return this;
    };


    setMutedRole(role){
      const path = 'roles.muted';
      this.super.modify(
          path,
          this.discordGuild.roles.resolveId(role) || this.super.getValue(path)
      );
      return this;
    };

    setSuggestChannel(channel){
        const path = 'channels.suggest';
        this.super.modify(
            path,
            this.discordGuild.channels.resolveId(channel) || this.super.getValue(path)
        );
        return this;
    };

    /**
     * Sets the channel for anime announcements {@link Anischedule}
     * @param {GuildChannel} channel A Channel resolvable to use for anischedule.
     * @return {GuildProfile} this instance
     */
    setWatchlistChannel(channel){
        const path = 'watchlist.channelID';
        this.super.modify(
            path,
            this.discordGuild.channels.resolveId(channel) || this.super.getValue(path)
        );
        return this;
    };

    /**
     * Adds (an entry | entries) to the watchlist data. (Subscribe to anime)
     * @param  {Array}  [ids=[]] Anilist ids to add
     * @return {GuildProfile} this instance
     */
    addWatchlistIds(ids = []){
        const path = 'watchlist.data';
        this.super.modify(
            path,
            this.constructor.addItemsToArray(ids, this.super.getValue(path))
        );
        return this;
    };

    /**
     * Removes (an entry | entries) from the watchlist data. (Unsubscribe from anime)
     * @param  {Array}  [ids=[]] Anilist ids to remove
     * @return {GuildProfile} this instance
     */
    removeWatchlistIds(ids = []){
        const path = 'watchlist.data';
        this.super.modify(
            path,
            this.constructor.removeItemsFromArray(ids, this.super.getValue(path))
        );
        return this;
    };

    /**
     * Provudes a static method to add items to an array and removes duplicates
     * Does not work on Object elements
     * @param {[type]} source      The array that contained the elements to add
     * @param {[type]} destination The array to add to,
     */
    static addItemsToArray(source, destination){
      return [...new Set(source.concat(destination))];
    };

    /**
     * Provides a static method to remove item from an array (remove source from destination)
     * Does not work on Object elements
     * @param  {Array} source      The Array that contained the elements to remove
     * @param  {Array} destination The Array to remove from
     * @return {Array}             The filtered Array.
     */
    static removeItemsFromArray(source, destination){
        destination = [...new Set(destination)];
        for (const item of source){
            if (destination.includes(item)){
                destination.splice(destination.indexOf(item), 1);
            };
        };
        return destination;
    };

    /**
     * The discord Guild this Profile is used on.
     * @return {?Guild} A discord guild object
     */
    get discordGuild(){
        return this.client.guilds.cache.get(this.id);
    };

    /**
     * The channel currently used for the welcome greeter feature.
     * @return {?GuildChannel} A discord GuildChannel object
     */
    get welcomeChannel(){
        return this.discordGuild.channels.cache.get(this.greeter.welcome.id);
    };

    /**
     * The channel currently used for the leaving greeter feature.
     * @return {?GuildChannel} A discord GuildChannel object
     */
    get leavingChannel(){
        return this.discordGuild.channels.cache.get(this.greeter.leaving.id);
    };

    /**
     * The role currently used for muting members in the guild.
     * @return {?GuildRole} A discord GuildRole object
     */
    get muteRole(){
        return this.discordGuild.roles.cache.get(this.roles.muted);
    };

    /**
     * The channel currently used for the suggestion feature.
     * @return {?GuildChannel} A discord GuildChannel object
     */
    get suggestChannel(){
        return this.discordGuild.channels.cache.get(this.channels.suggest);
    };

    /**
     * The channel currently used for the anischedule feature.
     * @return {?GuildChannel} A discord GuildChannel object
     */
    get anischeduleChannel(){
        return this.discordGuild.channels.cache.get(this.watchlist.channelID);
    };
};

module.exports = GuildProfile;
