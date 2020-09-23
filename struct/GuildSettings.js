module.exports = class GuildSettingProfile{
    constructor(data){
        this.id = data.guildID
        this.welcome = {
          channel: data.welcomeChannel,
          message: data.welcomemsg
        }
        this.goodbye = {
          channel: data.goodbyeChannel,
          message: data.goodbyemsg
        },
        this.xp = {
          active: data.isxpActive,
          exceptions: data.xpExceptions
        },
        this.roles = {
          muted: data.muterole
        }
        this.invite = data.invite
        this.suggestChannel = data.suggestChannel
    }
}
