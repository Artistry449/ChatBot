const dotenv = require("dotenv");
const { serverClient, createToken } = require('./config/getstream');

dotenv.config({ path: "./config.env" });

const app = require("./app");

const port = process.env.PORT;
// app.listen(port, () => {
//     console.log(`${port} порт дээр сервер амжилттай аслаа!`);
// });

async function connectUser() {
    try {
      const token = createToken('divine-snow-5'); // Generate token for the user
  
      await serverClient.connectUser(
        {
          id: 'divine-snow-5',
          name: 'divine',
          image: 'https://bit.ly/2u9Vc0r',
        },
        token
      );
      console.log('User connected');
      return serverClient;
    } catch (error) {
      console.error('Error connecting user:', error);
    }
  }
  
  async function createAndWatchChannel() {
    try {
      const channel = serverClient.channel('messaging', 'the-small-council_Qx74tf3XHG', {
        name: 'Private Chat About the Kingdom',
        image: 'https://bit.ly/2F3KEoM',
        members: ['divine-snow-5'],
        session: 8, // custom field
      });
  
      await channel.watch();
      console.log('Channel created and watched');
      return channel;
    } catch (error) {
      console.error('Error creating or watching channel:', error);
    }
  }
  
  async function main() {
    await connectUser();
    const channel = await createAndWatchChannel();
  
    if (!channel) return;
  
    await channel.sendMessage({
      text: 'Did you already see the trailer? https://www.youtube.com/watch?v=wA38GCX4Tb0',
    });
  
    const parentMessage = await channel.sendMessage({
      text: 'Episode 1 just blew my mind!',
    });
  
    if (parentMessage) {
      await channel.sendMessage({
        text: 'Stop it, no spoilers please!',
        parent_id: parentMessage.id,
        customField: 123,
      });
    }
  
    channel.on('message.new', event => {
      console.log('New message event:', event);
    });
  
    await channel.sendMessage({
      text: 'What is the medieval equivalent of tabs vs spaces?',
    });
  }
  
  main().catch(console.error);
  
  app.listen(port, () => {
    console.log(`Сервер http://localhost:${port} дээр амжилттай аслаа`);
  });