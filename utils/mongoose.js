const mongoose = require('mongoose');
const connector = 'mongodb://botAdmin:${process.env.MONGODB}@botdev-shard-00-00-pblka.mongodb.net:27017,botdev-shard-00-01-pblka.mongodb.net:27017,botdev-shard-00-02-pblka.mongodb.net:27017/test?replicaSet=BotDev-shard-0&ssl=true&authSource=admin'

module.exports = {
  init:() => {
    const dbOptions = {
      useUnifiedTopology:true,
      useNewUrlParser: true,
      autoIndex: false,
      poolSize: 5,
      connectTimeoutMS: 10000,
      family: 4
    };

    mongoose.connect(connector,dbOptions)
    mongoose.set('useFindAndModify',false);
    mongoose.Promise = global.Promise;

    mongoose.connection.on(`connecting`, () => {
      console.log(`Connecting to MongoDB server...`)
    });

    mongoose.connection.on(`connected`, () => {
      console.log('Mongoose connection established!');
    });

    mongoose.connection.on('err', err => {
      console.error(`Mongoose connection error:\n ${err.stack}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose connection to MongoDB server disconnected!');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('Mongoose connection to MongoDB server reconnected.')
    });

  }
};
