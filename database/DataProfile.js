'use strict';

const BaseProfile = require('./BaseProfile');
// Note, for all classes extended from BaseProfile, the client is accessible via ._client
class GuildProfilePatchError extends Error {};

/**
 * Examples on Writing to database
 * ```
 *    Profile.modify('data.profile.color', '#ffb3c0');
 *    await Profile.patch();
 * ```
 * Or if It is an instance of GuildPofile (Each class provides a helper method unique to their class)
 * You can chain them until you call the patch function;
 * ```
 *    Profile
 *       .setPrimaryProfileColor('#ffb3c0')
 *       .setSecondaryProfileColor('#3c3c3c')
 *       .patch();
 * ```
 *
 * Do not save directly to the model as it may cause caching errors.
 * The method below is not ideal, use the method above.
 * ```
 *    const model = Profile.toModel();
 *    model.data.profile.color = '#ffb3c0';
 *    model.save();
 * ```
 *
 * When reading data from this instance, properties are normally accessed as if they were mongoose objects
 */

class DataProfile extends BaseProfile {
    constructor(client, handler, data){
      super(client, handler);

      this._impendingValues = data;

      this.id = this._id;

      /**
       * Store all of the data's enumerable properties to this instance
       * Properties are defined from this DataProfile's model.
       */
      for (const [k,v] of Object.entries(data))
          this[k] = v;
    };

    /**
     * Add modification to this profile (not saved to database yet [saves to impendingValues property on the instance])
     * @param  {[type]} address The address of the value in the object notated by dot ('.')
     * @param  {[type]} value   The new value to set on the provided address
     * @return {*}  The value of the changed data
     * @example
     *    Assume the value of this.greeter.welcome.type is 'text'. Executing the functions below in order:
     * // GuildProfile.modify('greeter.welcome.type', 'embed')   % returns 'embed'
     * // GuildProfile.value('greeter.welcome.type')             % returns 'embed'
     * // GuildProfile.greeter.welcome.type                      % returns 'text'
     */
    modify(address, value){
        const properties = address.split('.');
        return properties.reduce((obj, prop, i) => properties.length - 1 == i ? obj[prop] = value || obj[prop] : obj[prop], this._impendingValues);
    };

    /**
     * Get value from impending data (data that is to be saved).
     * Shorthand method of this._impendingValues.*...props
     * @param  {string} address The address of the value in the object notated by dot ('.')
     * @return {*}
     * @example
     * // GuildProfile.getValue('greeter.welcome.type') // returns 'default';
     */
    getValue(address){
        return address.split('.').reduce((obj, prop) => obj[prop], this._impendingValues);
    };

    /**
     * Fetch this guildProfile from the database
     * @param  {boolean=true}  options.cache Whether to cache the data or not
     * @param  {boolean=false} options.force Whether to skip checking cache
     * @return {Promise<GuildProfile>}
     */
    async fetch(options = {}){
        return await this._handler.fetch(this.id, options);
    };

    /**
     * Patch modified data to the database
     * @note This uses the model.save() method instead of the model.updateOne() or model.updateMany() method that is used by the handler.
     * @return {Promise<GuildProfile>} The updated GuildProfile
     */
    async patch(){
        try {
            const data = await new this._handler._model({ _id: this.id, ...this._impendingValues }).save();
        } catch (e) {
            throw new GuildProfilePatchError(e.message);
        };
        this._handler._store([ data ]);
        return this._handler.cache.get(data.id);
    };

    /**
     * Transforms this profile into a plain object
     * @return {Object} [description]
     */
    toJSON(){
        return this.toModel().toJSON();
    };

    /**
     * Returns a model instance of this GuildProfile
     * @return {[type]} [description]
     */
    toModel(){
        return new this._handler._model({ _id: this.id, ...this });
    };
};

module.exports = DataProfile;
