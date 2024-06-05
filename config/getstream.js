const StreamChat = require('stream-chat').StreamChat;

const serverClient = StreamChat.getInstance('wjzv4p2fckh6', 't5cgyx2wcex83bz9kvms4prq8cu7zxdvwfuzkj7cr54wmcxv5jrwy85afyeqrsx5');

function createToken(userId) {
    return serverClient.createToken(userId);
  }
  
  module.exports = { serverClient, createToken };