const profile = require('../../models/Profile');

const commandEnabled = false;

module.exports = {
  name: 'resumestreak',
  aliases: ["rs"],
  guildOnly: true,
  ownerOnly: false,
  group: 'social',
  description: 'Resume your streak if reported downtime caused a streak reset.',
  requiresDatabase: true,
  examples: [
    'resumestreak <message PL / ID>'
  ],
  run: (client, message, [streakMessage]) => profile.findById(message.author.id, async (err,doc) => {
    
    if(!commandEnabled) return message.channel.send("No downtime has been reported recently.");
    
    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    } else if (!doc || doc.data.economy.wallet === null){
      return message.channel.send(`\\❌ **${message.author.tag}**, You don't have a *wallet* yet! To create one, type \`${client.prefix}register\`.`);
    }
    
    let messageID, channelID;

    if(isNaN(Number(streakMessage))) {
        messageID = streakMessage;
        channelID = message.channel.id;
    } else if (streakMessage.split("-").length === 2)  {
        channelID = streakMessage.split("-")[0];
        messageID = streakMessage.split("-")[1];
    } else if (streakMessage.search("discord.com/channels") !== -1) {
        channelID = streakMessage.replace(/^(https?:\/\/)?((ptb|canary)\.)?discord\.com\/channels\/([0-9]+)\/([0-9]+)\/([0-9]+)$/, "$5");
        messageID = streakMessage.replace(/^(https?:\/\/)?((ptb|canary)\.)?discord\.com\/channels\/([0-9]+)\/([0-9]+)\/([0-9]+)$/, "$6");
    } else {
      return message.channel.send("```\nmai resumestreak <message PL / ID>\n                 ^^^^^^^^^^^^^^^^^\nrequired argument \"<message PL / ID>\" is missing```");
    }
    
    if(!channelID || !messageID) {
      return message.channel.send("Unable to parse `channelID` and `messageID` from provided value for argument `<message PL / ID>`.");
    }

    const channel = client.channels.cache.get(channelID);
    
    if(!channel) return message.channel.send("Unable to resolve provided `channelID`.");
    if(channel.type !== "text") return message.channel.send("Product of resolved `channelID` is not of type `textChannel`.");
    
    const botMessage = await channel.messages.fetch(messageID).catch();
    
    if(!botMessage) return message.channel.send("Unable to resolve provided `messageID` in provided channel.");
    
    if(botMessage.message.author.id !== client.user.id) return message.channel.send("Product of resolved `messageID` is not authored by me.");
    
    if(botMessage.createdTimestamp < Date.now() - 4.32e8) return message.channel.send("Product of resolved `messageID` is more than 5 days old.");
    
    if(!botMessage.content || botMessage.content.search("**Streak x") === -1) return message.channel.send("Product of resolved `messageID` is not the response of a supported command.");
    
    const previousStreak = Number(botMessage.content.split("\n").find(e => e.startsWith("**Streak x")).replace(/^\*\*Streak x([0-9,]+)\*\*$/, "$1"));
    
    if(!previousStreak || isNaN(previousStreak)) return message.channel.send("Product of resolved `messageID` is not the response of a supported command.");
    
    if(previousStreak < 5) return message.channel.send("Minimum streak length required to resume is `5`.");

    doc.data.economy.streak.current = previousStreak + 1;
    doc.data.economy.streak.timestamp = Date.now() + 72e6;
    
    await doc.save().then(_ => message.channel.send("Resumed streak successfully!")).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
  })
};
