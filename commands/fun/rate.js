const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');

module.exports.run = async (bot, message, args) => {

// if (args.length<1) return message.channel.send('Please specify something for me or the other curators to rate!');
// let item = args.join(" ").replace(args.includes(availableCurators.find()));
// let mentioned = message.mentions.members.first();
// const rating = Math.floor(Math.random() * 9) + 1;
// const availableCurators = [
//     {
//       name: 'Fujiwara Chikka',
//       search: ['chikka','chikka fujiwara','fujiwara-san','fujiwara chikka'],
//       avatar: "https://i.imgur.com/DxpoQDk.png",
//       responses: [
//         `Making me rate **${item}**, is this a joke?`
//         `Aree! Aree! Aree! I hate this **${item}**`,
//         `Your **${item}** don't deserve to be viewed by my dazzling eyes`,
//         `I wonder if i could sell this **${item}** for at least $0.01, or maybe not.`,
//         `Average, perhaps?`,
//         `I'd say good!`,
//         `It's better than the weiner Miyuki gave me last day.`,
//         `I like **${item}**.`
//         `Sugoiii! I love it! Can I have it?`,
//         `I'd sell everything for **${item}**!`
//       ]
//     }
// ]
//
// if (mentioned) return message.channel.send(`I'll rate him/her a ${rating}/10`);
//
//
//         if (!item) return message.channel.send('Please specify something for me to rate!');
//
//         if (item.toUpperCase().startsWith(bot.user.username.toUpperCase())) return message.channel.send('I\'d give myself a 10/10!');
//
// const rms = [
//   `Get that ${item}-whatever out of here!`,//0
//   `I wonder why such item like ${item} exists`,//1
//   `So you brought me a junky **${item}**, huh?`,//2
//   `I wonder how will ${item} cost on a junk shop.`,//3
//   `But that doesn't mean I like it.`,//4
//   `Cause it's probably has to be that way.`,//5
//   `Oh, you brought me good stuff, but ${item} is not what i'm looking for.`,//6
//   `Is ${item} the new trend now? I kinda like it *a little*.`,//7
//   `Is ${item} available on steam?`,//8
//   `I like this one`,//9
//   `I could buy this ${item} for 1 million!`//10
// ];
//   const embed = new Discord.RichEmbed().setColor('#887064').setDescription(`I'd give **${item}** a rating of ${rating}/10!\n\n${rms[rating]}`).setFooter(`${bot.user.username} | Rate this.`);
//
//         return message.channel.send({embed:embed}).catch(console.error);
//
//
}

module.exports.help = {
        name: "rate",
        aliases: [],
      	group: 'fun',
      	description: 'Rates a specific object',
      	examples: ['rate banana','rate me'],
      	parameters: ['query']
      }
