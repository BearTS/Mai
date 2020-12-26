const { MessageEmbed, version: discord_version } = require('discord.js');
const { version, author } = require(`${process.cwd()}/package.json`);
const { createCanvas, loadImage } = require('canvas');
const { release, cpus } = require('os');
const moment = require('moment');

const text = require(`${process.cwd()}/util/string`);
const MemoryLimit = 512; // Heroku only allows maximum of 512MB memory usage, change when changing hosting provider.

module.exports = {
  name: 'stats',
  aliases: [ 'status', 'botstatus' ],
  group: 'bot',
  description: 'Displays the status of the current bot instance.',
  clientPermissions: [ 'EMBED_LINKS', 'ATTACH_FILES' ],
  parameters: [],
  get examples(){ return [ this.name, ...this.aliases ]},
  run: async (client, message) => {

    const { heapUsed, heapTotal } = process.memoryUsage();

    const messages_cached = client.channels.cache
    .filter(x => x.send )
    .reduce((m, c) => m + c.messages.cache.size, 0);

    const canvas = createCanvas(400,250);
    const ctx = canvas.getContext('2d');
    const avatar = await loadImage(client.user.displayAvatarURL({ format: 'png', size: 64 }));

    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(canvas.width,0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(canvas.width,0);
    ctx.lineTo(canvas.width,80);
    ctx.lineTo(0,80);
    ctx.closePath();
    ctx.fillStyle = 'rgb(48, 4, 110)';
    ctx.fill();

    ctx.drawImage(avatar,20,20,50,50);
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.font = 'bold 10px sans-serif'
    ctx.fillText(`OS: ${process.platform} v${release}`, canvas.width - 10, 20, 100);
    ctx.fillText(`Node ${process.version}`, canvas.width - 10, 35, 100);
    ctx.fillText(`DiscordJS v${discord_version}`, canvas.width - 10, 50, 100);
    ctx.fillText(cpus()[0].model, canvas.width - 10, 65, 180);

    ctx.textAlign = 'left';
    ctx.beginPath();
    ctx.font = 'bold 15px arial';
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.fillText('Mai', 75, 45, 25);
    ctx.font = 'bold 10px arial';
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fillText('#' + client.user.discriminator, 100, 45, 50);

    ctx.beginPath();
    ctx.moveTo(75, 50);
    ctx.lineTo(125, 50);
    ctx.lineTo(125, 65);
    ctx.lineTo(75, 65);
    ctx.closePath();
    ctx.fillStyle = 'rgb(113, 30, 230)';
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.textAlign = 'center';
    ctx.font = 'bold 11px sans-serif';
    ctx.fillText('v' + version, 100, 62, 50);

    ctx.beginPath();
    ctx.moveTo(0,canvas.height-17);
    ctx.lineTo(canvas.width, canvas.height-17);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fillStyle = 'rgba(48, 4, 110, 0.9)';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(150, 100);
    ctx.lineTo(250,100);
    ctx.lineTo(250, canvas.height - 30);
    ctx.lineTo(150, canvas.height - 30);
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.stroke();
    ctx.fillStyle = 'rgba(0,0,0,0.6)'
    ctx.font = '10px sans-serif'
    ctx.textAlign = 'center';
    ctx.fillText('Received Messages', 200, 110, 100);
    ctx.fillText('Sent Messages', 200, 140, 100);
    ctx.fillText('Server Count', 200, 170, 100);
    ctx.fillText('Commands',200, 200, 100);
    ctx.font = 'bold 13px sans-serif';
    ctx.fillStyle = 'rgba(48, 4, 110, 0.9)';
    ctx.fillText(text.commatize(client.messages.received), 200, 125, 100);
    ctx.fillText(text.commatize(client.messages.sent), 200, 155, 100);
    ctx.fillText(text.commatize(client.guilds.cache.size), 200, 185, 100);
    ctx.fillText(text.commatize(client.commands.size), 200, 215, 100);

//===================================================

    ctx.beginPath();
    ctx.arc(75,150,50,0, Math.PI * 2);
    ctx.lineWidth = 15;
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 15;
    ctx.arc(75,150,50, Math.PI * 1.5, Math.PI * 1.5 + (Math.PI * 2 * (messages_cached / (client.channels.cache.size * client.options.messageCacheMaxSize))));
    ctx.strokeStyle = 'rgba(48, 4, 110, 0.8)';
    ctx.stroke();

    ctx.beginPath();
    ctx.font = 'bold 32px arial';
    ctx.fillStyle = 'rgba(48, 4, 110, 0.8)';
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(100 - ((messages_cached / (client.channels.cache.size * client.options.messageCacheMaxSize)) * 100)) , 75, 150, 40);
    ctx.font = '10px arial';
    ctx.fillText('Free Space', 75, 162, 50);
    ctx.font = '10px arial';
    ctx.fillText(`[ ${text.commatize(messages_cached)} messages ]`, 75, 175, 120);
    ctx.font = 'bold 15px sans-serif';
    ctx.fillstyle = 'rgb(0,0,0)'
    ctx.fillText('MESSAGE CACHE',75,225,90)
    ctx.font = '15px arial';
    ctx.textAlign = 'left';
    ctx.fillText('%', 95, 150, 100);

//===================================================

    ctx.beginPath();
    ctx.arc(320,150,50,0, Math.PI * 2);
    ctx.lineWidth = 15;
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 15;
    ctx.arc(320,150,50, Math.PI * 1.5, Math.PI * 1.5 + (Math.PI * 2 * (heapTotal / 1024 / 1024 / MemoryLimit)));
    ctx.strokeStyle = 'rgba(48, 4, 110, 0.8)';
    ctx.stroke();

    ctx.beginPath();
    ctx.font = 'bold 32px arial';
    ctx.fillStyle = 'rgba(48, 4, 110, 0.8)';
    ctx.textAlign = 'center';
    ctx.fillText(Math.round(100 - (heapTotal/ Math.pow(1024,2) / MemoryLimit * 100)) , 320, 150, 40);
    ctx.font = '10px arial';
    ctx.fillText('Free Space', 320, 162, 50);
    ctx.font = '10px arial';
    ctx.fillText(`[ ${(heapTotal/Math.pow(1024,2)).toFixed(2)} MB used ]`, 320, 175, 80);
    ctx.font = 'bold 15px sans-serif';
    ctx.fillstyle = 'rgb(0,0,0)'
    ctx.fillText('MEMORY USAGE',320,225,90)
    ctx.font = '15px arial';
    ctx.textAlign = 'left';
    ctx.fillText('%', 340, 150, 100);

    //===================================

    ctx.font = '8px sans-serif';
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.fillText(`Uptime: ${moment.duration(client.uptime, 'milliseconds').format('D [days] H [hours] m [minutes]')}`, 10, canvas.height - 5, 175);
    ctx.textAlign = 'right';
    ctx.fillText(`Created: ${moment(client.user.createdAt).format('dddd, Do MMMM YYYY')}` ,canvas.width - 10, canvas.height - 5, 220)

    const attachment = canvas.toBuffer();
    const name = 'bot_stats.png';

    return message.channel.send('Bot Stats for Nerds', {
      embed: {
        color: 3146862,
        description: `[Github](${client.config.websites.repository})\u2000\u2000|\u2000\u2000[Website](${client.config.websites.website})`
      },
      files: [{ attachment, name }]
    });
  }
};
