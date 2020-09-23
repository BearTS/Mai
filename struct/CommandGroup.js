const CommandCache = require('discord.js').Collection

module.exports = class CommandGroup{
    constructor(groups){
      if (!Array.isArray(groups)) throw new TypeError('Groups must be an Array')

      for (const group of groups){

        this[group] = new CommandCache()

      }

    }

    get(name){
      return this[name]
    }

}
