const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'color',
  description      : 'Shows a random color or a preview of the given color.',
  aliases          : [ 'colour', 'hex' ],
  cooldown         : null,
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  permissions      : [],
  group            : 'utility',
  guildOnly        : false,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'hex code | rgba numbers | decimal' ],
  examples         : [ 'color', 'color #ffffff', 'color rgba 255 255 255', 'color 167253' ],
  run              : async (message, language, args) => {

    // parameters
    // -f       => Means that the argument should be forcefully evaluated as the given parameter
    // -f=rgb   => Evaluate the parameter as an rgb value. Numbers on each channel will be given Max value if value is invalid. e.g. exceeds 255;
    // -f=hex   => evaluate the parameter as a hex value. Values exceeding f will be given max value f, missing values will be given min value 0;
    // -f=dec   => Evaluate the parameter as a dec value. If value exceeds '16777215', max value will be given;

    const dec   = args.join(' ').match(/\d{1,8}/i)?.[0];
    const hex   = args.join(' ').match(/\#*[0-9a-f]{1,}/i)?.[0];
    const rgb   = args.join(' ').match(/\d{1,3}[\,\-\s]+\d{1,3}[\,\-\s]+\d{1,3}/i)?.[0];
    const force = args.join(' ').match(/(?<=(-f=))(dec|hex|rgb)/i)?.[0] || '';
    let val, used, ___def;


    if (rgb || force === 'rgb'){
      const digits = [...(rgb||'').split(/\,|\-|\s/).filter(Boolean).map(x => Number(x)), 255, 255, 255].splice(0,3);
      const valid  = !digits.some(x => Number(x) > 255);
            ___def = digits.map(x => Number(x) > 255 ? 255 : Number(x));
      const convrt = ___def.map(x => x.toString(16).length == 1 ? '0' + x.toString(16) : x.toString(16)).join('');
            val    = valid ? convrt : force.toLowerCase() === 'rgb' ? convrt : null;
            used   = 'rgb';
    };

    if ((dec && !val && !(hex||'').match(/\#/)) || force === 'dec'){
      const digits = Number(dec);
      const valid  = digits <= 16777215;
            ___def = digits <= 16777215 ? digits : 16777215;
      const convrt = [...___def.toString(16).split(''),'0','0','0','0','0'].splice(0,6).join('');
            val    = valid ? convrt : force.toLowerCase() === 'dec' ? convrt : null;
            used   = 'dec'
    };

    if (hex && !val || force === 'hex'){
      const digits = [...(hex||'').split('#').filter(Boolean)[0].split(''),'0','0','0','0','0'].splice(0,6);
      const valid  = !digits.some(x => !x.match(/[0-9a-f]/i));
            ___def = digits.map(x => !x.match(/[0-9a-f]/i) ? 'f' : x.match(/[0-9a-f]/i)[0]);
            val    = valid ? ___def.join('') : force.toLowerCase() === 'hex' ? ___def.join('') : null;
            used   = 'hex';
    };

    if (!val){
      val    = Math.floor(Math.random() * 16777215).toString(16);
      ___def = val
      used   = 'random-hex';
    };

    ___def           = used === 'hex' && Array.isArray(___def) ? ___def.join('') : used === 'rgb' && Array.isArray(___def) ? ___def.join(', ') : ___def;
    const parameters = new language.Parameter({ '%COLOR%'  : ___def, '%TYPE%': used      });
    const footer     = language.get({ '$in': 'COMMANDS', id: 'COLOR_EFOOTER', parameters });

    return message.channel.send(
     new MessageEmbed()
     .setColor(`#${val}`)
     .setImage('https://dummyimage.com/256/' + val)
     .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`)
   );

  }
};
