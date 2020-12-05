const Badwords = require('bad-words');
const badWords = new Badwords();
const eightball = [
  'It is certain.'
  , 'It is decidedly so.'
  , 'Without a doubt.'
  , 'Yes - definitely.'
  , 'You may rely on it.'
  , 'As I see it, yes.'
  , 'Most likely.'
  , 'Outlook good.'
  , 'Yes.'
  , 'Signs point to yes.'
  , 'Reply hazy, try again.'
  , 'Ask again later.'
  , 'Better not tell you now.'
  , 'Cannot predict now.'
  , 'Concentrate and ask again.'
  , 'Don\'t count on it.'
  , 'My reply is no.'
  , 'My sources say no.'
  , 'Outlook not so good.'
  , 'Very doubtful.'
];

module.exports = {
  name: '8ball',
  aliases: [ '🎱', '8b', '8-ball', 'eightball' ],
  group: 'fun',
  description: 'Ask anything on the magic 8-ball',
  parameters: [ 'Question answerable by Yes/No' ],
  get examples(){
    return [
      'Is mai a good bot?', 'Is FMA worth of it\'s top spot?',
      'Is BNHA good?', 'Do you want to play Among Us?',
      'Have you been in a thight spot before?'
    ].map((x,i) => [this.name, ...this.aliases][i] + ' ' + x)
  },
  run: (client, message, args) => {

    if (!args.length){
      return message.channel.send(`Ask me anything...`, { replyTo: message})
    };

    if (badWords.isProfane(message.content)){
      return message.channel.send(`I can't reply to question with something profane on it..`, { replyTo: message })
    };

    const response = eightball[Math.floor(Math.random() * eightball.length)];

    return message.channel.send(response, { replyTo: message });
  }
};
