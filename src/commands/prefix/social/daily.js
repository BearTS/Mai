const { Permissions: { FLAGS }} = require('discord.js');

const moment   = require('moment');
const { join } = require('path');
const market   = require(join(__dirname, '../../../', 'assets/json/market.json'));

module.exports = {
  name             : 'daily',
  description      : 'Retrieve your daily reward <3',
  aliases          : [],
  cooldown         : { time: 3e3 },
  clientPermissions: [],
  permissions      : [],
  guildOnly        : false,
  rankcommand      : false,
  requiresDatabase : true,
  group            : 'social',
  parameters       : [],
  examples         : [ 'daily' ],
  run              : async (message, language, args) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix });
    const rewardable = market.filter(x => !!x.price);
    const profile    = message.client.database.Profile;
    const document   = message.author.profile || await profile.findById(message.author.id) || new profile({ _id: message.author.id });
    const timestamp  = document.data.economy.streak.timestamp;
    const supporter  = Boolean(await message.client.guilds.fetch('703922441768009731').then(g => g.members.fetch(message.author.id)).catch(() => {}));
    const { NUMBER } = message.client.services.UTIL;

    if (document instanceof Error){
      parameters.assign({ '%ERROR%': document.message });
      return message.channel.send(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };

    const hasvoted   = await new Promise((res,rej) => {
      setTimeout(() => rej(false), 3000 /*wait 3 seconds before fail*/);

      return message.client.votes.top_gg.api.hasVoted(message.author.id)
      .then(result => res(result === true))
    }).catch(err   => false);

    let streakreset = false, daysSinceLastDaily, itemreward;

    if (timestamp !== 0 && timestamp - Date.now() > 0){
      const DICT = language.getDictionary([ 'hour(s)', 'minute(s)', 'second(s)']);
      parameters.assign({ '%TIME%': moment.duration(document.data.economy.streak.timestamp - Date.now(), 'milliseconds').format(`H [${DICT['HOUR(S)']}] m [${DICT['MINUTE(S)']}] s [${DICT['SECOND(S)']}]`)});
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'DAILY_CLAIMED' , parameters }));
    };

    if (timestamp + 864e5 < Date.now()){
      document.data.economy.streak.current = 1;
      daysSinceLastDaily = Math.ceil((Date.now() - timestamp) / 864e5) - 1;
      streakreset        = true;
    } else {
      document.data.economy.streak.current++;
      if (document.data.economy.streak.current % 10 === 0){
        itemreward  = rewardable[Math.floor(Math.random() * rewardable.length)];
        const index = document.data.profile.inventory.findIndex(x => x.id === itemreward.id);
        const _item = document.data.profile.inventory.splice(...[index < 0 ? [0,0] : [index,1]].flat())[0];
        document.data.profile.inventory.push({ id: itemreward.id, amount: _item?.amount + 1 || 1 });
      };
    };

    document.data.economy.streak.timestamp = Date.now() + 72e6;
    const amount = 500 + 30 * document.data.economy.streak.current;
    const bonus  = supporter ? amount * 0.2 : 0
    document.data.economy.bank += amount + bonus;

    return document.save()
    .then(async document => {
      message.author.profile = document;
      parameters.assign({
        '%ITEM%'       : itemreward?.name,
        '%DESCRIPTION%': itemreward?.description,
        '%REWARD%'     : NUMBER.separate(amount),
        '%SUPPORTER%'  : NUMBER.separate(bonus),
        '%STREAK%'     : document.data.economy.streak.current
      });
      const daily_successful = language.get({ '$in': 'COMMANDS', id: 'DAILY_SUCCESS', parameters });
      const daily_supporter  = supporter   ? '\n' + language.get({ '$in': 'COMMANDS', id: 'DAILY_SUPPORTER', parameters }) : '';
      const daily_itemreward = itemreward  ? '\n' + language.get({ '$in': 'COMMANDS', id: 'DAILY_ITEMRWARD', parameters }) : '';
      const daily_hasnotvotd = !hasvoted   ? '\n' + language.get({ '$in': 'COMMANDS', id: 'DAILY_HASNTVOTD', parameters }) : '';
      const daily_strkreset  = '\n' + language.get({ '$in': 'COMMANDS', id: `DAILY_STRK${streakreset ? 'RESET' : 'ADDED'}`, parameters });
      return message.channel.send(daily_successful+daily_supporter+daily_itemreward+daily_strkreset+daily_hasnotvotd);
    })
    .catch(err => {
      parameters.assign({ '%ERROR%': err.message });
      return message.channel.send(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
    });
  }
};
