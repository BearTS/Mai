const { MessageEmbed } = require('discord.js')
const quizProfile = require('../../models/quizProfileSchema')
const easy = require('../../assets/json/quiz/easy.json')
const medium = require('../../assets/json/quiz/medium.json')
const hard = require('../../assets/json/quiz/hard.json')

module.exports = {
  collect: async (data, collector ) => {

    let timeout = setTimeout(()=> collector.stop(), 30000)

    const constructor = ( username, id ) => {
      return {
        name: username,
        id: id,
        score: 0
      }
    }


    return new Promise (resolve => {
      collector.on('collect', async ( r , { username, id } ) => {

        data.push(constructor(username, id))

      })

      collector.on('end', () => {

        resolve(data)

      })
    })
  },
  loadquestionnaire: async (difficulty) => {

    if (difficulty === 'easy') {
      const [ ...questionnaire ] = easy
      return questionnaire
    } else if (difficulty === 'medium') {
      const [ ...questionnaire ] = meduim
      return questionnaire
    } else if (difficulty === 'hard') {
      const [ ...questionnaire ] = hard
      return questionnaire
    } else {
      const [...q1 ] = easy
      const [...q2 ] = medium
      const [...q3 ] = hard
      return questionnaire = q1.concat(q2).concat(q3)
    }

  },
  start: async (questionnaire, message, loadquestionnaire, difficulty, incrementor) => {

    incrementor++

    if (!questionnaire.length) questionnaire = await loadquestionnaire(difficulty)

    question = questionnaire[Math.floor(Math.random() * (questionnaire.length))]

    questionnaire.splice(questionnaire.indexOf(question, 1))

    embed = new MessageEmbed()
    .setAuthor(`Question #${incrementor} • ${question.difficulty}`)
    .setColor('GREY')
    .addField(`Question`, question.question)
    .setFooter(`⏳ Time alloted: ${question.time/1000} seconds. | This Question is submitted by: ${question.createdBy}`)

    if (question.choices && question.choices.length) embed.addField(`Choices`,`\`${question.choices.join('`\n`')}\``)

    if (question.imageURL && question.imageURL !== '') embed.setImage(question.imageURL)

    return { question: embed, qData: question, inc: incrementor }

  },
  save: async (playerData, left, winner, winpoints, lostpoints, message) => {

    let query = []

    await playerData.forEach( ({ id }, index) => query.push(id))

    query = query.concat(left)

    quizProfile.find({ guildID: message.guild.id, userID: query}, async (err, data) => {

      if (!data || data.error) return message.channel.send(`Could not save this session to database.`)

      for ( i = 0; i < query.length; i++) {

        if (!data.some( d => query[i] === d.userID)) await new quizProfile({guildID: message.guild.id, userID: query[i]}).save().then( docu => data.push(docu))

      }

      let p_win = data.find( d => d.userID === winner.id)

      p_win.data.games.won++
      p_win.data.scores.total = p_win.data.scores.total + winpoints
      p_win.data.scores.previous.win = true
      p_win.data.scores.previous.score = winpoints
      message.author.id === winner.id ? p_win.data.games.started ++ : p_win.data.games.joined++

      query.splice(query.indexOf(winner.id), 1)

      query.forEach((id) => {

        let info = data.find( d => d.userID === id)
        message.author.id === id ? info.data.games.started ++ : info.data.games.joined++
        left.includes(id) ? info.data.games.surrendered++ : info.data.games.lost++
        info.data.scores.total = info.data.scores.total - lostpoints > 0 ? info.data.scores.total - lostpoints : 0
        info.data.scores.previous.win = false
        info.data.scores.previous.score = lostpoints

      })

      data.forEach( data => {
        data.save()
      })
    })
  }
}
