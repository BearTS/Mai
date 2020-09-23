module.exports = {
  name: 'flip'
  , aliases: [
    'coinflip'
    , 'coin'
    , 'tosscoin'
    , 'tc'
  ]
  , cooldown: {
    time: 5000
    , message: 'You still have a pending tosscoin.'
  }
  , group: 'fun'
  , description: 'Win or Lose, Flip a Coin [Head or Tails]'
  , examples: [
    'flip head'
  ]
  , parameters: []
  , run: async ( client, message, [ choice ]) => {

    if (!choice || !['head','heads','h','tail','tails','t'].includes(choice.toLowerCase()))
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Please specify if \`[HEAD]\` or \`[TAILS]\``)

    let win = Math.round(Math.random())

    const results = [
      {
          tile: 'Heads'
        , children: [ 'head','heads','h' ]
      },
      {
          tile: 'Tails'
        , children: [ 'tail','tails','t' ]
      }
    ]

    const prompt = await message.channel
                    .send(`${message.author} tossed a coin! Betting for **${results.find(r => r.children.includes(choice.toLowerCase())).tile}**...`)

    const decision = `${
        win
        ? '`✅`' : '<:cancel:712586986216489011>'
      } ${
        message.author
      }! You ${
        win
        ? 'won'
        : 'lost'
      } the bet.\nYour Choice: ${
        results.find(r => r.children.includes(choice.toLowerCase())).tile
      }\nResult: ${
        results.find(r => !r.children.includes(choice.toLowerCase())).tile
      }\n\u200b`

    setTimeout(async() => await prompt.edit(decision).catch(()=>null)
                          ? null
                          : message.channel.send(decision).catch(()=>null) , 5000)

  }
}
