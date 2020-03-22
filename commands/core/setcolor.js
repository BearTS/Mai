const {RichEmbed} = require("discord.js");
const settings = require("./../../botconfig.json");
const colors = require('./../../assets/json/colors.json')
const guildColorDB = require('./../../models/guildColorSchema.js')

module.exports.run = (bot,message,args) =>{
  if (args.length<1) return message.react('👎')
  let color = colors.colors.find(r=>r.name.toLowerCase()===(args.join(' ').toLowerCase())) || colors.colors.find(r=>r.hex===(args.join(' '))) || colors.colors.find(r=>r.hex===("#"+args.join(' ')))
  if (!color) return message.react('👎')
  guildColorDB.findOne({
    guildID: message.guild.id,
    guildName: message.guild.name,
  },(err,guild)=>{
    if (!guild) return message.react('👎')
    if (!guild.colors.includes(color.hex)) return message.react('👎')
    let guildColorRoles = []
    for (let i = 0; i<guild.colors.length;i++) guildColorRoles.push(colors.colors.find(r=>guild.colors[i]===r.hex).name)
    let role = message.member.roles.find(r=>guildColorRoles.includes(r.name))
    if (role) {
      message.member.removeRole(role)
    }
    let roleToAdd = message.guild.roles.find(r=>r.name===color.name)
    message.member.addRole(roleToAdd).then(()=>{return message.react('👍')}).catch(()=>{return message.react('👎')})
  })
}
module.exports.help = {
  name: "setcolor",
  aliases: ['sc','color'],
	group: 'core',
	description: 'Sets the selected color role to your profile.',
	examples: ['sc green','setcolor red','color teal'],
	parameters: ['color name']
}
