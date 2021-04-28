const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');
const { createCanvas, loadImage }             = require('canvas');

const moment   = require('moment');
const { Api }  = require('node-osu');
const { join } = require('path');
const OSU_API  = new Api(process.env.OSU_TOKEN, { notFoundAsError: false });

module.exports = {
  name             : 'osu!',
  description      : 'Fetch User Information (As of May 20, 2020 - The global function has been removed due to a possible violation to Discord ToS).',
  aliases          : [ 'osu', 'inspectosu', 'osuusercheck' ],
  cooldown         : { time: 1e4 },
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  permissions      : [],
  group            : 'utility',
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'OSU! Username' ],
  examples         : [ 'osu [username]', 'inspectosu [username]' ],
  run              : async (message, language, [ user = '' ]) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });

    if (!user){
      message.author.cooldown.delete('osu!');
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'OSU!_NOQUERY', parameters }));
    };

    const res = await OSU_API.getUser({ u: user }).catch(error => error);

    if (res instanceof Error){
      parameters.assign({ '%ERROR%': res.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: res.name, parameters }));
    };

    if (!Object.keys(res).length){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'OSU!_NO_HITS', parameters }));
    };

    const { NUMBER } = message.client.services.UTIL;
    const DICT       = language.getDictionary([ 'rank', 'level', 'total pp', 'accuracy', 'playcount', 'playtime', 'joined osu!', 'day(s)', 'hour(s)', 'minute(s)']);
    const locale     = message.author.profile?.data.language || 'en-us';
    const format     = `d [${DICT['DAY(S)']}] h [${DICT['HOUR(S)']}] m [${DICT['MINUTE(S)']}]`;

    const canvas = createCanvas(600, 200);
    const ctx    = canvas.getContext('2d');
    const score  = NUMBER.separate(parseInt(res.scores.total));

    //<====================Canvas code go brrr.====================>//

    const path = join(__dirname, '../../../', 'assets/images');
    ctx.drawImage(await loadImage(join(path, 'OSU.BG.DEFAULT.png')), 0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.beginPath();
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    for (const [i, e] of [ '50','100','300','A','S','SS','SH', 'SSH' ].entries()){
      const img_plots     = isNaN(e) ? [ 260 + 63 * (i - 3), 35, 40, 47] : [   0, 35 + (50 * i), 100, 58 ];
      const txt_plots     = isNaN(e) ? [ 280 + 63 * (i - 3), 97, 40]     : [ 200, 67 + (50 * i), 110 ];
            ctx.font      = isNaN(e) ? '15px sans-serif' : '20px sans-serif';
            ctx.textAlign = isNaN(e) ? 'center' : 'right';
      ctx.drawImage(await loadImage(join(path, 'OSU.COUNTS.' + e + '.png')), ...img_plots);
      ctx.fillText (res.counts[e], ...txt_plots);
    };

    let sclength;
    for (const [i, fontsize] of ['25px', '15px'].entries()){
      ctx.font = fontsize + 'sans-serif';
      sclength = i === 0 ? ctx.measureText(score).width : sclength;
      ctx.fillText(i === 1 ? 'Total Score' : score, 406, 150 + i * 25);
    };

    ctx.strokeStyle = '#2e427d';
    ctx.lineCap     = 'butt';
    ctx.lineWidth   = 3;
    ctx.beginPath();
    ctx.moveTo(386 + 20 - sclength / 2, 160);
    ctx.lineTo(386 + 20 + sclength / 2, 160);
    ctx.stroke();

    ctx.lineCap     = 'round';
    ctx.lineWidth   = 5;
    ctx.beginPath();
    ctx.moveTo(225, 40 );
    ctx.lineTo(225, 180);
    ctx.stroke();

    return message.channel.send(
      new MessageEmbed()
      .setColor('GREY')
      .attachFiles([{ name: 'osu_stats_maibot.png', attachment: canvas.toBuffer() }])
      .setImage('attachment://osu_stats_maibot.png')
      .setAuthor(`${res.name}`, `https://a.ppy.sh/${res.id}`, `https://osu.ppy.sh/users/${res.id}`)
      .setDescription(`**${DICT.RANK}** #${NUMBER.separate(parseInt(res.pp.rank))} (${res.country} #${NUMBER.separate(res.pp.countryRank)})`)
      .addFields([
        { name: `▸ ${DICT.LEVEL}`         , value: Math.round(res.level)                                                 ,inline: true },
        { name: `▸ ${DICT['TOTAL PP']}`   , value: NUMBER.separate(Math.round(res.pp.raw))                               ,inline: true },
        { name: `▸ ${DICT.ACCURACY}`      , value: res.accuracyFormatted                                                 ,inline: true },
        { name: `▸ ${DICT.PLAYCOUNT}`     , value: NUMBER.separate(parseInt(res.counts.plays))                           ,inline: true },
        { name: `▸ ${DICT['JOINED OSU!']}`, value: moment(res.raw_joinDate).locale(locale).format('dddd, Do MMMM YYYY')  ,inline: true },
        { name: `▸ ${DICT.PLAYTIME}`      , value: moment.duration(parseInt(res.secondsPlayed), 'seconds').format(format),inline: true }
      ])
    );
  }
};
