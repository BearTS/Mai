const { createCanvas, loadImage, registerFont } = require('canvas');
const { Permissions: { FLAGS }, MessageEmbed}   = require('discord.js');

module.exports = {
  name             : 'leaderboard',
  aliases          : [ 'lb', 'topxp' ],
  guildOnly        : true,
  rankcommand      : true,
  cooldown         : { time: 8000 },
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  group            : 'social',
  description      : 'Shows the top xp earners for this server.',
  requiresDatabase : true,
  parameters       : [ 'User Mention/ID' ],
  examples         : [ 'leaderboard' ],
  run              : async (message, language) => {

    const profile    = message.client.database['Profile'];
    const parameters = new language.Parameter({
      '%AUTHOR%': message.author.tag,
      '%SERVER%': message.guild.name
    })

    return profile.find({ 'data.xp.id': message.guild.id }, async (err, collection) => {
      if (err){
        parameters.append({ '%ERROR%': err.message });
        const response = language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters });
        return message.channel.send(response);
      };

      const { NUMBER } = message.client.services.UTIL;
      const _findfn   = (A)   => A.id === message.guild.id;
      const _sortfn   = (A,B) => B.data.xp.find(_findfn).xp - A.data.xp.find(_findfn).xp;
      collection       = collection.sort(_sortfn).map(x => { return { id: x._id, data: x.data.xp.find(x => x.id === message.guild.id)}});
      const _index     = collection.findIndex(x => x.id === message.member.id);
      const rank       = NUMBER.ordinalize(_index + 1).replace(/(?<![\d]{1,})0th/, 'N/A');
      const document   = collection[_index] || new profile({ _id: message.member.id });
      const members    = await message.guild.members.fetch({ limit: 20, user: collection.map(x => x.id) }).catch(() => null);
      const canvas     = createCanvas(700,660);
      const ctx        = canvas.getContext('2d');
      const guildLogo  = message.guild.iconURL() ? await loadImage(message.guild.iconURL({ size: 128, format: 'png' })) : null;
      const e_author   = language.get({ '$in': 'COMMANDS', id: 'LEADERBOARD_TTL', parameters });
      const e_descript = language.get({ '$in': 'COMMANDS', id: 'LEADERBOARD_TOP', parameters: parameters.assign({ '%RANK%': rank, '%XP%': NUMBER.separate(message.member.xp)})});
      const e_footer   = language.get({ '$in': 'COMMANDS', id: 'LEADERBOARD_FTR' });

      const generateBox = (x1, y1, x2, y2) => { ctx.moveTo(x1, y1); ctx.lineTo(x2, y1); ctx.lineTo(x2, y2); ctx.lineTo(x1, y2) };
      const generateRCT = (x, y, w, h, r)  => {if(w<2*r)r=w/2;if(h<2*r)r=h/2;ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()};

      ctx.fillStyle = '#363434';
      generateBox(0, 0, canvas.width, canvas.height);
      ctx.fill();

      if (guildLogo){
        ctx.drawImage(guildLogo, canvas.width/2 - 64, canvas.height/2 - 64);
      };

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      generateBox(0, 0, canvas.width, canvas.height);
      ctx.fill();

      for (const member of members.array()){
        const index    = collection.filter(x => members.some(m => m.id === x.id)).findIndex(x => x.id === member.id);
        if (index > 9) continue;
        if (member.user.profile === null) await member.user.loadProfile();
        const rank     = NUMBER.ordinalize(index + 1).replace(/(?<![\d]{1,})0th/, 'N/A');
        const lowerlim = member.getXPCapByLevel(!isNaN(member.level - 1) ? member.level - 1 : 1);
        const upperlim = member.getXPCapByLevel(member.level    || 1);
        const percent  = (member.xp - lowerlim) / (upperlim - lowerlim);
        const data     = collection[index];
        const avatar   = await loadImage(member.user.displayAvatarURL({ size: 64, format: 'png', dynamic: false }));

        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        generateRCT(10, 10 * (index + 1) + index * 55, canvas.width - 20, 55, 10);
        ctx.fill()

        ctx.font        = '20px sans-serif';
        ctx.fillStyle   = '#63625f';
        ctx.fillText(`#`      , 13, 10 * (index + 1) - 10 + (index + 1) * 55);
        const textwidth = ctx.measureText('#').width;
        ctx.font        = '40px sans-serif';
        ctx.fillStyle   = [ '#D4AF37', '#c0c0c0', '#cd7f32' ][index] || '#ffffff';
        ctx.fillText(index + 1, 13 + textwidth, 10 * (index + 1) - 10 + (index + 1) * 55);

        // The shadow
        ctx.lineWidth   = 4;
        ctx.lineCap     = 'round';
        ctx.strokeStyle = 'rgba(0,0,0,0.8)';
        ctx.beginPath();
        ctx.arc(110, 10 * (index + 1) + index * 55 + 28, 25, 1.2, 1.2 + (Math.PI * 2))
        ctx.stroke();

        // Add xp
        ctx.strokeStyle = '#e620a4';
        ctx.beginPath();
        ctx.arc(110, 10 * (index + 1) + index * 55 + 28, 25, 2, 2 + ((Math.PI * 2) - 0.75) * percent)
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(110, 10 * (index + 1) + index * 55 + 28, 22, 0, Math.PI * 2);
        ctx.save();
        ctx.clip();
        ctx.drawImage(avatar, 84.5, 10 * (index + 1) + index * 55 + 3, 50, 50);
        ctx.restore();

        ctx.font      = '30px sans-serif';
        const flength = ctx.measureText(member.user.username).width < 280 ? ctx.measureText(member.user.username).width : 280;
        ctx.fillText(member.user.username, 160 ,10 * (index + 1) - 10 + (index + 1) * 55, 280);
        ctx.font      = '20px sans-serif';
        ctx.fillStyle = '#63625f';
        ctx.fillText(`#${member.user.discriminator}`, 160 + flength, 10 * (index + 1) - 10 + (index + 1) * 55)

        ctx.font      = '30px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillStyle = '#e620a4';
        const tlength = ctx.measureText(member.level || 0).width;
        ctx.fillText(member.level || 0, canvas.width - 15, 10 * (index + 1) - 10 + (index + 1) * 55);
        ctx.font      = '20px sans-serif';
        ctx.fillStyle = '#63625f';
        ctx.fillText('LVL:', canvas.width - 15 - tlength, 10 * (index + 1) - 10 + (index + 1) * 55);

        ctx.font      = '20px sans-serif';
        ctx.fillStyle = '#e620a4';
        const ylength = ctx.measureText(NUMBER.compact(member.xp || 0)).width;
        ctx.fillText(NUMBER.compact(member.xp || 0), canvas.width - 15 - tlength - 60, 10 * (index + 1) - 10 + (index + 1) * 55);
        ctx.fillStyle = '#63625f';
        ctx.fillText('XP:', canvas.width - 15 - tlength - 60 - ylength, 10 * (index + 1) - 10 + (index + 1) * 55);

        ctx.textAlign = 'left';
      };

      return message.channel.send(
        new MessageEmbed()
        .setFooter(`${e_footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`)
        .attachFiles([{ attachment: canvas.toBuffer(), name: 'lb.png' }])
        .setImage('attachment://lb.png')
        .setDescription(e_descript)
        .setAuthor(e_author)
        .setColor('#e620a4')
      );
    });
  }
};
