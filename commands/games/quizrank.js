const { MessageEmbed } = require('discord.js')
const quizProfile = require('../../models/quizProfileSchema')
const { commatize, ordinalize } = require('../../helper.js')

module.exports = {
  config: {
    name: 'quizrank',
    aliases: [],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: 'games',
    description: 'View your standing on quiz',
    examples: [],
    parameters: []
  },
  run: async ( client, message, args ) => {

    let data = await quizProfile.findOne({guildID: message.guild.id, userID: message.author.id}).catch(()=>{})

    if (data === undefined) return message.channel.send(error('~Could not connect to database~'))

    if (data === null) data = await new quizProfile({guildID: message.guild.id, userID: message.author.id}).save()

    const { data: { games: { started, joined, won, lost, surrendered }, scores: { previous: { win, score }, total } } } = data

    let rankings = await quizProfile.find({guildID: message.guild.id}).catch(()=>{})

    if (rankings) rankings.sort( (a, b) => b.data.scores.total - a.data.scores.total)

    message.channel.send( new MessageEmbed()
      .setColor('GREY')
      .setThumbnail(getBadge(total))
      .setTitle(message.member.displayName)
      .setDescription(getRank(total))
      .addField('\u200B','\u200B')
      .addField('Games Started', `${commatize(started)} games.`,true)
      .addField('Games Joined',`${commatize(joined)} games.`,true)
      .addField('Games Won',`${commatize(won)} games.`, true)
      .addField('Win Rate', `${started + joined ? `${(100 * (won / ( started + joined))).toFixed(2)}%` : '0%' }`,true)
      .addField('Games Surrendered', `${commatize(surrendered)} games.`,true)
      .addField('Games Lost', `${commatize(lost)} games.`,true)
      .addField('Previous Match', started + joined ? win ? `Won ${score} points.` : `Lost ${score} points.` : `Not yet Started`, true)
      .addField('Server Rank', rankings ? ordinalize(rankings.findIndex( i => i.userID == message.author.id) + 1 ) : 'Unavailable', true)
    )
  }
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
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
