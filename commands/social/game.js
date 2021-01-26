const { Collection } = require('discord.js');
const { duration: momdur } = require('moment');
const { readdirSync } = require('fs');
const { join } = require('path');

const text = require('../../util/string');
const profile = require('../../models/Profile');

const files = readdirSync(join(__dirname, '../../util/games'));
const jsfiles = files.filter(ext => ext.split('.').pop() === 'js');

const games = jsfiles.map(x => {
  return { [x.split('.')[0]]: require(`../../util/games/${x}`)};
});

module.exports = {
  name: 'game',
  aliases: [],
  database: true,
  group: 'social',
  clientPermissions: [ 'EMBED_LINKS', 'ATTACH_FILES' ],
  description: 'Play some games to earn credits.',
  parameters: [ 'game title' ],
  requiresDatabase: true,
  examples: [
    'game captcha'
  ],
  run: (client, message, [ title, ...args]) => profile.findById(message.author.id, (err, doc) => {

    const categories = text.joinArray(jsfiles.map(x => x.split('.')[0]));

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc || doc.data.economy.wallet === null){
      return message.channel.send(`\\❌ **${message.author.tag}**, register first before playing a game!`);
    } else if (!title){
      return message.channel.send(`\\❌ **${message.author.tag}**, please provide the game you want to play.\n\n${categories}`);
    };

    const playGame = games.find(x => x[title])?.[title];

    if (!playGame){
      return message.channel.send(`\\❌ **${message.author.tag}**, ${title} isn't a playable game. Please select from one below:\n\n${categories}`);
    };

    const now = Date.now();
    const duration = Math.floor(Math.random() * 72e5) + 36e5;
    const collection = client.collections.economy.get(title) || client.collections.economy.set(title, new Collection()).get(title);
    const userprofile = collection.get(message.author.id) || collection.set(message.author.id, { date: 0 }).get(message.author.id);
    const momentduration = momdur(userprofile.date - Date.now()).format('H [hours,] m [minutes, and] s [seconds]');

    if (userprofile.date > now){
      return message.channel.send(`\\❌ **${message.author.tag}**, please wait \`${momentduration}\` before playing **${title}** again.`);
    };

    userprofile.date = Date.now() + duration;

    const options = {
      client,
      message,
      title,
      args,
      doc
    };

    return playGame(options);
  })
};
