module.exports = {
  data: {
    name: 'ping',
    description: 'Pong poggers.'
  },
  response: (response, interaction) => {

    console.log(response)

    response.send('Pong');
  }
};
