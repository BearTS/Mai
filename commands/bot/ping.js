const { MessageEmbed } = require('discord.js');
const { duration } = require('moment');
const text = require('../../util/string');

module.exports = {
  name: 'ping',
  aliases: [ 'latency' ],
  group: 'bot',
  description: 'Display various pings this bot is connected to.',
  clientPermissions: [ 'EMBED_LINKS' ],
  parameters: [],
  examples: [
    'ping',
    'latency'
  ],
  run: async (client, message) => {

    const prompt = await message.channel.send('Pinging...');

    const ping = await client.pings.evaluate({
      force: false, // To forcively reevaluate the ping
    });

    ping.message = {success: Math.abs(prompt.createdTimestamp - message.createdTimestamp)};

    const update = ping.lastUpdatedAt.getTime() + ping.timeout - Date.now();

    const data = client.pings.handlers.slice(0,20).map((h,i) => {
      if (h.name === 'discord'){
        return {[h.name]: client.pings.discord}
      } else if (typeof ping[h.name]?.error === 'number'){
        return {[h.name]: ping[h.name].error === 0 ? 'TIMEOUT' : `HTTP(${ping[h.name].error})`}
      } else {
        return {[h.name]: ping[h.name]?.success }
      };
    });

    const embed = new MessageEmbed()
    .setColor('GREY')
    .setAuthor('Ping information\n',client.user.displayAvatarURL())
    .setDescription([
      'Hover on the hyperlink to view more information.\nPings are evaluated once every',
      duration(client.pings.timeout, 'milliseconds').format('m [minutes]') + '.\n',
      update < 1 ? 'Re-valuating... (Please use this command again for updated results).'
      : `Re-evaluates in ${duration(update, 'milliseconds').format(' m [minutes and] s [seconds]')}.`
    ].join(' '))
    .addFields(client.pings.handlers.slice(0,20).map((handler, index) => {
      return {
        name: '\u200b', inline: true,
        value: [
          `╭═[**${handler.registry}**](https://discord.com/ '`,
          `${text.truncate(handler.description || '', 200)}')\n${colors(data.find(x => Object.keys(x).includes(handler.name))[handler.name])}\u2000\u2000\n`,
          `╰═══${stylize(data.find(x => Object.keys(x).includes(handler.name))[handler.name])}`
        ].join('')
      }
    })
  ).addField('\u200b', `*“${response()}”*`)
  .setFooter(`Pings | \©️${new Date().getFullYear()} Mai`);

    return await prompt.edit('',embed).catch(() => null) || message.channel.send(embed);
  }
};

function response(){
  const responses = [
    'I-It\'s not like I wanted to say pong or anything...',
    'Pong...',
    'Woo! A secret command!',
    'Ping! ...I mean **pong!**',
    'Does anyone even use this?',
    'At your service!',
    'Testing, testing, 1, 2, 3!'
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

function colors(num){
  num = parseInt(num);
  if (isNaN(num)){
    return '<:emptybar:767062499744284732>'.repeat(5)
  };
  const emojis = [
    '<:lvl1bar:767062466517270578>',
    '<:lvl2bar:767062472527183875>',
    '<:lvl3bar:767062479439265848>',
    '<:lvl4bar:767062487174348823>',
    '<:level5bar:767062493653893121>'
  ];
  const limits = [ 1500, 1250, 750, 500, 250 ];
  return emojis.map((_,i) => {
    if (i === 0){
      return _;
    } else if (num < limits[i]){
      return _;
    } else return '<:emptybar:767062499744284732>';
  }).join('')
};

function stylize(ping){
  if (typeof ping === 'number'){
    ping = ping + ' ms'
  } else {
    ping = ping
  };
  return `\`${' '.repeat(11 - ping.length)}${ping}\``
};
