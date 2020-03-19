const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');

module.exports.run = (bot, message, args) => {
  if (args.length===0){
    message.channel.send(`**${message.member.displayName}** rolled a Die...`).then(msg=>{
      setTimeout(()=>{
        result = `**${message.member.displayName}** rolled a **${Math.floor(Math.random()*5)+1}**! :game_die::game_die:`
        if (!msg.deleted){
          msg.edit(result)
        }else{
          message.channel.send(result)
        }
      },5000)
    })
  } else {
    let num = args.join('')
    if (isNaN(num)){
        message.channel.send(`**${message.member.displayName}** rolled a Die...`).then(msg=>{
          setTimeout(()=>{
            result = `**${message.member.displayName}** rolled a **${Math.floor(Math.random()*5)+1}**! :game_die::game_die:`
            if (!msg.deleted){
              msg.edit(result)
            }else {
              message.channel.send(result)
            }
          },5000)
        })
    } else {
        num = (num<11) ? num : 10;
        message.channel.send(`**${message.member.displayName}** rolled ${num} Dice...`).then(msg=>{
          setTimeout(()=>{
            let results = []
            for (i=0;i<num;i++){
              results.push(Math.floor(Math.random()*5)+1)
            }
            result = `**${message.member.displayName}** rolled **${results.join(', ')}**! :game_die::game_die:`
            if (!msg.deleted){
              msg.edit(result)
            }else {
              message.channel.send(result)
            }
          },5000)
        })
    }
  }
}

module.exports.help = {
  name: 'roll',
  aliases:["dice"],
	group: 'fun',
	description: 'Roll a die or dice.',
	examples: ['roll 1','dice 10'],
	parameters: ['number of dice']
}
