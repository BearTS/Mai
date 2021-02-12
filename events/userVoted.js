const { MessageEmbed } = require('discord.js');
const profile = require('../models/Profile');
const text = require('../util/string');

module.exports = (client, req, res) => profile.findById(req.vote.user, async (err, doc) => {

  const user = await client.users.fetch(req.vote.user).catch(()=>{ return {}});
  const isWeekend = req.vote.isWeekend;
  const reward =  isWeekend ? 1500 : 750;
  const reason = [
    'there was an error accessing your profile from the database!',
    'you did not register to the economy system first. Use the command `register` to register and receive vote rewards.'
  ];

  if (err){
    return user?.send([
      `\`❌ | **${user.tag}**, seems like you voted me on top.gg, but ${reason[0]}`,
      `Should you receive this message, please reache out to Sakurajimai#6742 immediately. Prepare also a screenshot of this message.`
    ].join('\n')).catch(() => {
      return console.log(`[VOTE_EVENT]: Could not send message to user ${req.vote.user}`);
    });
  };

  if (!doc){
    return user?.send([
      `\`❌ | **${user.tag}**, seems like you voted me on top.gg, but ${reason[1]}`
    ].join()).catch(() => {
      return console.log(`[VOTE_EVENT]: Could not send message to user ${req.vote.user}`);
    });
  };

  doc.data.economy.bank += reward;

  return doc.save()
  .then(() => {
    const message = [
      `<a:animatedcheck:758316325025087500> | **${user.tag}**, Thanks for voting!`,
      `You received **${text.commatize(reward)}**${isWeekend ? '**(Double Weekend Reward)**' : ''} credits as a reward!`,
      `Don't want to get notified of every vote you make? Use the command \`${client.prefix}togglevotenotif\` to enable/disable vote notifications! (Does not prevent you from receiving rewards)`
    ].join('\n')

    if (profile.data.vote.notification){
      user?.send(message).catch(()=>{
        return console.log(`[VOTE_EVENT]: Could not send message to user ${req.vote.user}`);
      });
    };

    return;
  });
});
