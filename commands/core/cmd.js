const { commanddir, default: { prefix } } = require('../../settings.json')
const { MessageEmbed } = require('discord.js')

module.exports.run = async (client, message, args) => {

let group = []

if (!args.length) {
  commanddir.forEach( g => {

    const c = client.commands.filter( c => c.config.group === g )
    group.push({ group: g, collection: c})

  })
} else {

  const c = client.commands.filter( g => g.config.group === args.join(' '))
  if (!c.size) return message.channel.send(new MessageEmbed().setColor('RED').setDescription(`Couldnt find **${args.join(' ')}** command group!`))

  group.push({ group: args.join(' '), collection: c })
}

const msg = await message.channel.send(embedder(group[0], message, group.length)).catch( () => message.react("👎") )
if (!msg) return
if (group.length === 1) return

const collector = msg.createReactionCollector( (reaction ,user) => user.id === message.author.id )

let reactions = ['◀', '▶', '❌']
for (let i = 0; i < reactions.length; i++) await msg.react(reactions[i]);

  let timeout = setTimeout(()=> collector.stop('timeout'), 60000)
  let i = 0

  collector.on('collect', async (r) => {

    if (r.emoji.name === '◀') {

      if (i < 1) i = group.length
      clearTimeout(timeout)
      i--
      await msg.edit(embedder(group[i], message, group.length,i))

    } else if (r.emoji.name === '▶') {

      if (i === group.length - 1) i = -1
      clearTimeout(timeout)
      i++
      await msg.edit(embedder(group[i], message, group.length,i))
    } else if (r.emoji.name === "❌") {
      collector.stop('terminated')
    }

    await r.users.remove(message.author.id)

    timeout = setTimeout(()=> collector.stop('timeout'), 60000)

  })

  collector.on('end', async(collected,reason)=>{
      msg.reactions.removeAll()
    })

}

module.exports.config = {
  name: "cmd",
  aliases: ['commands','command','cmds'],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "core",
  description: "Sends a list of all commands from a specific command group or all commands! Use the reactions to navigate through the panels!",
  examples: ['cmd anime','commands'],
	parameters: ['command group']
}


function embedder({ group, collection }, message, length, index){

  let fields = []
  collection.sort((a,b) => a.config.name - b.config.name).forEach(command => {
    fields.push({name: `\u200B`,
    value : ` • **${command.config.name}** - *${command.config.description}*`})
  })

  return ( new MessageEmbed()
  .setAuthor(`${ group } commands!`, message.client.user.displayAvatarURL({ format: 'png', dynamic: true}))
  .setDescription(`Use \`${prefix}help [command]\` for more details.`)
  .setColor(!message.member.displayColor ? 'GREEN' : message.member.displayColor)
  .setFooter(`Created with ❤ by Sakurajimai#6742 • Page ${index ? index + 1 : '1'} of ${length}`)
  .addFields( fields )
)


  }
