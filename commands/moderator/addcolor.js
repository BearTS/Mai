const {RichEmbed} = require("discord.js");
const settings = require("./../../botconfig.json");
const colors = require('./../../assets/json/colors.json')
const guildColorDB = require('./../../models/guildColorSchema.js')

module.exports.run = (bot,message,args) => {
  if (!message.member.permissions.has("MANAGE_ROLES")) return message.react('👎')
  if (args.length < 1) {
    return message.react('👎')
  }
  color = colors.colors.find(r=>r.name.toLowerCase()===(args.join(' ').toLowerCase())) || colors.colors.find(r=>r.hex===(args.join(' '))) || colors.colors.find(r=>r.hex===("#"+args.join(' ')))
  if (!color) {
    return message.react('👎')
  }

  message.guild.createRole({
      name: color.name,
      color: color.hex,
      mentionable: false,
      position: message.guild.roles.size-10
  }).then(()=>{
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
	  return message.react('👎')
        }
      if (guild.colors.includes(color.hex)) return message.react('👎')
      guild.colors.push(color.hex)
      guild.save()
      message.react('👍')
    })
  }).catch(()=>{
    message.react('👎')
  })

}

module.exports.help = {
  name: 'addcolor',
  aliases: [],
	group: 'moderator',
	description: 'add a new color role to the server.',
	examples: ['addcolor pearl'],
	parameters: ['color name']
}
