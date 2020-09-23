const mongoose = require('mongoose')

module.exports = class Mongoose{
  constructor({settings, password}){
    this.connector = `mongodb://botAdmin:${password}@botdev-shard-00-00-pblka.mongodb.net:27017,botdev-shard-00-01-pblka.mongodb.net:27017,botdev-shard-00-02-pblka.mongodb.net:27017/MaiDocs?replicaSet=BotDev-shard-0&ssl=true&authSource=admin`
    this.settings = settings
  }

  init(){
    mongoose.connect(this.connector, this.settings).catch(console.error)
    mongoose.set('useFindAndModify',false)
    mongoose.Promise = global.Promise

    mongoose.connection.on('connecting', () => console.log('Connecting to MongoDB...'))
    mongoose.connection.on('connected', () => console.log('Connected to MongoDB!'))
    mongoose.connection.on('err', (err) => console.log(`Mongoose Error:\n${err.stack}`))
    mongoose.connection.on('disconnected', () => console.log('Disconnected to MongoDB...'))
    mongoose.connection.on('reconnected', () => console.log('Reconnected to MongoDB!'))
  }
}
