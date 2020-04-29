 const { createCanvas, loadImage } = require('canvas')
 const { MessageAttachment } = require('discord.js')


const standard = async (member, data) => {

  const canvas = createCanvas(934, 282)
  const ctx = canvas.getContext('2d')
  const background = await loadImage('https://i.imgur.com/djHyEE0.png')

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
  ctx.fillText(member.user.tag,250,142,500)

  ctx.font = '25px sans-serif';
  ctx.fillStyle = '#C0C0C0'
  ctx.fillText(`XP: ${data.curXPThisLevel}/${data.maxXPThisLevel} | Level: ${data.level}`,850-ctx.measureText(`XP: ${data.curXPThisLevel}/${data.maxXPThisLevel} | Level: ${data.level}`).width,240)

  ctx.font = '20px sans-serif';
  ctx.fillStyle = '#C0C0C0'
  ctx.fillText(`RANK:`,750,85)

  ctx.font = '35px sans-serif';
  ctx.fillStyle = '#f0f0f0'
  ctx.fillText(data.rank,810,95)

  ctx.beginPath()
  ctx.lineWidth = 10
  ctx.moveTo(258,206.71)
  ctx.lineTo((258+(592*(data.percentage/100))),206.71)
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

  if (data.wreath){
    const wr = await loadImage(data.wreath)
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
  const avatar = await loadImage(member.user.displayAvatarURL({ format: 'png', dynamic: false}));
  ctx.drawImage(avatar,60, 61, 160, 160)

  if (data.wreath){
    const wr = await loadImage(data.wreath)
    ctx.beginPath()
    ctx.arc(140,141,100,0,Math.PI*2,true)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(wr,40,41,200,200)
  }

  return new MessageAttachment(canvas.toBuffer(), 'rank.png')
}







module.exports = { standard }

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
