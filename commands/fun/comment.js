module.exports = {
  name: 'comment',
  aliases:[],
  guildOnly: true,
  group:'fun',
  description: 'Comment something and return a youtube-like comment',
  clientPermissions: [ 'ATTACH_FILES' ],
  get examples(){ return [ this.name, ...this.aliases ]; },
  run: (client ,message, args) => message.channel.send({
    files: [{
      name: 'youtube.png',
      attachment: [
        'https://some-random-api.ml/canvas/youtube-comment?avatar=',
        message.author.displayAvatarURL({format: 'png', size:1024}),
        `&username=${message.member.displayName}`,
        `&comment=${args.join(' ')}`
      ].join('')
    }]
  })
};
