const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

module.exports.run = async ( client, message, args) => {

  if (!args.length) args = ['pikachu']

  const msg = await message.channel.send(new MessageEmbed().setColor('YELLOW').setDescription(`\u200B\nSearching pokédex for **${args.join(' ')}**.\n\u200B`))

  const data = await fetch(`https://some-random-api.ml/pokedex?pokemon=${encodeURI(args.join(' '))}`).then(res => res.json()).catch(()=>{})

  if (!data) try {
    return msg.edit(err(`Oops! pokédex is currently down!`))
  } catch (err) {
    return message.channel.send(err(`Oops! pokédex is currently down!`))
  }

  const { error, id, name, sprites , description, type, abilities, height, weight, gender, egg_groups, stats, family, generation } = data
  const { hp, attack, defense, sp_atk, sp_def, speed } = stats ? stats : { hp: null, attack: null, defense: null, sp_atk: null, sp_def: null, speed: null }
  const { evolutionLine, evolutionStage } = family ? family : { evolutionLine : null, evolutionStage: null }

  if (error) try {
      return msg.edit(err(`Oops! I can't find that pokémon.`).setThumbnail('https://i.imgur.com/2vxrrKw.gif'))
    } catch (err) {
      return message.channel.send(err(`Oops! I can't find that pokémon.`).setThumbnail('https://i.imgur.com/2vxrrKw.gif'))
    }

  const embed =  new MessageEmbed()
  .setAuthor(`Pokédex entry #${id} ${name.toUpperCase()}`,'https://images-ext-2.discordapp.net/external/tqmeVg9xEWxDkURYe5So-KVG-4kCoIxyhDUcuRxBh9k/http/pngimg.com/uploads/pokemon_logo/pokemon_logo_PNG12.png','https://pokemon.com/us')
  .setColor(`GREY`)
  .setThumbnail(sprites ? sprites.animated ? sprites.animated : sprites.normal ? sprites.normal : null : null)
  .addField('Info', description ? description : '???')
  .addField('Type', type.length ? type.join('\n') : '???',true)
  .addField('Abilities', abilities && abilities.length ? abilities.join('\n') : '???',true)
  .addField('Build',`\u200B${height ? ` Height: ${height}\n` : '\u200B' } ${weight ? `Weight: ${weight}\n` : `\u200B`} ${gender && gender.length ? `Gender: ${gender.join(', ')}\n` : `\u200B` }`,true)
  .addField('Egg Groups',`\u200B${ egg_groups && egg_groups.length ? egg_groups.join('\n') : '\u200B'}`,true)
  .addField('Stats',`\u200B${hp ? ` HP: ${hp}\n`:'\u200B'} ${attack ? `ATK: ${attack}\n`:'\u200B'} ${defense ? `DEF: ${defense}\n` : '\n'}`, true)
  .addField('\u200B',`${sp_atk ? `SP.ATK: ${sp_atk}\n` : '\u200B'} ${sp_def ? `SP.DEF: ${sp_def}\n` : '\u200B'} ${speed ? `SPEED: ${speed}\n` : `\u200B`}`,true)
  .addField('Generation',generation ? generation : '\u200B',true)
  .addField('Evolution Line',evolutionLine.length ? evolutionLine.join(' -> ') : `\u200B`,true)
  .setFooter('The Pokémon Company (c)')
  try {
    return msg.edit(embed)
  } catch (err){
    return message.channel.send(embed)
  }

}

module.exports.config = {
  name: "pokemon",
  aliases: ["pokedex",'pokémon','pokédex'],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "fun",
  description: 'Find a specific pokemon using the pokédex',
  examples: ['pokedex Snorlax','pokémon meowth'],
  parameters: []
}

function err(err){
  return new MessageEmbed()
  .setDescription(`\u200B\n${err}\n\u200B`)
  .setColor('RED')
}
