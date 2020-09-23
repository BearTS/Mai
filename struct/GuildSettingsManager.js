const { Collection } = require('discord.js')
const GuildSettings = require('./GuildSettings')

module.exports = class GuildSettingsManager{
    constructor(client){
      this.profiles = new Collection()
      this.lastUpdatedAt = new Date()
      this.client = client
    }

    async load(){
      const res = await require('../models/guildProfileSchema').find({})

      this.client.guilds.cache.each( guild => {
        this.profiles.set(guild.id, new GuildSettings(res.some( r => r.guildID === guild.id) ? res.find( r => r.guildID === guild.id) : { guildID: guild.id}))
      })

      this.lastUpdatedAt = new Date()
      return this
    }

    has(id){
      return this.profiles.has(id)
    }

    get(id){
      return this.profiles.get(id)
    }

    filter(fn){
      return this.profiles.filter(fn)
    }

    random(){
      return this.profiles.random()
    }

    set(id, data){
      this.lastUpdatedAt = new Date()
      return this.profiles.set(id, new GuildSettings(data))
    }

    update(id, data){
      this.lastUpdatedAt = new Date()
      return this.profiles.delete(id).set(id, new GuildSettings(data))
    }

    updateOn(id, data){
      this.lastUpdatedAt = new Date()
      return this.profiles.get(id)[data.name] = data.update
    }

    remove(id){
      this.lastUpdatedAt = new Date()
      return this.profiles.delete(id)
    }
}
