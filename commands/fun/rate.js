module.exports = {
  name: 'rate'
  , aliases: []
  , group: 'fun'
  , description: 'Rates the provided argument'
  , examples: []
  , parameters: []
  , run: async (client, message, args) => {

    if (!args.length)
      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}! Give me something to rate!!`)

    const raw = args.join(' ').replace(/[^\w\s]/gi,1202)

    let rate = parseInt(raw,36) < 1000
                ? parseInt(raw,36) * 16213 % 101
                : parseInt(raw,36) % 101

    if ([
            'mai san'
          , 'mai1202san'
          , 'mai'
          , 'mai sakurajima'
          , 'sakurajima1202mai'
          , 'mai1202senpai'
          , '1202120212027020744523173070611202'
        ].includes(raw.toLowerCase()))
          rate = 100

    const emoji = (rate) => [
        '\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤'
      , '\\❤️\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤'
      , '\\❤️\\❤️\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤'
      , '\\❤️\\❤️\\❤️\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤'
      , '\\❤️\\❤️\\❤️\\❤️\\🖤\\🖤\\🖤\\🖤\\🖤\\🖤'
      , '\\❤️\\❤️\\❤️\\❤️\\❤️\\🖤\\🖤\\🖤\\🖤\\🖤'
      , '\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\🖤\\🖤\\🖤\\🖤'
      , '\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\🖤\\🖤\\🖤'
      , '\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\🖤\\🖤'
      , '\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\🖤'
      , '\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️\\❤️'
    ][Math.floor(rate / 10)]

    return message.channel.send(`${emoji(rate)} (**${rate}**) %`)

  }
}
