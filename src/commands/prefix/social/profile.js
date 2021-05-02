const { Permissions: { FLAGS }}    = require('discord.js');
const { createCanvas, loadImage }  = require('canvas');

module.exports = {
  name             : 'profile',
  aliases          : [],
  guildOnly        : true,
  rankcommand      : true,
  cooldown         : { time: 8000 },
  clientPermissions: [ FLAGS.ATTACH_FILES ],
  group            : 'social',
  description      : 'Shows the current xp, level, rank, and other details of a user',
  requiresDatabase : true,
  parameters       : [ 'User Mention/ID' ],
  examples         : [ 'profile' ],
  run              : async (message, language, [member = '']) => {

    const parameters = new language.Parameter({ '%AUTHOR': message.author.tag });
    const profile    = message.client.database['Profile'];

    member = member.match(/\d{17,18}/)?.[0] || message.member.id;
    member = await message.guild.members.fetch(member).catch(() => message.member);
    member = member.user.bot ? message.member : member;

    if (member.xp === null){
      await member.user.loadProfile();
    };

    const time      = Date.now();
    let   collection = await profile.find({ 'data.xp.id': message.guild.id });

    if (collection instanceof Error){
      parameters.assign({ '%ERROR%': collection.message });
      return message.channel.send(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };

    const { NUMBER } = message.client.services.UTIL;
    const _findfn    = (A)   => A.id === message.guild.id;
    const _sortfn    = (A,B) => B.data.xp.find(_findfn).xp - A.data.xp.find(_findfn).xp;
    const _newcoll   = collection.sort(_sortfn).map(x => { return { id: x._id, data: x.data.xp.find(x => x.id === message.guild.id)}});
    const _index     = _newcoll.findIndex(x => x.id === member.id);
    const document   = collection[_index] || new profile({ _id: member.id });
    const rank       = NUMBER.ordinalize(_index + 1).replace(/(?<![\d]{1,})0th/, 'N/A');
    const lowerlim   = member.getXPCapByLevel(member.level -1 || 1);
    const upperlim   = member.getXPCapByLevel(member.level    || 1);
    const percent    = Number.isFinite((member.xp - lowerlim) / (upperlim - lowerlim)) ? (member.xp - lowerlim) / (upperlim - lowerlim) : 0;
    const canvas     = createCanvas(800, 600);
    const ctx        = canvas.getContext('2d');

    const color      = document.data.profile.color;
    const secondary  = document.data.profile.color_secondary;
    const hat        = document.data.profile.hat     ? await loadImage(document.data.profile.hat)     : null;
    const emblem     = document.data.profile.emblem  ? await loadImage(document.data.profile.emblem)  : null;
    const wreath     = document.data.profile.wreath  ? await loadImage(document.data.profile.wreath)  : null;
    const defpattern = document.data.profile.pattern ? await loadImage(document.data.profile.pattern) : null;
    const def        = await loadImage(document.data.profile.background || 'https://i.imgur.com/57eRI6H.jpg');
    const avatar     = await loadImage(member.user.displayAvatarURL({format: 'png'}));
    const themecolor = '#262626'               || '#ffffff';
    const txtcolorTI = 'rgba(255,255,255,0.4)' || 'rgba(0,0,0,0.4)';
    const txtcolor   = 'rgba(255,255,255,0.8)' || 'rgba(0,0,0,0.8)';
                         // Dark      // Light

      // add the wallpaper
    ctx.drawImage(def,300,65,475,250);

      // add the bio card
    ctx.fillStyle     = themecolor;
    ctx.shadowColor   = "rgba(0,0,0,0.5)";
    ctx.shadowBlur    =  40;
    ctx.shadowOffsetX = -10;
    ctx.shadowOffsetY = -40;
    ctx.beginPath();
    ctx.moveTo(300, 315);
    ctx.lineTo(canvas.width-5,315);
    ctx.lineTo(canvas.width-5,canvas.height-25);
    ctx.lineTo(300,canvas.height-25);
    ctx.fill();

      // add bio outline
    ctx.strokeStyle = txtcolorTI;
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.moveTo(370,338);
    ctx.lineTo(canvas.width-40,338)
    ctx.arcTo(canvas.width-20,338, canvas.width - 20, 358, 20);
    ctx.lineTo(canvas.width-20,378)
    ctx.arcTo(canvas.width -20,398, canvas.width - 40, 398, 20);
    ctx.lineTo(330, 398)
    ctx.arcTo(310,398,310,378,20)
    ctx.lineTo(310, 358)
    ctx.arcTo(310,338,330,338,20)
    ctx.stroke();

      // add bio title
    ctx.font      = 'bold 20px sans-serif';
    ctx.fillStyle = txtcolorTI;
    ctx.beginPath();
    ctx.fillText('BIO', 330, 345, 50);

      // add bio text to bio carrd
    ctx.beginPath();
    ctx.font      = '15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = txtcolor;
    ctx.fillText(document.data.profile.bio, 555, 368, 490);

      // add birthday outline
    ctx.beginPath();
    ctx.moveTo(410, 419);
    ctx.lineTo(520,419);
    ctx.arcTo(540,419,540,439,20);
    ctx.arcTo(540,459,520,459,20);
    ctx.lineTo(330,459);
    ctx.arcTo(310,459,310,439,20);
    ctx.arcTo(310,419,320,419,20);
    ctx.stroke();

      // add birthday title
    ctx.font      = 'bold 18px sans-serif';
    ctx.fillStyle = txtcolorTI;
    ctx.textAlign = 'left';
    ctx.beginPath();
    ctx.fillText('BIRTHDAY', 330, 425, 80);

      // add birthday text to birthday card
    ctx.font      = '15px sans-serif'
    ctx.fillStyle = txtcolor;
    ctx.beginPath();
    ctx.fillText(document.data.profile.birthday || 'Not Set', 330, 445, 230)

      // add balance outline
    ctx.beginPath();
    ctx.moveTo(410,479);
    ctx.lineTo(520,479);
    ctx.arcTo(540,479,540,499,20);
    ctx.lineTo(540,509);
    ctx.arcTo(540,529,520,529,20);
    ctx.lineTo(330,529);
    ctx.arcTo(310,529,310,509,20);
    ctx.lineTo(310,499);
    ctx.arcTo(310,479,330,479,20);
    ctx.stroke();

      // add balance title
    ctx.font      = 'bold 18px sans-serif';
    ctx.fillStyle = txtcolorTI;
    ctx.beginPath();
    ctx.fillText('BALANCE', 330, 485, 80);

      // add balance text to balance card
    ctx.beginPath();
    ctx.font      = '18px sans-serif';
    ctx.fillStyle = txtcolor;
    ctx.fillText(`${NUMBER.separate(document.data.economy.bank || '0')}`, 330, 512, 160);

      // add emblem indicator
    if (!emblem){
      ctx.font      = 'bold 25px sans-serif';
      ctx.fillStyle = txtcolorTI;
      ctx.textAlign = 'center'
      ctx.beginPath();
      ctx.fillText('NO', 660 , 469, 150)
      ctx.fillText('EMBLEM', 660, 500, 150)
    } else {
      ctx.shadowBlur    = 10;
      ctx.shadowOffsetX = 10;
      ctx.shadowOffsetY = 10;
      ctx.beginPath();
      ctx.drawImage(emblem,580,400,160,160);
    };

      // add the tip shape
    ctx.fillStyle     = color;
    ctx.shadowBlur    = 30;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 30;
    ctx.beginPath();
    ctx.moveTo(800,10);
    ctx.lineTo(575,10);
    ctx.lineTo(600,80);
    ctx.lineTo(800,80);
    ctx.fill();

      // write tip on tip shape
    ctx.font      = 'bold 30px sans-serif'
    ctx.fillStyle = txtcolor;
    ctx.textAlign = 'left'
    ctx.beginPath();
    ctx.fillText('TIP',610,50,50);

      // write received tips on tip shape
    ctx.font      = 'bold 30px sans-serif'
    ctx.textAlign = 'right'
    ctx.beginPath();
    ctx.fillText(document.data.tips.received, canvas.width - 30, 50, 120)

      // reset shadow
    ctx.shadowOffsetY = 0;

      // add card on left side
      // add pattern inside card
    ctx.fillStyle = themecolor;
    ctx.beginPath();
    ctx.moveTo(0,65);
    ctx.lineTo(0,535);
    ctx.arcTo(0,585,50,585,50);
    ctx.lineTo(250,585);
    ctx.lineTo(300,585);
    ctx.arcTo(300,15,250,15,50);
    ctx.lineTo(50,15);
    ctx.arcTo(0,15,0,65,50);
    ctx.stroke();

    ctx.shadowBlur    = 10;
    ctx.shadowOffsetX = 10;
    ctx.fill();

    if (defpattern){
      ctx.save();
      ctx.clip();
      ctx.drawImage(defpattern,0,0,300,600);
      ctx.restore();
    };

      // reset shadow
    ctx.shadowOffsetX = 0;

      // add wavy shape below the pattern
    ctx.fillStyle = color
    ctx.beginPath();
    ctx.moveTo(0, 255);
    ctx.bezierCurveTo(0,265,50,265,50,255);
    ctx.bezierCurveTo(50,245,100,245,100,255);
    ctx.bezierCurveTo(100,265,150,265,150,255);
    ctx.bezierCurveTo(150,245,200,245,200,255);
    ctx.bezierCurveTo(200,265,250,265,250,255);
    ctx.bezierCurveTo(250,245,300,245,300,255);
    ctx.lineTo(300,585);
    ctx.lineTo(50,585);
    ctx.arcTo(0,585,0,535,50);
    ctx.fill();
    ctx.shadowBlur = 0;

      // add name
    ctx.font      = 'bold 30px sans-serif'
    ctx.fillStyle = secondary
    ctx.textAlign = 'center'
    ctx.beginPath()
    ctx.fillText(member.displayName, 150, 350, 280)
    ctx.font = '20px sans-serif'
    ctx.fillText(member.user.tag, 150, 375, 280)

      // add xp
    ctx.lineWidth   = 10;
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.arc(60,460,35,0,Math.PI*2);
    ctx.stroke();

    ctx.strokeStyle = secondary
    ctx.beginPath();
    ctx.arc(60,460,35,Math.PI * 1.5,Math.PI * 1.5 + (Math.PI * 2 * percent || 1))
    ctx.stroke();

    ctx.font      = 'bold 25px sans-serif'
    ctx.fillStyle = secondary
    ctx.textAlign = 'center'
    ctx.beginPath();
    ctx.fillText(member.level || '1', 60, 460, 35);
    ctx.font      = 'bold 15px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('LEVEL', 60, 480, 35)

    ctx.beginPath();
    ctx.arc(150,460,40,0,Math.PI * 2);
    ctx.fillStyle = secondary
    ctx.fill();

    ctx.font      = 'bold 30px sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.beginPath();
    ctx.fillText(rank, 150,460,50);
    ctx.font      = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SERVER', 150, 480, 50);

    ctx.beginPath();
    ctx.arc(240,460,40,0,Math.PI * 2);
    ctx.fillStyle = secondary;
    ctx.fill();

    ctx.font      = 'bold 30px sans-serif';
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.beginPath();
    ctx.fillText('N/A', 240,460,50);
    ctx.font      = 'bold 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GLOBAL', 240, 480, 50);

      // add avatar
    ctx.lineWidth   = 6;
    ctx.strokeStyle = 'rgba(0,0,0,0.6)'
    ctx.beginPath();
    ctx.arc(150,225,75, 0, Math.PI * 2);
    ctx.stroke();
    ctx.closePath();
    ctx.save();
    ctx.clip();
    ctx.drawImage(avatar,75,150,150,150);
    ctx.restore();

    if (wreath){
      ctx.drawImage(wreath,60,145,180,180);
    };

    if (hat){
      ctx.drawImage(hat,0,0,300,300);
    };

   return message.channel.send({
     files: [{
       attachment: canvas.toBuffer(),
       name: 'profile.png'
     }]
   });
  }
};
