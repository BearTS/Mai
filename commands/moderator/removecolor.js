const {RichEmbed} = require("discord.js");
const settings = require("./../../botconfig.json");
const colors = require('./../../assets/json/colors.json')
const guildColorDB = require('./../../models/guildColorSchema.js')

module.exports.run = (bot,message,args) => {
    if (!message.member.permissions.has("MANAGE_ROLES")) return message.react('👎')
  if (args.length < 1) {
    return message.react('👎')
  }


    guildColorDB.findOne({
      guildID: message.guild.id,
      guildName: message.guild.name,
    },(err,guild)=>{
      if (!guild) {
        const registered = new guildColorDB({
          guildID: message.guild.id,
          guildName: message.guild.name,
          colors: []
        })
          registered.save().catch(console.error)
        }
        color = colors.colors.find(r=>r.name.toLowerCase()===(args.join(' ').toLowerCase())) || colors.colors.find(r=>r.hex===(args.join(' '))) || colors.colors.find(r=>r.hex===("#"+args.join(' ')))
        if (!color) return message.react('👎')
        let roleTobeDeleted = message.guild.roles.find(r=>r.name===color.name)
        if (!roleTobeDeleted) return message.react('👎')
        if (!guild.colors.includes(color.hex)) return message.react('👎')
          roleTobeDeleted.delete().then(()=>{
          guild.colors.splice(guild.colors.indexOf(color.hex),1)
          guild.save()
          message.react('👍')
    }).catch(()=>{
      message.react('👎')
    })



    })


}

module.exports.help = {
  name: 'removecolor',
  aliases: [],
	group: 'moderator',
	description: 'removes a specific color role from the server.',
	examples: ['removecolor teal'],
	parameters: ['color name']
}
