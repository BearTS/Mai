const { Permissions: { FLAGS }, MessageEmbed } = require('discord.js');

module.exports = {
  name             : 'support',
  description      : 'Displays various ways to show support for Mai.',
  aliases          : [ 'status', 'botstatus' ],
  cooldown         : null,
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  permissions      : [],
  group            : 'bot',
  guildOnly        : false,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [],
  examples         : [],
  run              : async (message, language) =>{

    const parameters    = new language.Parameter({ '%MEMCOUNT%': await message.client.guilds.fetch('703922441768009731').then(guild => guild.memberCount) });
    const title         = language.get({ '$in': 'COMMANDS', id: 'SUPPORT_TITLE'           });
    const description   = language.get({ '$in': 'COMMANDS', id: 'SUPPORT_DESC'            });
    const field_name_1  = language.get({ '$in': 'COMMANDS', id: 'SUPPORT_FN1'             });
    const field_value_1 = language.get({ '$in': 'COMMANDS', id: 'SUPPORT_FV1', parameters });
    const field_name_2  = language.get({ '$in': 'COMMANDS', id: 'SUPPORT_FN2'             });
    const field_value_2 = language.get({ '$in': 'COMMANDS', id: 'SUPPORT_FV2'             });
    const field_name_3  = language.get({ '$in': 'COMMANDS', id: 'SUPPORT_FN3'             });
    const field_value_3 = language.get({ '$in': 'COMMANDS', id: 'SUPPORT_FV3'             });
    const field_name_4  = language.get({ '$in': 'COMMANDS', id: 'SUPPORT_FN4'             });
    const field_value_4 = language.get({ '$in': 'COMMANDS', id: 'SUPPORT_FV4'             });
    const field_name_5  = language.get({ '$in': 'COMMANDS', id: 'SUPPORT_FN5'             });
    const field_value_5 = language.get({ '$in': 'COMMANDS', id: 'SUPPORT_FV5'             });
    const footer        = language.get({ '$in': 'COMMANDS', id: 'SUPPORT_FOOTER'          });

    return message.channel.send(
      new MessageEmbed()
      .setColor(0xe620a4)
      .setTitle(title)
      .setDescription(description)
      .addFields([
        { name: field_name_1, value: field_value_1 },
        { name: field_name_2, value: field_value_2 },
        { name: field_name_3, value: field_value_3 },
        { name: field_name_4, value: field_value_4 },
        { name: field_name_5, value: field_value_5 },
      ])
      .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`)
    );
  }
}
