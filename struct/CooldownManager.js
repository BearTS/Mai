const { Collection } = require('discord.js')

module.exports = class CooldownManager{
  constructor(command){
    this.name = command.name
    this.users = new Collection()
  }
}
