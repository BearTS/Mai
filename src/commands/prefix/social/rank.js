const { join }                    = require('path');
const { Permissions: { FLAGS }}   = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = {
  name             : 'rank',                 // Name of this command
  aliases          : [ 'lvl', 'xp', 'level' ],              // This command can be invoked using these aliases as well
  guildOnly        : true,                   // Don't let this command run on DMs or it'll break
  rankcommand      : true,                   // This is a rank-based command, so it wont run in the server if the owner disables it
  cooldown         : { time: 5000 },         // This method cannot be spammed
  clientPermissions: [ FLAGS.ATTACH_FILES ], // The bot needs the 'ATTACH_FILES' permissions
  group            : 'social',               // The group for this command
  description      : 'Shows the current xp, level, rank, and other details of a user',
  requiresDatabase : true,                   // This command won't run if database is not connected
  parameters       : [ 'User Mention/ID' ],
  examples         : [ 'profile', 'rank @user', 'lvl 78475628394857374' ],
  run              : async (message, language, [ member = '' ]) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    const profile    = message.client.database['Profile'];

    member = member.match(/\d{17,18}/)?.[0] || message.member.id;
    member = await message.guild.members.fetch(member).catch(() => message.member);
    member = member.user.bot ? message.member : member;

    let collection = await profile.find({ 'data.xp.id': message.guild.id });

    if (collection instanceof Error){
      parameters.assign({ '%ERROR%': collection.message });
      return message.channel.send(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };

    if (member.user.profile === null){
      member.user.loadProfile();
    };

    const { NUMBER } = message.client.services.UTIL;
    const _index    = collection.findIndex(x => x._id === member.id);
    const _findfn   = (A)   => A.id === message.guild.id;
    const _sortfn   = (A,B) => B.data.xp.find(_findfn).xp - A.data.xp.find(_findfn).xp;
    const document  = collection[_index] || new profile({ _id: member.id });
    const rank      = NUMBER.ordinalize(collection.sort(_sortfn).findIndex(x => x._id === document._id) + 1).replace(/(?<![\d]{1,})0th/, 'Unranked');
    const lowerlim  = member.getXPCapByLevel(!isNaN(member.level - 1) ? member.level - 1 : 1);
    const upperlim  = member.getXPCapByLevel(member.level || 1);
    const percent   = (member.xp - lowerlim) / (upperlim - lowerlim);
    const logo      = await loadImage(join(__dirname, '../../../', 'assets/images/161902995375172790.png'));
    const booster   = await loadImage(join(__dirname, '../../../', `assets/images/16190532152403172${member.premiumSince ? '1' : '2'}.png`));
    const avatar    = await loadImage(member.user.displayAvatarURL({ format: 'png', size: 256 }));
    const canvas    = createCanvas(900, 275);
    const seccanvas = createCanvas(900, 275);
    const ctx       = canvas.getContext('2d');
    const secctx    = seccanvas.getContext('2d');

      // draw color
    secctx.fillStyle = document.data.profile.color || '#e620a4';
    secctx.fillRect(0, 0, seccanvas.width, seccanvas.height);
    secctx.globalCompositeOperation = "destination-in";
    secctx.drawImage(logo, 0, 0);

      // Functions
    const generateBox = (x1, y1, x2, y2) => { ctx.moveTo(x1, y1); ctx.lineTo(x2, y1); ctx.lineTo(x2, y2); ctx.lineTo(x1, y2) };
    const generateRCT = (x, y, w, h, r)  => {if(w<2*r)r=w/2;if(h<2*r)r=h/2;ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()};

      // Generate the background
    ctx.fillStyle = '#000000' || '#363434';
    generateBox(0, 0, 900, 275);
    ctx.fill();

      // Add the backdrop logo
    ctx.shadowColor   =  "rgba(0,0,0,0.2)";
    ctx.shadowBlur    =  40;
    ctx.shadowOffsetX = -10;
    ctx.shadowOffsetY = -10;
    ctx.beginPath();
    ctx.drawImage(seccanvas, 5, 5, 890, 265);

      // Add shadow filter
    ctx.fillStyle     = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur    = 0
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    generateBox(0, 0, 900, 275);
    ctx.fill();

    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    generateRCT(21, 10, 246, 252, 10);
    ctx.fill();
    generateRCT(275, 10, 610, 60, 10);
    ctx.fill();
    generateRCT(275, 275/2 - 60, 610, 185, 10);
    ctx.fill();

      // Add badges
    ctx.drawImage(booster, 290, 20, 40, 40);

      // Add circle stuff (xp container)
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth   = 30;
    ctx.beginPath();
    ctx.arc(145, 275/2, 105, 0,  Math.PI * 2);
    ctx.stroke();

      // Add xp
    ctx.strokeStyle = document.data.profile.color || '#e620a4';
    ctx.lineWidth   = 17;
    ctx.lineCap     = 'round';
    ctx.beginPath();
    ctx.arc(145, 275/2, 105, 1.2, 1.2 + (Math.PI * 2))
    ctx.stroke();

      // The shadow
    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
    ctx.beginPath();
    ctx.arc(145, 275/2, 105, 1.2, 1.2 + (Math.PI * 2))
    ctx.stroke();

      // Add xp
    ctx.strokeStyle = document.data.profile.color || '#e620a4';
    ctx.beginPath();
    ctx.arc(145, 275/2, 105, 1.2, 1.2 + ((Math.PI * 2) - 0.75) * percent)
    ctx.stroke();

      // Add profile
    ctx.beginPath();
    ctx.arc(145, 275/2, 85, 0, Math.PI * 2);
    ctx.save();
    ctx.clip();
    ctx.drawImage(avatar, 145 - 85, 275/2 - 85, 170, 170);
    ctx.restore();

      // Add circle
    ctx.fillStyle   = ctx.strokeStyle = document.data.profile.color || '#e620a4' ||'#64e364';
    ctx.strokeStyle = 'rgb(9,8,8)';
    ctx.lineWidth   = 12;
    ctx.beginPath();
    ctx.arc(145 + 85 - 30 ,275/2 + 85 - 30/2, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(0,0,0,0.2)',
    ctx.stroke();

      // Add the name
    ctx.font      = '40px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(member.displayName, 290, 275/2 - 10, 500);

      // Add the tag
    ctx.font      = '30px sans-serif';
    ctx.fillStyle = '#63625f'
    ctx.fillText(member.user.tag, 290, 275/2 + 30, 500);

      // Add the line
    ctx.lineCap     = 'butt';
    ctx.lineWidth   = 5;
    ctx.strokeStyle = document.data.profile.color || '#e620a4';
    ctx.beginPath();
    ctx.moveTo(285, 275/2 + 30 + 20);
    ctx.lineTo(870, 275/2 + 30 + 20);
    ctx.stroke();

      // Add the XP
    ctx.font      = '25px Sans';
    ctx.fillStyle = '#63625f';
    ctx.fillText('XP:', 290, 240);

    ctx.font      = '35px Sans';
    ctx.fillStyle = document.data.profile.color || '#e620a4';
    const lengthA = ctx.measureText(message.client.services.UTIL.NUMBER.separate(member.xp - lowerlim)).width;
    ctx.fillText(message.client.services.UTIL.NUMBER.separate(member.xp - lowerlim), 340, 240);
    ctx.font      = '40px Sans';
    ctx.textAlign = 'right';
    const lengthB = ctx.measureText(member.level || 1).width;
    ctx.fillText(member.level || 1, 875, 240);
    ctx.font      = '40px Sans';
    ctx.fillStyle = document.data.profile.color || '#e620a4';
    const lengthC = ctx.measureText(rank).width;
    ctx.fillText(rank, 875, 60);

    ctx.font      = '25px Sans';
    ctx.fillStyle = '#63625f';
    ctx.textAlign = 'left';
    ctx.fillText(`/${message.client.services.UTIL.NUMBER.separate(upperlim - lowerlim)}`, 345 + lengthA, 240);
    ctx.textAlign = 'right';
    ctx.fillText('LEVEL: ', 875 - lengthB, 240);
    ctx.fillText('RANK: ',  875 - lengthC, 60);

    ctx.fillStyle = document.data.profile.color || '#e620a4';
    generateBox(0,0,7.5,275);
    ctx.fill();

    return message.channel.send({ files: [{ attachment: canvas.toBuffer(), name: 'rank.png' }] });
  }
};
