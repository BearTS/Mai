const { commanddir, default: { prefix } } = require('../../settings.json')
const { MessageEmbed } = require('discord.js')
const { pointright, pointleft, cancel } = require('../../emojis')

module.exports = {
  config: {
    name: "cmd",
    aliases: ['commands','command','cmds'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: "core",
    description: "Sends a list of all commands from a specific command group or all commands! Use the reactions to navigate through the panels!",
    examples: ['cmd anime','commands'],
  	parameters: ['command group']
  },
  run: async (client, message, args) => {

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

    const left = pointleft(client)
    const right = pointright(client)
    const terminate = cancel(client)
    const collector = msg.createReactionCollector( (reaction ,user) => user.id === message.author.id )

    const navigators = [ left, right, terminate ]
    for (let i = 0; i < navigators.length; i++) await msg.react(navigators[i]);

    let timeout = setTimeout(()=> collector.stop('timeout'), 60000)
    let i = 0

    collector.on('collect', async ( { emoji: { name } , users } ) => {

      switch(name){
        case left.name ? left.name : left:
          if (i < 1) i = group.length
          clearTimeout(timeout)
          i--
          await msg.edit(embedder(group[i], message, group.length,i))
        break;
        case right.name ? right.name : right:
          if (i === group.length - 1) i = -1
          clearTimeout(timeout)
          i++
          await msg.edit(embedder(group[i], message, group.length,i))
        break;
        case terminate.name ? terminate.name : terminate:
          collector.stop('terminated')
        break;
      }

      await users.remove(message.author.id)

      timeout = setTimeout(()=> collector.stop('timeout'), 60000)

    })

    collector.on('end', ()=>{

      msg.reactions.removeAll()
    })
  }
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
