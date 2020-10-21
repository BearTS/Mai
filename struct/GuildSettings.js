module.exports = class GuildSettingProfile{
    constructor(data){
        this.id = data.guildID
        this.welcome = {
          channel: data.welcomeChannel,
          message: data.welcomemsg,
          enabled: data.welcomeEnabled,
          embed: data.welcomeEmbed,
          use: data.welcomeUse
        }
        this.goodbye = {
          channel: data.goodbyeChannel,
          message: data.goodbyemsg,
          enabled: data.goodbyeEnabled,
          embed: data.goodbyeEmbed, 
          use: data.goodbyeUse
        },
        this.xp = {
          active: data.isxpActive,
          exceptions: data.xpExceptions
        },
        this.isEconomyActive = data.iseconomyActive,
        this.roles = {
          muted: data.muterole
        }
        this.invite = data.invite
        this.suggestChannel = data.suggestChannel
    }
}
