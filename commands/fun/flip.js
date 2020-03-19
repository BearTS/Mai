const Discord = require("discord.js");
const settings = require('./../../botconfig.json');


module.exports.run = async (bot, message, args) => {
let mentioned = message.mentions.members.first();
let choice = (mentioned) ? args.join('').replace(`<@!${mentioned.id}>`,'').replace(' ','').toUpperCase() : args.join('').toUpperCase()
const head = ["HEAD! ", "TAIL! "];
const tail = ["TAIL! ", "HEAD! "];

if (!(choice === 'HEAD'|| choice === 'TAIL')) return message.channel.send(`Please select only head or tail.`)

const colorflip = ["0x28e927", "0xeb1a1a"];
var flip_rand = Math.floor(Math.random()*100)%2
const mention_result = ["Lost.", "Won."];
const author_result = [ "Won.", "Lost."];

if (!mentioned){
				if (choice==='HEAD'){
					message.channel.send(message.author + " has flipped a coin.").then(msg => {
            setTimeout(function(){
              const flipEmbed = new Discord.RichEmbed()
              .setColor(colorflip[flip_rand])
              .setDescription(message.member + ": " + author_result[flip_rand])
              .setTitle("Flip Coin result: " + head[flip_rand])
              .setFooter(`${bot.user.username} vs ${message.member.displayName} `);
              if (!msg.deleted) {
                msg.edit(flipEmbed)
              } else message.channel.send(flipEmbed)
            }, 3000);
          });
				}else if (choice==='TAIL'){
					message.channel.send(message.author + " has flipped a coin.").then(msg=>{
            setTimeout(function(){
  						const flipEmbed = new Discord.RichEmbed()
  						.setColor(colorflip[flip_rand])
  						.setDescription(message.author + ": " + author_result[flip_rand])
  						.setTitle("Flip Coin result: " + tail[flip_rand])
  						.setFooter(`${bot.user.username} vs ${message.member.displayName}`);
              if (!msg.deleted) {
                msg.edit(flipEmbed)
              } else message.channel.send(flipEmbed)
  					}, 3000);
          })
        }
			}
else if(mentioned){
				if (choice==='HEAD'){
					message.channel.send(message.author + " has flipped a coin.\n" + message.author + ": Head.\n" + mentioned + ": Tail.").then(msg=>{
            setTimeout(function(){
              const flipEmbed = new Discord.RichEmbed()
              .setColor(colorflip[flip_rand])
              .setDescription(message.author + ": " + author_result[flip_rand] + "\n" + mentioned + ": " + mention_result[flip_rand])
              .setTitle("Flip Coin result: " + head[flip_rand])
              .setFooter(`${mentioned.displayName} vs ${message.member.displayName}`);
              if (!msg.deleted) {
                msg.edit(flipEmbed)
              } else message.channel.send(flipEmbed)
            }, 3000);
          });
				}else if (choice==='TAIL'){
					message.channel.send(message.author + " has flipped a coin.\n" + message.author + ": Tail.\n" + mentioned + ": Head.").then(msg=>{
            setTimeout(function(){
              const flipEmbed = new Discord.RichEmbed()
              .setColor(colorflip[flip_rand])
              .setDescription(message.author + ": " + author_result[flip_rand] + "\n" + mentioned + ": " + mention_result[flip_rand])
              .setTitle("Flip Coin result: " + tail[flip_rand])
              .setFooter(`${mentioned.displayName} vs ${message.member.displayName}`);
              if (!msg.deleted) {
                msg.edit(flipEmbed)
              } else message.channel.send(flipEmbed)
            }, 3000);
          });
				}
			}
}

module.exports.help = {
  name: "flip",
  aliases: ["coinflip","coin","tosscoin",'tc'],
	group: 'fun',
	description: 'Win or Lose, Flip a Coin',
	examples: ['flip','tc @Sakurajimai'],
	parameters: ['user mention']
}
