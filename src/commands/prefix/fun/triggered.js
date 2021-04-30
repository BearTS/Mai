const { join } = require('path')

const { Permissions: { FLAGS }}   = require('discord.js');
const { createCanvas, loadImage } = require('canvas');

const GIFEncoder = require('gifencoder');

module.exports = {
  name             : 'triggered',
  description      : 'Triggered users.',
  aliases          : [ '3grd' ],
  cooldown         : { time: 5e3 },
  clientPermissions: [ FLAGS.ATTACH_FILES ],
  permissions      : [],
  group            : 'fun',
  guildOnly        : false,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'User ID', 'User Mention' ],
  examples         : [ 'triggered @user', 'triggered 721612345678987654456' ],
  run              : async (message, language, [user = '']) => {

    const id     = user.match(/\d{17,19}/)?.[0] || message.author.id;
    const member = await message.guild?.members.fetch(id).catch(() => {}) || message?.member;
    let   color  = member?.displayColor || 0xe620a4;
          user   = member?.user || message.author

    const avatar = await loadImage(user.displayAvatarURL({ size: 512, dynamic: false, format: 'png' }));
    const trggrd = await loadImage(join(__dirname, '../../../', 'assets/images/161978648819605160.jpg'));

    function generateFrame(i = true){
      const canvas = createCanvas(256, 256);
      const rand_1 = () => -16 + Math.ceil(Math.random() * 32) - 16;
      const rand_2 = () => - 8 + Math.ceil(Math.random() * 16) -  8;
      const ctx    = canvas.getContext('2d');
                     ctx.drawImage(avatar, !i ? -16 : rand_1(), !i ? -16 : rand_1(), 288, 288);
                     ctx.fillStyle = 'rgba(255,0,0,0.2)'
                     ctx.fillRect(0, 0, canvas.width, canvas.height);
                     ctx.drawImage(trggrd, !i ?   0 : rand_2(), !i ? canvas.width - 48 : rand_2() + canvas.width - 48, 272, 64);
      return ctx;
    };

    const encoder = new GIFEncoder(256, 256);
    const stream  = encoder.createReadStream();
    const buffers = [];

    stream.on('data', buffer =>  buffers.push(buffer));
    stream.on('end', async() =>  message.channel.send({ files: [{ name: 'triggered.gif', attachment: Buffer.concat(buffers) }] }));

    encoder.start()
    encoder.setRepeat(0)
    encoder.setDelay(20)

    for (let i = 0; i < 8; i++){
      const frame = generateFrame(i);
      encoder.addFrame(frame);
    };

    encoder.finish();
  }
};
