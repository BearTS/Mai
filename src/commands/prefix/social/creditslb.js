const { join } = require('path');
const { createCanvas, loadImage } = require('canvas');
const { Permissions: { FLAGS }, MessageEmbed } = require('discord.js');

module.exports = {
  name             : 'creditslb',
  aliases          : [ 'creditsleaderboard', 'richlb', 'richleaderboard' ],
  guildOnly        : true,
  rankcommand      : true,
  cooldown         : { time: 5e3 },
  clientPermissions: [ FLAGS.EMBED_LINKS, FLAGS.ATTACH_FILES ],
  group            : 'social',
  description      : 'Shows the top credit earners for this server.',
  requiresDatabase : true,
  parameters       : [ 'User Mention/ID' ],
  examples         : [ 'creditslb' ],
  run              : async (message, language, args) => {

      const parameters = new language.Parameter({
        '%AUTHOR%': message.author.tag,
        '%SERVER%': message.guild.name
      });

      let collection = await message.client.database.Profile.find(
        { 'data.xp.id': message.guild.id    }, // Match any document that contains this guilds' id
        { 'data.economy.bank' : 1, '_id': 1 }, // Return only these documents for processing
        { sort: { 'data.economy.bank': -1 } }  // Sort the documents by descending currency points
      );

      if (collection instanceof Error){
        parameters.assign({ '%ERROR%': collection.message });
        return message.channel.send(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
      };

      if (!collection.length){
        // return;
      };

      const members = await message.guild.members.fetch({ user: collection.map(c => c._id).slice(0,10) }).catch(() => {});
      const guildLG = await loadImage(message.guild.iconURL({ size: 128, format: 'png' }) || '').catch(() => {});
      const defAVTR = join(__dirname, '../../../', 'assets/images/161978648819605160.jpg');
      const canvas  = createCanvas(700,660);
      const ctx     = canvas.getContext('2d');

      const generateRCT = (x, y, w, h, r) => {if(w<2*r)r=w/2;if(h<2*r)r=h/2;ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()};

      ctx.fillStyle = '#363434';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      try { ctx.drawImage(guildLG, canvas.width/2 - 64, canvas.height/2 - 64) } catch { };

      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (const [index, user] of collection.splice(0,10).entries()){
        const avatar = await loadImage(members.get(user._id)?.user.displayAvatarURL({ size: 64, format: 'png' }) || defAVTR);
        const bal    = message.client.services.UTIL.NUMBER.compact(user.data.economy.bank);

        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        generateRCT(10, 10 * (index + 1) + index * 55, canvas.width - 20, 55, 10);
        ctx.fill()

        ctx.font        = '20px Segoe UI';
        ctx.fillStyle   = '#63625f';
        ctx.fillText(`#`, 13, 10 * (index + 1) - 10 + (index + 1) * 55);
        const textwidth = ctx.measureText('#').width;
        ctx.font        = '40px Segoe UI';
        ctx.fillStyle   = [ '#D4AF37', '#c0c0c0', '#cd7f32' ][index] || '#ffffff';
        ctx.fillText(index + 1, 13 + textwidth, 10 * (index + 1) - 10 + (index + 1) * 55);

        ctx.strokeStyle = '#e620a4';
        ctx.beginPath();
        ctx.arc(110, 10 * (index + 1) + index * 55 + 28, 25, 2, 2 + ((Math.PI * 2) - 0.75) * 1)
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(110, 10 * (index + 1) + index * 55 + 28, 22, 0, Math.PI * 2);
        ctx.save();
        ctx.clip();
        ctx.drawImage(avatar, 84.5, 10 * (index + 1) + index * 55 + 3, 50, 50);
        ctx.restore();

        ctx.font      = '30px Segoe UI, "Segoe UI Emoji", "Segoe UI Symbol", "Hiragino Kaku", "Code2003", "Unifont"';
        const flength = ctx.measureText(members.get(user._id)?.user.username).width < 280 ? ctx.measureText(members.get(user._id)?.user.username).width : 280;
        ctx.fillText(members.get(user._id)?.user.username || '[❌ MNF ❌]', 160 ,10 * (index + 1) - 10 + (index + 1) * 55, 280);
        ctx.font      = '20px Segoe UI';
        ctx.fillStyle = '#63625f';
        ctx.fillText(`#${members.get(user._id)?.user.discriminator || '####'}`, 160 + flength, 10 * (index + 1) - 10 + (index + 1) * 55)

        ctx.font      = '30px Segoe UI';
        ctx.textAlign = 'right';
        ctx.fillStyle = '#e620a4';
        const tlength = ctx.measureText(bal || 0).width;
        ctx.fillText(bal, canvas.width - 15, 10 * (index + 1) - 10 + (index + 1) * 55);
        ctx.font      = '20px Segoe UI';
        ctx.fillStyle = '#63625f';
        ctx.fillText('BAL:', canvas.width - 15 - tlength, 10 * (index + 1) - 10 + (index + 1) * 55);
        ctx.textAlign = 'left';
      };

    return message.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'CreditsLB.png' }]});
  }
};
