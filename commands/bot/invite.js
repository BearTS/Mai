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

    const guild_invite = await message.guild.fetchInvites().then(g => g.random())
                        .catch(() => null)

    // let ad_invite = await guildInviteSchema.find({})
    //   .then(a => a.filter(a => client.guilds.cache.has(a.guildID) && a.invite.description && a.invite.link))
    //   .catch(() => null)
    //
    //
    //     ad_invite = ad_invite && ad_invite.length
    //                 ? ad_invite[Math.floor(Math.random() * ad_invite.length)]
    //                 : null

    message.channel.send(new MessageEmbed()
    .setAuthor(phrase)
    .setColor('GREY')
    .setTitle(`**Invite Mai with the following permissions**`)
    .addField(
      '**Default Invite**'
      , '<a:animatedcheck:758316325025087500> Mai\'s Flagship Invite link used for advertising '
      + 'Mai in her [website](https://mai-san.ml).'
      , true)
    .addField(
      '**Recommended Invite**',
      '<a:animatedcheck:758316325025087500> This invite grants Mai all the necessary '
      + 'permissions for all of her functions to work.'
        , true
      )
    .addField(
      '**Full Permissions Invite**'
      , '<a:animatedcheck:758316325025087500> This invite grants Mai the `ADMINISTRATOR` '
      + 'permission privileges. \n\n'
      , true
      )
    .addField('\u200b', '**https://invite.mai-san.ml**\n\u200b',true)
    .addField('\u200b', '[**Click Here to Invite!**](https://discord.com/api/oauth2/authorize?client_id=702074452317307061&permissions=1342696567&scope=bot "Invite Mai!")\n\u200b', true)
    .addField('\u200b', '[**Click Here to Invite!**](https://discord.com/api/oauth2/authorize?client_id=702074452317307061&permissions=8&scope=bot "Invite Mai!")\n\u200b', true)
    .addField(
      '**No Moderator Priviledge**'
      , '<a:animatedcheck:758316325025087500>  This invite removes Mai\'s permission to '
      + 'Moderate the server and it\'s members. Use only if you don\'t want Mai\'s Moderation commands.\n\n'
      , true
      )
    .addField(
      '**Basic Permissions**'
      , '<a:animatedcheck:758316325025087500> The most basic permission for Mai\'s basic commands to work.\n\n'
      , true
      )
    .addField('\u200b','\u200b', true)
    .addField('\u200b', '[**Click Here to Invite!**](https://discord.com/api/oauth2/authorize?client_id=702074452317307061&permissions=519249&scope=bot "Invite Mai!")\n\u200b',true)
    .addField('\u200b', '[**Click Here to Invite!**](https://discord.com/api/oauth2/authorize?client_id=702074452317307061&permissions=379968&scope=bot "Invite Mai!")\n\u200b', true)
    .addField('\u200b','\u200b', true)
    .addField(
      `\u200b`
      , guild_invite
      ? `Invite Link for this server: **${guild_invite.url}**`
      : 'Invite Link for this server: I haven\'t been given access to this server\'s Invite Links. if you are a `Server Moderator` '
      + 'and wishes to have your server invite link available for invite command on your server, grant me the `Manage_Server` permission.'
    )
    .addField('\u200b',
      'Visit my website at: https://mai-san.ml\u2000•\u2000[Old Webpage **(v2.4.0)**](https://maisans-maid.github.io/mai.moe)\n'
      + 'Join my support server at: https://support.mai-san.ml\n'
      + 'Github Repo Available at: https://github.com/maisans-maid/Mai'
    ).setFooter(`©️${new Date().getFullYear()} Mai`)
    )
  }
}
