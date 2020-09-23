const { MessageEmbed } = require('discord.js')
const { MongooseModels: { guildInviteSchema }} = require('../../helper')

module.exports = {
  name: 'invite'
  , aliases: []
  , guildOnly: true
  , group: 'bot'
  , description: `Gives you the invite link!`
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , examples: ['invite']
  , parameters: []
  , run: async ( client, message, args) => {
    const  phrases = [
        'Add me to your server with this link!',
        'I-It\'s not like I want to be invited to your server...',
        'Invite me Kouhai!',
        'Hello... Please take me...',
        'I\'d love to be in your server!',
        'Whaa~~ A server? Of course!',
        'P-Please invite me.. to your server...',
        '...'
    ]

    const phrase = phrases[Math.floor(Math.random() * (phrases.length - 1))]

    let guild_invite = await message.guild.fetchInvites()
                        .catch(() => null)

        guild_invite = guild_invite && guild_invite.size
                       ? guild_invite.random()
                       : null

    let ad_invite = await guildInviteSchema.find({})
                      .catch(()=> null)

        ad_invite = ad_invite && ad_invite.length
                    ? ad_invite.filter(a => client.guilds.cache.has(a.guildID))[Math.floor(Math.random() * ad_invite.filter(a => client.guilds.cache.has(a.guildID)).length)]
                    : null

    const ad_invite_guildname = client.guilds.cache.get(ad_invite.guildID).name

    message.channel.send(new MessageEmbed()
    .setAuthor(phrase)
    .setColor('GREY')
    .setDescription(`
      <:next:712581873628348476> [My Invite Link](https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=1043721303)

      <:next:712581873628348476> [Invite Link to my Support Server](https://discord.gg/P9gj82x)
      ${guild_invite ? `
      <:next:712581873628348476> [Invite Link to this server](${guild_invite.url})
        ` : ''}
      <:next:712581873628348476> [Advertised Server Invite Link](${ad_invite.invite.link}): **${ad_invite_guildname}**
      ${ad_invite.invite.description}
      `)
    )
  }
}
