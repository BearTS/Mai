const { MessageEmbed } = require('discord.js')
const { textTrunctuate } = require('../../helper.js')
const { version, author} = require('../../package.json');
const { user: { owner } } = require('../../settings.json')
const changelog = require('../../changelog.json')

module.exports = {
  config: {
    name: "changelog",
    aliases: ['cl','changes','updates'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown:null,
    group: "bot",
    description: "Display the changes of this bot from version to version",
    examples: [`changelog ${version}`,`changelog latest`],
    parameters: ['Version']
  },
  run: async (client, message, [ vsc ]) => {

  if (!vsc) vsc = version

  if (vsc === 'latest') vsc = version

  const cl = changelog.find( c => c.version === vsc)

  if (!cl) return message.channel.send(error(`Couldn't find version ${vsc} on changelogs`))

  let fields = []

  cl.changes.forEach( change => {
    fields.push({
      name: change.title,
      value: change.content.join('\n')
    })
  })

    return message.channel.send(new MessageEmbed()
    .setAuthor(`${client.user.username} version ${cl.version} Changelogs`)
    .addFields(fields)
    .setColor( cl.version === version ? 'GREEN' : 'GREY')
    )
  }
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
