const { MessageEmbed } = require('discord.js')

module.exports = {
  config: {
    name: 'invite',
    aliases: [],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: 'core',
    description: `Gives you the invite link!`,
    examples: ['invite'],
    parameters: [],
  },
  run: (client, message, args) => {
    var phrases = [
        'Add me to your server with this link!',
        'I-It\'s not like I want to be invited to your server...',
        'Invite me Kouhai!',
        'Hello... Please take me...',
        'I\'d love to be in your server!',
        'Whaa~~ A server? Of course!',
        'P-Please invite me.. to your server...'
    ]

    message.channel.send(`${phrases[Math.floor(Math.random() * (phrases.length - 1))]}\n\nLink: https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=1043721303`)

  }
}
