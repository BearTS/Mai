const { CooldownManager } = require('../struct/CooldownManager')

module.exports = (message, command) => {

  if (
    !command.cooldown
    || !command.cooldown.time
  ) return {
      accept: true
  }


  const cmdcooldown = message.client.commands.cooldowns.get(command.name)
  || message.client.commands.cooldowns.set(command.name, new CooldownManager(command))
    .get(command.name)


  if (
    cmdcooldown.users.has(message.author.id)
  ) return {
      accept: false
    , timeLeft: cmdcooldown.users.get(message.author.id).timestamp - Date.now()
  }


  cmdcooldown.users.set(
      message.author.id
    , { timestamp: Date.now() + command.cooldown.time }
  )

  setTimeout(
    () => cmdcooldown.users.delete(message.author.id)
    , command.cooldown.time
  )

  return {
      accept: true
  }
}
