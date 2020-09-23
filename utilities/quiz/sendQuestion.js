const { MessageEmbed } = require('discord.js')

module.exports = (options) => {

  const question = options.questions[Math.floor(Math.random() * options.questions.length)]
  console.log(`Before Question Length: ${options.questions.length}`)
  options.questions.splice(options.questions.indexOf(question),1)
  console.log(`After Question Length: ${options.questions.length}`)
  const embed = new MessageEmbed()
  .setAuthor(`Question #${options.questionNumber} • ${question.difficulty}`)
  .setColor('GREY')
  .addField(`Question`, question.question)
  .setFooter(`⏳ Time alloted: ${question.time/1000} seconds. | This Question is submitted by: ${question.createdBy}`)

  if (question.choices && question.choices.length) embed.addField(`Choices`,`\`${question.choices.join('`\n`')}\``)

  if (question.imageURL && question.imageURL !== '') embed.setImage(question.imageURL)

  options.questionNumber++

  return options.message.channel.send(embed)
            .then((message) =>  [question, options.questionNumber, message] )

}
