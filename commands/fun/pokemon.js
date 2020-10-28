const { MessageEmbed } = require("discord.js")
const fetch = require('node-fetch')

module.exports = {
  name: 'pokemon'
  , aliases: [
    'pokedex'
    , 'pokémon'
    , 'pokédex'
  ]
  , group: 'fun'
  , description: 'Find a specific pokemon using the pokédex'
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , examples: [
    'pokedex Snorlax'
    , 'pokémon meowth'
  ]
  , parameters: []
  , run: async ( client, message, args ) => {

    if (!args.length) args = ['Pikachu']

    const prompt = await message.channel.send(
      new MessageEmbed()
      .setColor('YELLOW')
      .setDescription(`\u200B\nSearching pokédex for **${args.join(' ')}**.\n\u200B`)
      .setThumbnail('https://i.imgur.com/u6ROwvK.gif')
    )

    const data = await fetch(`https://some-random-api.ml/pokedex?pokemon=${encodeURI(args.join(' '))}`)
                  .then(res => res.json())
                    .catch(()=>null)

      let errmsg = new MessageEmbed()
                    .setDescription(`\u200b\n<:cancel:712586986216489011> | ${message.author},  Pokédex is currently down!\n\u200b`)
                    .setColor('RED')

    if (!data) return await prompt.edit(errmsg).catch(()=>null)
                      ? null
                      : message.channel.send(errmsg).catch(()=>null)

      errmsg.setDescription(`\u200b\n<:cancel:712586986216489011> | ${message.author},  I can't seem to find **${args.join(' ')}** from the Pokédex!\n\u200b`)

    if (data.error) return await prompt.edit(errmsg).catch(()=>null)
                            ? null
                            : message.channel.send(errmsg).catch(()=>null)

    const {
        error
      , id
      , name
      , sprites
      , description
      , type
      , abilities
      , height
      , weight
      , gender
      , egg_groups
      , stats
      , family
      , generation } = data

    const {
        hp
      , attack
      , defense
      , sp_atk
      , sp_def
      , speed } = stats
                  ? stats
                  : { hp: null, attack: null, defense: null, sp_atk: null, sp_def: null, speed: null }

    const {
        evolutionLine
      , evolutionStage } = family
                           ? family
                           : { evolutionLine : null, evolutionStage: null }

    const embed =  new MessageEmbed()

    .setAuthor(
      `Pokédex entry #${id} ${name.toUpperCase()}`
      , 'https://images-ext-2.discordapp.net/external/tqmeVg9xEWxDkURYe5So-KVG-4kCoIxyhDUcuRxBh9k/http/pngimg.com/uploads/pokemon_logo/pokemon_logo_PNG12.png'
      , 'https://pokemon.com/us'
    )

    .setColor(`GREY`)

    .setThumbnail(
      sprites
      ? sprites.animated
        ? sprites.animated
        : sprites.normal
          ? sprites.normal
          : null
        : null
      )

    .addField(
      'Info'
      , description
        ? description
        : '???'
      )

    .addField(
      'Type'
      , type.length
        ? type.join('\n')
        : '???'
      , true
    )

    .addField(
      'Abilities'
      , abilities && abilities.length
        ? abilities.join('\n')
        : '???'
      , true
    )

    .addField(
      'Build'
      , `\u200B${
          height
          ? ` Height: ${height}\n`
          : '\u200B'
        } ${
          weight
          ? `Weight: ${weight}\n`
          : `\u200B`
        } ${
          gender && gender.length
          ? `Gender: ${gender.join(', ')}\n`
          : `\u200B`
        }`
      , true
    )

    .addField(
      'Egg Groups'
      , `\u200B${
          egg_groups && egg_groups.length
          ? egg_groups.join('\n')
          : '\u200B'
        }`
      , true
    )

    .addField(
      'Stats'
      , `\u200B${
          hp
          ? ` HP: ${hp}\n`
          :'\u200B'
        } ${
          attack
          ? `ATK: ${attack}\n`
          :'\u200B'
        } ${
          defense
          ? `DEF: ${defense}\n`
          : '\n'
        }`
      , true
    )

    .addField(
      '\u200B'
      , `${
          sp_atk
          ? `SP.ATK: ${sp_atk}\n`
          : '\u200B'
        } ${
          sp_def
          ? `SP.DEF: ${sp_def}\n`
          : '\u200B'
        } ${
          speed
          ? `SPEED: ${speed}\n`
          : `\u200B`
        }`
      , true
    )

    .addField(
      'Generation'
      , generation
        ? generation
        : '\u200B'
      , true
    )

    .addField(
      'Evolution Line'
      , evolutionLine.length
        ? evolutionLine.join(' -> ')
        : `\u200B`
      , true
    )

    .setFooter(`Pokédex - The Pokémon Company\©️ | \©️${new Date().getFullYear()} Mai`)

    return await prompt.edit(embed).catch(()=>null)
                  ? null
                  : message.channel.send(embed).catch(()=>null)

  }
}
