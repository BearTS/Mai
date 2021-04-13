module.exports = {
  data: {
    name: 'ping',
    description: 'Pong poggers.'
  },
  response: (response, interaction) => {

    // P.S. You cannot send an ephemeral message with
    // embed and files.
    const content = response.user.client.ws.ping + ' ms';
    return response.send(content, { ephemeral: true });
  }
};
