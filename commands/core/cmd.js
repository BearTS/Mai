
const settings = require('./../../botconfig.json')
const {RichEmbed} = require('discord.js')
const utils = require('./../../utils/majutils.js')

module.exports.run = (bot, message, args) => {

fetchGroup(args).then(groupnames => {
  let group = []
  if (groupnames.length < 1) {
    groupnames = ['action','anime','core','fun','moderator','music','utility']
    groupnames.forEach(g => {
      let comms = bot.commands.filter(m => m.help.group === g)
      group.push({group:g,collection:comms})
    })
  } else {
    groupnames.forEach(g => {
      let comms = bot.commands.filter(m => m.help.group === g)
      group.push({group:g,collection:comms})
    })
  }
  let i = 0
  message.channel.send(embed(group[i].group,group[i].collection,message,i,group.length)).then(async msg => {
    if (group.length===1) return
    const collector = await msg.createReactionCollector((reaction, user) => user.id === message.author.id)
    let reactions = ['◀', '▶', '❌'];
    for (let i = 0; i < reactions.length; i++) await msg.react(reactions[i]);

    //Launch timeout countdown
    let timeout = setTimeout(function() {
        return collector.stop('timeout');
    }, 120000);

    collector.on('collect', async(r)=>{
      if (r.emoji.name === '◀') {
          if (i<1){
            i = (group.length)
          }
        clearTimeout(timeout)
        i--;
        await msg.edit(embed(group[i].group,group[i].collection,message,i,group.length))
      } else if (r.emoji.name === "▶"){
        if (i>(group.length-2)) {
          i = -1
        }
        clearTimeout(timeout)
        i++;
        await msg.edit(embed(group[i].group,group[i].collection,message,i,group.length))
      } else if (r.emoji.name === "❌"){
        collector.stop('terminated')
      }

      await r.remove(message.author.id); //Delete user reaction

      timeout = setTimeout(function() {
          collector.stop('timeout');
      }, 120000);

    })

    collector.on('end', async(collected,reason)=>{
      msg.clearReactions()
      if (reason==='timeout'){
        return
      } else if (reason==='terminated') {
        return
      }
    })
  })
})
}

module.exports.help = {
  name: 'cmd',
  aliases: ['commands','command','cmds'],
	group: 'core',
	description: 'Sends a list of all commands from a specific command group or all commands! Use the reactions to scroll through the panels!',
	examples: ['cmd anime','commands'],
	parameters: ['command group']
}

function fetchGroup(args){
  return new Promise((resolve,reject)=>{
    let validGroups = ['actions','anime','core','fun','moderator','music','utility']
    let output = []
    args.forEach(arg => {
      if (validGroups.includes(arg.toLowerCase())) output.push(arg)
    })
    resolve(output)
  })
}

function embed(group,collection,message,index,length){
  let description = ''
  collection.array().forEach(cmds => {
    description += `•\`${settings.prefix}${cmds.help.name}\`\n`
  })
  const embed = new RichEmbed()
  .setAuthor(`${group.slice('')[0].toUpperCase()+group.slice(1)} commands!`,message.client.user.displayAvatarURL)
  .setDescription(`Use \`${settings.prefix}help [command]\` for more details.\n\n${utils.textTrunctuate(description,1900)}`)
  .setColor(settings.colors.embedDefault)
  .setFooter(`#Sakurajimai#6742 created me! Banzai! •  Page ${index+1} of ${length}`)
  return (embed)
  }
