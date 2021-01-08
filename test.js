// NOTE: ./struct not included on test

const options = {
  paths: [
    'action', 'anime', 'bot',
    'core', 'fun', 'moderation',
    'owner', 'setup', 'social','utility'
  ]
};

const { readdir } = require('fs');

// Test events
for (const path of options.paths){
  readdir(`./commands/${path}`, (err, files) => {
    files.filter(file => file.split('.').pop === 'js').forEach(file => {
      require(`./commands/${path}/${file}`);
    });
  });
};

// Test events
readdir(`./events`, (err, files) => {
  files.filter(file => file.split('.').pop() === 'js').forEach(file => {
    require(`./events/${file}`);
  });
});

// Test JSON assets
readdir('./assets/json', (err, files) => {
  files.filter(file => file.split('.').pop() === 'json').forEach(file => {
    require(`./assets/json/${file}`);
  });
});

// Test utils
readdir('./util', (err, files) => {
  files.filter(file => file.split('.').pop() === 'js').forEach(file => {
    require(`./util/${file}`);
  });
});

// Test ./utils/games
readdir('./util/games', (err, files) => {
  files.filter(file => file.split('.').pop() === 'js').forEach(file => {
    require(`./util/games/${file}`);
  });
});

// End of Test
