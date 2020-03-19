const quizProfile = require('./../../models/quizProfileSchema.js')
const settings = require("./../../botconfig.json");
const util = require('./../../utils/majUtils.js')
const mongoose = require('mongoose')
const {RichEmbed} = require('discord.js')

module.exports.run = (bot,message,args) => {
  if (!message.mentions.members.first()){
    quizProfile.findOne({
      id: message.author.id,
      guildID: message.guild.id
    }, (err,profile) => {
      if (err) return console.log(`Warning: failed to connect to database @ quizProfile`)
      if (!profile){
        const newProfile = new quizProfile({
          user: message.author.username,
          id: message.author.id,
          guildID: message.guild.id,
          data: {
            games: {
              started: 0,
              joined: 0,
              won: 0,
              lost: 0,
              surrendered: 0
            },
            scores:{
              total: 0,
              previous: {
                win: false,
                score: 0
              }
            }
          }
        })
        return newProfile.save()
      }
      mongoose.connection.db.collection('quizprofiles',function(err,collection){
        collection.find({}).toArray(function(err,rankings){
          rankings = rankings.filter(m=>m.guildID===message.guild.id.toString())
          rankings.sort(function(a,b){
            return (b.data.scores.total - a.data.scores.total)
          })
          const embed = new RichEmbed()
          .setThumbnail(getBadge(profile.data.scores.total))
          .setColor(settings.colors.embedDefault)
          .setTitle(message.member.displayName)
          .setDescription(`${getRank(profile.data.scores.total)}`)
          .addBlankField()
          .addField(`Games Started`,`${util.commatize(profile.data.games.started)} games.`,true)
          .addField(`Games Joined`,`${util.commatize(profile.data.games.joined)} games.`,true)
          .addField(`Games Won`,`${util.commatize(profile.data.games.won)} games.`,true)
          .addField(`Win Rate`,`${roundTo(((profile.data.games.started+profile.data.games.joined)===0) ? '0' : ((profile.data.games.won / (profile.data.games.started+profile.data.games.joined))*100),2)} %`,true)
          .addField(`Games Surrendered`,`${util.commatize(profile.data.games.surrendered)} games.`,true)
          .addField(`Games Lost`,`${util.commatize(profile.data.games.lost)} games.`,true)
          .addField(`Previous Match`,`${(profile.data.games.started===0) ? `Not Yet Started` : (profile.data.scores.previous.win) ? `Won ${profile.data.scores.previous.score} Points` : `Lost ${profile.data.scores.previous.score} Points`}`,true)
          .addField(`Total Points`,util.commatize(profile.data.scores.total),true)
          .addField(`Server Rank`,util.ordinalize(rankings.findIndex(item=>item.id===message.author.id.toString())+1),true)
        return  message.channel.send(embed)
        })
  })
})
} else {
  quizProfile.findOne({
    id: message.mentions.members.first().id,
    guildID: message.guild.id
  }, (err,profile) => {
    if (err) return console.log(`Warning: failed to connect to database @ quizProfile`)
    if (!profile){
      const newProfile = new quizProfile({
        user: message.mentions.members.first().user.username,
        id: message.mentions.members.first().id,
        guildID: message.guild.id,
        data: {
          games: {
            started: 0,
            joined: 0,
            won: 0,
            lost: 0,
            surrendered: 0
          },
          scores:{
            total: 0,
            previous: {
              win: false,
              score: 0
            }
          }
        }
      })
      return newProfile.save()
    }
    mongoose.connection.db.collection('quizprofiles',function(err,collection){
      collection.find({}).toArray(function(err,rankings){
        rankings = rankings.filter(m=>m.guildID===message.guild.id.toString())
        rankings.sort(function(a,b){
          return (b.data.scores.total - a.data.scores.total)
        })
        const embed = new RichEmbed()
        .setThumbnail(getBadge(profile.data.scores.total))
        .setColor(settings.colors.embedDefault)
        .setTitle(message.mentions.members.first().displayName)
        .setDescription(`${getRank(profile.data.scores.total)}`)
        .addBlankField()
        .addField(`Games Started`,`${util.commatize(profile.data.games.started)} games.`,true)
        .addField(`Games Joined`,`${util.commatize(profile.data.games.joined)} games.`,true)
        .addField(`Games Won`,`${util.commatize(profile.data.games.won)} games.`,true)
        .addField(`Win Rate`,`${((profile.data.games.started+profile.data.games.joined)===0) ? '0' : ((profile.data.games.won / (profile.data.games.started+profile.data.games.joined))*100)} %.`,true)
        .addField(`Games Surrendered`,`${util.commatize(profile.data.games.surrendered)} games.`,true)
        .addField(`Games Lost`,`${util.commatize(profile.data.games.lost)} games.`,true)
        .addField(`Previous Match`,`${((profile.data.games.started===0)||(profile.data.games.joined===0)) ? `Not Yet Started` : (profile.data.scores.previous.win) ? `Won ${profile.data.scores.previous.score} Points` : `Lost ${profile.data.scores.previous.score} Points`}`,true)
        .addField(`Total Points`,util.commatize(profile.data.scores.total),true)
        .addField(`Server Rank`,util.ordinalize(rankings.findIndex(item=>item.id===message.mentions.members.first().id.toString())+1),true)

        return message.channel.send(embed)
      })
  })
  })
}


}

module.exports.help = {
  name: "quizrank",
  aliases: [],
	group: 'core',
	description: 'Shows the top quiz players for this server',
	examples: ['quizrank'],
	parameters: []
}


function getRank(score){
  if (score<101) return 'Unranked'
  if ((score>100)&&(score<201)) return 'Bronze I - Possessing Yoshiko\'s Intellect'
  if ((score>200)&&(score<351)) return 'Bronze II - Possessing Astarea\'s Intellect'
  if ((score>350)&&(score<601)) return 'Bronze III - Possessing Misa\'s Intellect'
  if ((score>600)&&(score<901)) return 'Silver I - Posessing Kagura\'s Intellect'
  if ((score>900)&&(score<1501)) return 'Silver II - Posessing Yuuko\'s Intellect'
  if ((score>1500)&&(score<2001)) return 'Silver III - Posessing Yui\'s Intellect'
  if ((score>2000)&&(score<3001)) return 'Gold I - Posessing Aqua\'s Intellect'
  if ((score>3000)&&(score<4251)) return 'Gold II - Posessing Victorique\'s Intellect'
  if ((score>4250)&&(score<5751)) return 'Gold III - Posessing Tanya\'s Intellect'
  if ((score>5750)&&(score<7001)) return 'Platinum I - Posessing Demiurge\'s Intellect'
  if ((score>7000)&&(score<10001)) return 'Platinum II - Posessing Shuvi\'s Intellect'
  if ((score>10000)&&(score<15001)) return 'Platinum III -Possessing Narsus\'s Intellect'
  if ((score>15000)&&(score<25001)) return 'Diamond III - Posessing Makise\'s Intellect'
  if ((score>25000)&&(score<36001)) return 'Diamond II'
  if ((score>36000)&&(score<48001)) return 'Diamond I'
  if ((score>48000)&&(score<60001)) return 'God'
  if ((score>60000)) return '???'
}

function getBadge(score){
  if (score<101) return 'https://i.imgur.com/place.png'
  if ((score>100)&&(score<201)) return 'https://i.imgur.com/xFvFBxv.png'
  if ((score>200)&&(score<351)) return 'https://i.imgur.com/evhpgMx.png'
  if ((score>350)&&(score<601)) return 'https://i.imgur.com/Hmnz6y5.png'
  if ((score>600)&&(score<901)) return 'https://i.imgur.com/GNK9Vcm.png'
  if ((score>900)&&(score<1501)) return 'https://i.imgur.com/7Fo1DwP.png'
  if ((score>1500)&&(score<2001)) return 'https://i.imgur.com/Fw6A4wa.png'
  if ((score>2000)&&(score<3001)) return 'https://i.imgur.com/pQll6q4.png'
  if ((score>3000)&&(score<4251)) return 'https://i.imgur.com/dewEdEP.png'
  if ((score>4250)&&(score<5751)) return 'https://i.imgur.com/xwALRQd.png'
  if ((score>5750)&&(score<7001)) return 'https://i.imgur.com/pXNffUG.png'
  if ((score>7000)&&(score<10001)) return 'https://i.imgur.com/PoFfzSE.png'
  if ((score>10000)&&(score<15001)) return 'https://i.imgur.com/MQOozlc.png'
  if ((score>15000)&&(score<25001)) return 'https://i.imgur.com/place.png'
  if ((score>25000)&&(score<36001)) return 'https://i.imgur.com/place.png'
  if ((score>36000)&&(score<48001)) return 'https://i.imgur.com/place.png'
  if ((score>48000)&&(score<60001)) return 'https://i.imgur.com/place.png'
  if ((score>60000)) return 'https://i.imgur.com/place.png'
}


function roundTo(n, digits) {
    var negative = false;
    if (digits === undefined) {
        digits = 0;
    }
        if( n < 0) {
        negative = true;
      n = n * -1;
    }
    var multiplicator = Math.pow(10, digits);
    n = parseFloat((n * multiplicator).toFixed(11));
    n = (Math.round(n) / multiplicator).toFixed(2);
    if( negative ) {
        n = (n * -1).toFixed(2);
    }
    return n;
}
