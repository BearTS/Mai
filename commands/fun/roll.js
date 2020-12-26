const text = require(`${process.cwd()}/util/string`);

module.exports = {
  name: 'roll',
  aliases: [],
  group: 'fun',
  description: 'Generate a random number from 1-[selected number]',
  get examples(){ return [this.name, ...this.aliases].map(x => x + ' ' + '<num>')},
  run: (client, message, [tail]) => {

    const rand = Math.random();
    tail = Math.round(tail) || Math.round(Math.random() * 999) + 1;

    return message.channel.send(`**${text.commatize(rand * tail)}** ---> [0 -> ${text.commatize(tail)}]`)
  }
};
