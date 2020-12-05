const _fetch = require('node-fetch');

function fetch(query, variables){
  return _fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({ query, variables })
  })
  .then(res => res.json())
  .catch(err => err);
};

module.exports = { fetch };
