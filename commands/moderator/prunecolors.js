const {RichEmbed} = require("discord.js");
const settings = require("./../../botconfig.json");
const colors = require('./../../assets/json/colors.json')
const guildColorDB = require('./../../models/guildColorSchema.js')

module.exports.run = (bot,message,args) => {
    if (!message.member.permissions.has("MANAGE_ROLES")) return message.react('👎')
let colorArray = []
let errors = []
    guildColorDB.findOne({
      guildID: message.guild.id,
      guildName: message.guild.name,
    },(err,guild)=>{
      if (!guild) return message.react('👎')
      if (guild.colors.length<1) return message.react('👎')
      for (let i =0; i<guild.colors.length;i++){
        colorArray.push(message.guild.roles.find(r=>r.name===(colors.colors.find(c=>c.hex===guild.colors[i]).name)))
      }
      colorArray = colorArray.filter((el)=>{return el != undefined})
      for (let i=0;i<colorArray.length;i++){
        colorArray[i].delete().catch(()=>{
          errors.push(colorArray[i].name)
        })
      }
      if (!errors.length===0) message.channel.send(`Failed to prune ${errors.join(', ')}. Please delete them manually`)
      guild.colors = []
      guild.save()
      message.react('👍')
    })

}

module.exports.help = {
  name: 'prunecolors',
  aliases: [],
	group: 'moderator',
	description: 'Remove all the color roles of this server.',
	examples: ['prunecolors'],
	parameters: []
}
