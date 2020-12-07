const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const moment = require('moment');

module.exports = {
  name: 'time',
  aliases: [ 'clock' ],
  group: 'utility',
  description: 'Shows the time for the given location!',
  parameters: [ 'query<city>' ],
  get examples(){ return [this.time, ...this.aliases].map(x => x + ' [city]');},
  run: async (client, message, args) => {

    const location = args.join(' ') || 'Tokyo';

    const res = await fetch(`https://time.is/${location}`)
    .then(res => res.text()).catch(()=>{})

    if (!res) {
      return message.channel.send(`\\❌ The Time.is API did not respond. Please report this to the bot owner. The API might be down or there might be changes on the API itself.`);
    };

    try {

    const [ latitude, longitude ] = JSON.parse(res.match(/\[(\d{1,3}.\d{1,7},\d{1,3}.\d{1,7})\]/gi)[0]);
    const [ loc ] = res.match(/(?<=name:\")([\w\d\s]{1,})?,?\s*([\w\d\s]{1,})?,?([\w\d\s]{1,})\"/gi);
    const [ time ] = res.match(/(\d{1,2}):(\d{1,2}):(\d{1,2}[\s+apm]{2,}|\d{1,2})/gi);
    const [ weekday, month, day, year ] = res.match(/(\w{1,9}),\s(\w{1,12})\s(\d{1,2}),\s(\d{4})/gi)[0].replace(/,/g,'').split(' ');
    const [ sunrise, sunset, daylength, solarnoon ] = res.match(/(?<=(\w{1,10}\s\w{1,10}|\w{1,10}):\s+)(\d{2}|\d{2}h)(:|\s+)(\d{1,2}m|\d{1,2})/gi);
    const info = res.match(/(the\s+current\s+local\s+time\s+in\s+([a-z\s]*)+\s+is\s+\d+\s+(minutes*)\s+(ahead\s+of|behind)\s+apparent\s+solar\s+time.)/gi)[0];

    return message.channel.send(
      new MessageEmbed()
      .setColor('GREY')
      .setFooter(`Time  | \©️${new Date().getFullYear()} Mai`)
      .setAuthor(`Time.is`,'https://files.catbox.moe/5iolld.png','https://time.is')
      .setTitle(`${moment(time, 'HH:mm:ss').format('h:mm:ss A')}`)
      .setURL(`https://time.is/${encodeURI(location)}`)
      .setDescription(`in **${loc.substr(0,loc.length-1)}**\n*${weekday}, ${month} ${day}, ${year}*\nCoordinates: [lat: ${latitude}, long: ${longitude}]*\n\n`)
      .addFields([
        { name: 'Sunrise', value: moment(sunrise, 'HH:mm').format('h:mm A'), inline: true },
        { name: 'Sunset', value: moment(sunset, 'HH:mm').format('h:mm A'), inline: true },
        { name: 'Day length', value: moment.duration(daylength).format('H [hours and] m [minutes]'), inline: true },,
        { name: '\u200b', value: info }
      ])
    );
  } catch (err) {
    return message.channel.send(`\\❌ An unexpected error occured: ${err.stack}`);
  };
}
};
