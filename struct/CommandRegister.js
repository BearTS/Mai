module.exports = class CommandRegister{
    constructor(command){
      this.name = command.name
      this.names = [ command.name ].concat(command.aliases)
      this.group = command.group
      this.used = 0
    }
}
