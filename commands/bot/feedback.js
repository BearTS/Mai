const { MessageEmbed } = require('discord.js')
const { TextHelpers: { textTrunctuate }} = require('../../helper')

module.exports = {
  name: 'feedback'
  , aliases: []
  , guildOnly: true
  , cooldown:{
    time: 30000
    , message: "Please limit your usage of this command. [Don't spam this command]"
  }
  , clientPermissions: [
    'ADD_REACTIONS'
  ]
  , group: "bot"
  , description: "Sends a support message to this bot\'s owner (Sakurajimai#6742)"
  , examples: [
    'feedback [bugs, issues, etc]'
  ]
  , parameters: [
    'Feedback message'
  ]
  , run: async (client, message, args) => {

    if (!args.length)
      return message.channel
              .send(`<:cancel:767062250279927818> | ${message.author}, Please add an issue to your message!`)
                .then(()=>  message.react("💢"))

    if (args.join(' ').length > 1000)
      return message.channel
              .send(`<:cancel:767062250279927818> | ${message.author}, Please make your report brief and short! (MAX 1000 characters!)`)
                .then(()=>  message.react("💢"))

    const ownerUser = client.users.cache.get('545427431662682112')

    if (!ownerUser) return message.channel.send(`Couldn't contact Sakurajimai#6742!`)

    return ownerUser.send( new MessageEmbed()
    .setAuthor( message.author.tag, message.author.displayAvatarURL({format: 'png', dynamic: true}))
    .setColor('ORANGE')
    .setTimestamp()
    .setFooter(`Channel ID: ${message.channel.id} | Author ID: ${message.author.id}`)
    .addField(`${message.guild.name} | #${message.channel.name}`, args.join(' '))

    ).then( async () => {

      await message.react('✅')
            .catch(()=> null)

    }).catch((err) => {

      message.channel
        .send( new MessageEmbed()
              .setColor('RED')
              .setDescription(`Sakurajimai#6702 is currently not accepting any Feedbacks right now via DMs. You might [join](https://discord.gg/P9gj82x 'Mai Support Server') my support server instead or make an issue on [my github page](https://github.com/maisans-maid/Mai 'Mai Github Page') to directly address your issue.`)
        );

    })
  }
}
