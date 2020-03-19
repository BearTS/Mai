const {Attachment} = require('discord.js')
const Canvas = require('canvas')

function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.lineTo(x, y + height - radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.lineTo(x + width - radius, y + height);
  ctx.arcTo(x + width, y + height, x + width, y + height-radius, radius);
  ctx.lineTo(x + width, y + radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.lineTo(x + radius, y);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.stroke();
}

const imager = async (message,member,author,level,xp,mlvlcap,maxXPThisLevel,curXPThisLevel,percentage,rank,wreath) => {
  const canvas = Canvas.createCanvas(934, 282);
	const ctx = canvas.getContext('2d');
  const background = await Canvas.loadImage('https://i.imgur.com/djHyEE0.png');
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

  ctx.beginPath()
  ctx.fillStyle = 'rgba(0,0,0,0.6)'
  roundedRect(ctx,25,65,897,210,20)
  ctx.fill()

  ctx.font = '50px sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText(member.displayName,245,110,500)

  ctx.font = '25px sans-serif';
  ctx.fillStyle = '#ffffff'
  ctx.fillText(author.tag,250,142,(ctx.measureText(member.displayName).width*2)*0.75)

  ctx.font = '25px sans-serif';
  ctx.fillStyle = '#C0C0C0'
  ctx.fillText(`XP: ${curXPThisLevel}/${maxXPThisLevel} | Level: ${level}`,850-ctx.measureText(`XP: ${curXPThisLevel}/${maxXPThisLevel} | Level: ${level}`).width,240)

  ctx.font = '20px sans-serif';
  ctx.fillStyle = '#C0C0C0'
  ctx.fillText(`RANK:`,750,85)

  ctx.font = '35px sans-serif';
  ctx.fillStyle = '#f0f0f0'
  ctx.fillText(rank,810,95)

  ctx.beginPath()
  ctx.lineWidth = 10
  ctx.moveTo(258,206.71)
  ctx.lineTo((258+(592*(percentage/100))),206.71)
  ctx.strokeStyle = '#FF0000'
  ctx.stroke()

  ctx.beginPath()
  ctx.fillStyle = '#000000'
  ctx.moveTo(211.07,211.71)
  ctx.lineTo(211.07,201.71)
  ctx.lineTo(250,201.71)
  ctx.lineTo(250,211.71)
  ctx.closePath()
  ctx.fill()

  ctx.beginPath()
  ctx.lineWidth = 5
  ctx.moveTo(211.07,211.71)
  ctx.lineTo(850,211.71)
  ctx.strokeStyle = '#000000'
  ctx.stroke()

  ctx.beginPath()
  ctx.arc(140,141,100,0,Math.PI*2,true)
  ctx.fillStyle = 'rgba(0,0,0,0.8)'
  ctx.closePath();
  ctx.fill()

  if (wreath){
    const wr = await Canvas.loadImage(wreath);
    ctx.beginPath()
    ctx.arc(140,141,100,0,Math.PI*2,true)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(wr,40,41,200,200)
  }

  ctx.beginPath()
  ctx.arc(140,141,80,0,Math.PI * 2,true)
  ctx.closePath();
  ctx.clip()
  const avatar = await Canvas.loadImage(author.displayAvatarURL);
  ctx.drawImage(avatar,60, 61, 160, 160)

  if (wreath){
    const wr = await Canvas.loadImage(wreath);
    ctx.beginPath()
    ctx.arc(140,141,100,0,Math.PI*2,true)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(wr,40,41,200,200)
  }


  const attachment = new Attachment(canvas.toBuffer(), 'rank.png');

  return message.channel.send(attachment)

}


module.exports = imager
