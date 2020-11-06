module.exports = {
  name: '8ball'
  , aliases: [
    '🎱'
    , '8-ball'
    , 'eightball'
  ]
  , group: 'fun'
  , description: 'Ask anything on the magic 8-ball'
  , examples: []
  , parameters: []
  , run: async (client, message, args) => {

    const eightball = [
      'It is certain.'
      , 'It is decidedly so.'
      , 'Without a doubt.'
      , 'Yes - definitely.'
      , 'You may rely on it.'
      , 'As I see it, yes.'
      , 'Most likely.'
      , 'Outlook good.'
      , 'Yes.'
      , 'Signs point to yes.'
      , 'Reply hazy, try again.'
      , 'Ask again later.'
      , 'Better not tell you now.'
      , 'Cannot predict now.'
      , 'Concentrate and ask again.'
      , 'Don\'t count on it.'
      , 'My reply is no.'
      , 'My sources say no.'
      , 'Outlook not so good.'
      , 'Very doubtful.'
    ]

    if (!args.length)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}! You're not asking anything!`)

    return message.channel.send(eightball[Math.floor(Math.random() * eightball.length)])

  }
}
