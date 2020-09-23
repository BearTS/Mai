const { Collection } = require('discord.js')
const CommandGroup = require('./CommandGroup')
const CommandRegister = require('./CommandRegister')
const CooldownManager = require('./CooldownManager')

module.exports = class CommandManager{
    constructor({groups}){
        this._groups = groups
        this.groups = new CommandGroup(groups)
        this.registers = new Collection()
        this.cooldowns = new Collection()
    }

    add(command){

      const group = this.groups.get(command.group)

      if (!group) throw new TypeError(`CommandRegistry Error: ${command.name ? command.name : `A nameless command`} has no group. Please specify the group name and make sure it is valid.`)

      group.set(command.name, command)
      this.registers.set(command.name, new CommandRegister(command))

      if (command.cooldown) this.cooldowns.set(command.name, new CooldownManager(command))
      return this

    }

    async reload(query){

      const register = this.registers.get(query) || this.registers.find( c => c.names.includes(query))

      if (!register) return { status: 'FAILED', err: { stack: `TypeError: Couldn't find a command with name/alias "${query}".\n\n\n\n`}}

      let command = this.groups.get(register.group).get(register.name)

      try {

        try {

          delete require.cache[require.resolve(`../commands/${command.group}/${command.name}.js`)]
         } catch (err) {
           console.log(err)
          return {status: 'FAILED', err: { stack: 'TypeError: Command-name and Command-filename mismatch.\n\n\n\n'}}
         }

        const newCommand =  require(`../commands/${command.group}/${command.name}`)

        const group = this.groups.get(newCommand.group)

        if (!group) throw new TypeError('Unidentified group declared on new command file.')

        group.set(newCommand.name, newCommand)
        this.registers.set(newCommand.name, new CommandRegister(newCommand))

        if (!newCommand.cooldown) this.cooldowns.delete(newCommand.name)

        return { status: 'OK', info: newCommand}

      } catch (err) {

        return { status: 'FAILED', err }

      }

    }

    get(query){
      const register = this.registers.get(query) || this.registers.find( c => c.names.includes(query))

      if (!register) return undefined

      register.used++

      return this.groups.get(register.group).get(register.name)
    }

    get size(){
      let size = 0
      for ( const group of this._groups ) {
        size += this.groups.get(group).size
      }
      return size
    }

}
