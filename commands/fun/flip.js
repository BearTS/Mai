const { MessageEmbed } = require('discord.js')

module.exports = {
  config: {
    name: "flip",
    aliases: ['coinflip','coin','tosscoin','tc'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: {
      time: 5,
      msg: "You still have a pending tosscoin."
    },
    group: "fun",
    description: "Win or Lose, Flip a Coin [Head or Tails]" ,
    examples: ['flip head','tc tails @user'],
    parameters: []
  },
  run:  async ( client, message, [choice, mention] ) => {

    if (!choice) return message.channel.send(error(`Please specify if head or tail.`))

    if (!['head','heads','h','tail','tails','t'].includes(choice.toLowerCase())) return message.channel.send(error(`Please specify if head or tail.`))

    let win = Math.floor(Math.random()*100) > 50

    const match = mention ? mention.match(/\d{18}/) : undefined

    mention = mention && match ? (message.guild.members.cache.get(match[0]) || await message.guild.members.fetch(match[0])) : undefined

    if (mention && (mention.id === client.user.id || message.member.id === mention.id)) mention = undefined

    const prompt = await message.channel.send(new MessageEmbed().setColor('YELLOW').setDescription(`${message.author} has flipped a coin${mention ? ` vs ${mention}` : ''}!`)).catch(()=>{})

    setTimeout(()=>{

      const embed = new MessageEmbed()
        .setAuthor(`Flip coin result: ${win ? 'WON!' : 'LOST'}`)
        .setColor(win ? 'GREEN' : 'RED')
        .setDescription(`Your choice: ${[{a:'h',b:'head',c:'heads',d:'Heads'},{a:'t',b:'tail',c:'tails',d:'Tails'}].find(m=> m.a === choice.toLowerCase() || m.b === choice.toLowerCase() || m.c === choice.toLowerCase()).d}\n\n`)
        .addField(`\u200B`,`You ${win ? 'won' : 'lost'} a flip match against ${mention ? mention : 'me'}!`)
        if (prompt.deleted) return message.channel.send(embed)

        return prompt.edit(embed)

    },5000)

  }
}

module.exports.run =

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
