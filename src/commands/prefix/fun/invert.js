const { Permissions: { FLAGS }} = require('discord.js');

const { createCanvas, loadImage } = require('canvas');

module.exports = {
  name             : 'invert',
  description      : 'Invert the colors on user avatar.',
  aliases          : [],
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
  examples         : [ 'invert @user', 'invert 721612345678987654456' ],
  run              : async (message, language, [user = '']) => {

    const id     = user.match(/\d{17,19}/)?.[0] || message.author.id;
    const member = await message.guild?.members.fetch(id).catch(() => {}) || message?.member;
    let   color  = member?.displayColor || 0xe620a4;
          user   = member?.user || message.author
    const avatar = await loadImage(user.displayAvatarURL({ size: 1024, dynamic: true, format: 'png' }));
    const canvas = createCanvas(avatar.width, avatar.height);
    const ctx    = canvas.getContext('2d');
                   ctx.drawImage(avatar, 0, 0);
    const image  = ctx.getImageData(0, 0, canvas.width, canvas.height);

    for (i = 0; i < image.data.length; i += 4) {
      if (image.data[i + 3] == 0 ) continue; // Check alpha transparency
        image.data[i  ] = 255 - image.data[i  ];
        image.data[i+1] = 255 - image.data[i+1];
        image.data[i+2] = 255 - image.data[i+2];
    };

    ctx.putImageData(image, 0, 0);

    return message.channel.send({ files: [{ name: 'inverted.png', attachment: canvas.toBuffer() }] });
  }
};
