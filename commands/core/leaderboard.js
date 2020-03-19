const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
const mongoose = require('mongoose')
const util = require('./../../utils/majUtils.js')

module.exports.run = async (bot, message, args) => {
  mongoose.connection.db.collection("xperiencepoints", function(err, collection){
        collection.find({}).toArray(function(err, leaderBoard){
          leaderBoard = leaderBoard.filter(m=>m.guildID===message.guild.id.toString())
          leaderBoard.sort(function(a,b) {
              return ((b.xp) - (a.xp));
          });
          var x;
          var name = '';
          var xp = '';
          const length = (leaderBoard.length < 10) ?  leaderBoard.length : 9;
          for (x=0;x<length;x++){
          name +=  `${(x===0) ? '🥇 - ' : (x===1) ? '🥈 - ' : (x===2) ? '🥉 - ' : '#'+(x+1)+" - "} <@${leaderBoard[x].userID}>\n\n`
          xp += "**"+ util.commatize(leaderBoard[x].xp) + "**XP\n\n"
          }
          const userRank = leaderBoard.findIndex(item => item.userID === message.author.id)
            const lb = new RichEmbed()
            .setAuthor(`🏆 ${message.guild.name} Leaderboard`)
            .setDescription(`<@${leaderBoard[0].userID}> ranked the highest with **${util.commatize(leaderBoard[0].xp)+"**XP!\n\n"}`)
            .setColor(settings.colors.embedDefault)
            .addField(`User`,name,true)
            .addField(`XP`,xp,true)
            .setFooter(`You ranked ${util.ordinalize(userRank+1)} overall!`);
          return message.channel.send(lb).catch(console.error)
          }
        )}
      )
    }

module.exports.help = {
	name: "leaderboard",
  aliases:["lb","top"],
	group: 'core',
	description: 'Shows the top xp earners for this server',
	examples: ['leaderboard','lb','top'],
	parameters: []
}
