module.exports = (client, error, message) => {

    switch (error) {
        case 'NotPlaying':
            message.channel.send(`There is no music being played on this server!`);
            break;
        case 'NotConnected':
            message.channel.send(`You are not connected in any voice channel!`);
            break;
        case 'UnableToJoin':
            message.channel.send(`I am not able to join your voice channel, Check my permissions !`);
            break;
        default:
            message.channel.send(`Something went wrong : ${error}`);
    };
};
