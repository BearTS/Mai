const settings = require('./../botconfig.json');
let prefix = settings.prefix;
const AniSchedule = require('./../utils/anischedule/main.js')
const xpSchema = require('./../models/xpSchema.js')
const talkedRecently = new Set()


module.exports = (bot,message) => {

    if(message.content.toString().toLowerCase() === "prefix") return message.channel.send(`My prefix is **${settings.prefix}**`)

    if (message.content.startsWith(prefix)){
      if(message.author.bot) return;
      if(message.channel.type === "dm") return;
      let messageArray = message.content.split(/ +/);
      let cmd = messageArray[0];
      let args = messageArray.slice(1);
      let commandfile = bot.commands.get(cmd.slice(prefix.length)) || bot.commands.find(command => command.help.aliases && command.help.aliases.includes(cmd.slice(prefix.length)));
      if (commandfile) commandfile.run(bot,message,args);
        }

 //--------------------------------------/AniSchedule Code/-----------------------------//

        AniSchedule.readCommand(message)

//------------------------XP SYSTEM CODE-----------------------//


          if (message.author.bot) return;
          if (message.content.startsWith(prefix)) return;
          if (talkedRecently.has(message.author.id)) return;

          xpSchema.findOne({
            guildID: message.guild.id,
            userID: message.author.id
          },(err,xp)=>{
            if (!xp){
              const registered = new xpSchema({
                guildID: message.guild.id,
                userID: message.author.id,
                xp: 0,
                level: 1
              })
            return registered.save()
            }
            let curxp = xp.xp;
            let curlvl = xp.level;
            let lvlcap = 150 * (curlvl * 2);
            let nxtlvl = xp.level * lvlcap;
            let nxtlvlXP = lvlcap * curlvl; // check if wrong change curlvl to curxp
            let difference = nxtlvlXP - curxp;
            let xpAdd = Math.floor(Math.random() * 10) + 15;

            xp.xp = curxp + xpAdd
            if(nxtlvl <= xp.xp){
              xp.level = curlvl + 1;
            }
            xp.save()
            talkedRecently.add(message.author.id);
            setTimeout(()=>{
              talkedRecently.delete(message.author.id);
            }, 60000);
          })
    }
