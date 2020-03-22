const {RichEmbed} = require("discord.js");
const settings = require("./../../botconfig.json");
const colors = require('./../../assets/json/colors.json')
const guildColorDB = require('./../../models/guildColorSchema.js')


module.exports.run = (bot, message, args) => {
let roles = []
let roleNames = []
let role;

guildColorDB.findOne({
  guildID: message.guild.id,
  guildName: message.guild.name,
},(err,guild)=>{
  if (!guild) return message.channel.send(`❌ There are no color roles found in this server.`)
  for (let i = 0; i < guild.colors.length; i++){
    role =  message.guild.roles.find(r => r.hexColor === guild.colors[i])
    if (role) {
      roleNames.push(colors.colors.find(r=>r.hex===role.hexColor).name)
      roles.push(role)
    }
  }

  if (roles.length<1){
    return message.channel.send(`❌ There are no color roles found in this server.`)
  }

  roles.sort(function(a,b){
    return (a.color - b.color)
  })

  page = []
  pages = Math.ceil(roles.length / 10)
  let n = 0
  let arrayedRoles = []
  let arrayedRoleNames = []
  for (let i = 0; i < pages ; i++){
  arrayedRoles = []
  arrayedRoleNames = []
    for (let x = 0; x < 10; x++){
      arrayedRoles.push(roles[n])
      arrayedRoleNames.push(roleNames[n])
      n++
    }
  arrayedRoles = arrayedRoles.filter((el)=>{return el != undefined})
  arrayedRoleNames = arrayedRoleNames.filter((el)=>{return el != undefined})
  page.push({page:i+1,roles:arrayedRoles,roleNames:arrayedRoleNames})
  }
  n = 0
  const embedder = (page) => {
    const embed = new RichEmbed().setColor(settings.colors.embedDefault)
    embed.setAuthor('Available Colors')
    embed.addField(`Preview`,"• "+page[n].roles.join('\n • '),true).addField(`Name`,"• "+page[n].roleNames.join('\n • '),true)
    embed.setFooter(`To use in your name, type ${settings.prefix}setcolor <Name>, ${settings.prefix}sc <Name>, or ${settings.prefix}color <Name>\nPage ${n+1} of ${pages}`)
    return embed
  }

  return message.channel.send(embedder(page)).then(async msg=>{
    if (pages===1) return

    let collector = await msg.createReactionCollector((reaction,user)=>{(!user.bot) && (user.id===message.author.id)})
    let reactions = ['◀', '▶', '❌'];
    for (let i = 0; i < reactions.length; i++) await msg.react(reactions[i]);

    let timeout = setTimeout(function() {
        return collector.stop('timeout');
    }, 120000);

    collector.on('collect', async(r)=>{
      if (r.emoji.name === '◀') {
          if (!(n<1)){
            clearTimeout(timeout)
            n--;
            await msg.edit(embedder(page))
        }
      } else if (r.emoji.name === "▶"){
        if (n<(page.length-1)){
          clearTimeout(timeout)
          n++;
          await msg.edit(embedder(page))
        }
      }  else if (r.emoji.name === "❌"){
        collector.stop('terminated')
      }

      await r.remove(message.author.id); //Delete user reaction
      timeout = setTimeout(function() {
          collector.stop('timeout');
      }, 120000);

    })

    collector.on('end', async(collected,reason)=>{
      interactiveMessage.clearReactions()
      if (reason==='timeout'){
        return resolve(interactiveMessage.edit(`Timed-out! Can no longer switch between pages.`))
      } else if (reason==='terminated') {
        return resolve(interactiveMessage.edit(`Terminated! Can no longer switch between pages.`))
        }
      })


  }).catch()
})

if (message) {
  message.delete()
}

return;
}



module.exports.help = {
  name: "ac",
  aliases: ['availablecolors'],
	group: 'core',
	description: 'Shows the available color roles for the server',
	examples: ['ac','availablecolors'],
	parameters: []
  }
