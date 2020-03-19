const {RichEmbed,Attachment} = require("discord.js");
const settings = require("./../../botconfig.json");
const xpSchema = require('./../../models/xpSchema.js')
const util = require('./../../utils/majUtils.js')
const Canvas = require('canvas')
const mongoose = require('mongoose')
const imager = require('./../../utils/xpSystem/imager.js')

module.exports.run = (bot,message,args) =>{
if (!message.mentions.members.first()){
xpSchema.findOne({
  guildID: message.guild.id,
  userID: message.author.id,
},(err,xpData)=>{
  if (!xpData){
    const registered = new xpSchema({
      guildID: message.guild.id,
      userID: message.author.id,
      xp: 0,
      level: 1
    })
  return registered.save().then(()=>{return message.react('👎')}).catch(()=>{return message.react('👎')})
  }
  let level = xpData.level;
  let xp = xpData.xp;
  let mlvlcap = 150 * (xpData.level * 2);
  let maxXPThisLevel = (level * mlvlcap) - ((level-1) * (150*(level-1)*2));
  let curXPThisLevel = xp - ((level-1) * (150*(level-1)*2));
  let percentage = Math.round((curXPThisLevel / maxXPThisLevel) * 100)
  let rank = '';
  mongoose.connection.db.collection('xperiencepoints',function(err,collection){
    collection.find({}).toArray(function(err,rankings){
      rankings = rankings.filter(m=>m.guildID===message.guild.id.toString())
      rankings.sort(function(a,b){
        return (b.xp-a.xp)
      })
      let wreath = ''
      const wreaths = ['https://i.imgur.com/xsZHQcW.png','https://i.imgur.com/NmpP8oU.png','https://i.imgur.com/bzhoYpa.png','https://i.imgur.com/NSEbnek.png']
      let indexer = rankings.findIndex(item=>item.userID===message.author.id.toString())
      rank = util.ordinalize(rankings.findIndex(item=>item.userID===message.author.id.toString())+1)
      if (indexer<4){
        wreath = wreaths[indexer]
      } else if (indexer>3) {
        if (indexer<10) {
          wreath = wreaths[3]
        } else {
          wreath = false;
        }
      }
      let member = message.member;
      let author = message.author;
      return  imager(message,member,author,level,xp,mlvlcap,maxXPThisLevel,curXPThisLevel,percentage,rank,wreath)
    })
  })
})} else {
  mongoose.connection.db.collection('xperiencepoints',function(err,collection){
    collection.find({}).toArray(function(err,rankings){
      rankings = rankings.filter(m=>m.guildID===message.guild.id.toString())
      rankings.sort(function(a,b){
        return (b.xp-a.xp)
      })
      let xpData = rankings.filter(m=>m.userID===message.mentions.members.first().id)
      if (xpData.length<1) return message.react('👎')
      let level = xpData[0].level;
      let xp = xpData[0].xp;
      let mlvlcap = 150 * (xpData[0].level * 2);
      let maxXPThisLevel = (level * mlvlcap) - ((level-1) * (150*(level-1)*2));
      let curXPThisLevel = xp - ((level-1) * (150*(level-1)*2));
      let percentage = Math.round((curXPThisLevel / maxXPThisLevel) * 100)
      let rank = '';
      let wreath = ''
      const wreaths = ['https://i.imgur.com/xsZHQcW.png','https://i.imgur.com/NmpP8oU.png','https://i.imgur.com/bzhoYpa.png','https://i.imgur.com/NSEbnek.png']
      let indexer = rankings.findIndex(item=>item.userID===message.mentions.members.first().id.toString())
      rank = util.ordinalize(rankings.findIndex(item=>item.userID===message.mentions.members.first().id.toString())+1)
      if (indexer<4){
        wreath = wreaths[indexer]
      } else if (indexer>3) {
        if (indexer<10) {
          wreath = wreaths[3]
        } else {
          wreath = false;
        }
      }
      let member = message.mentions.members.first();
      let author = message.mentions.members.first().user;
      return  imager(message,member,author,level,xp,mlvlcap,maxXPThisLevel,curXPThisLevel,percentage,rank,wreath)
    })
  })
}

}
module.exports.help = {
  name: "rank",
  aliases: ['lvl','level','xp'],
	group: 'core',
	description: 'Shows the current xp, level, and rank of a user from the server if mentioned, or returns the data of the sender when none is mentioned.',
	examples: ['rank','lvl @Sakurajimai', 'level @Sakurajimai'],
	parameters: ['user mention']
}
