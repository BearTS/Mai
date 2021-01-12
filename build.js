// runs on npm build command - updates command database for website use;
//
//

const { readdirSync, writeFile } = require('fs');
const files = [];

const paths = readdirSync('./commands').filter(x => x.split('.').length === 1);

for (const path of paths){
  const commands = readdirSync('./commands/' + path).filter(x => x.split('.').pop() === 'js');

  for (const command of commands){
    const file = require('./commands/' + path + '/' + command);


    const examples = file.examples;
    delete file.examples;
    file.examples = examples;
    delete file.run;

    files.push(file);
  };
};

const file = JSON.stringify(files, null, 2);
const path = './assets/json/command-database.json';

writeFile(path, file, (err) => {
  console.log({ err })
})
