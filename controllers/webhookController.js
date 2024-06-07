const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const api_key = "3gz3rab6wg27"
const secret = "ynbxpurm2jq62cgt593vjjkyybcv9qvu6r3qe5bndqbvzsdpjvvsa4qvc68ds5wb"
const app_id = "1315407"

const StreamChat = require("stream-chat").StreamChat;
const client = StreamChat.getInstance(api_key, secret, app_id);

const controller = require("./choiceController");
const answerController = require("./answerController");

// const createChannel = async () => {
//     const channel = client.channel("messaging", {
//         members: ["limebot", "1"],
//         created_by_id: "limebot"
//     });

//     try {
//         console.log("Creating channel...");
//         await channel.create();
//         console.log("Channel created successfully.");
//     } catch (error) {
//         console.error("Error creating channel:", error);
//     }

//     return channel;
// }

const joinChannel = async (id) => {
    const channel = client.channel("messaging", id);
    return channel;
}

const watchChannel = async (channel) => {
    const state = await channel.watch();

    return state;
}

const sendMessage = async (channel, text, attachments, user_id) => {
    const message = await channel.sendMessage({
        text: text,
        attachments: attachments,
        user_id: user_id
    });

    return message;
}

exports.webhookHandler = async (req, res) => {
    const parent_id = req.params.id;
    // CREATE CHANNEL
    // const channel = await createChannel();
    const channel = await joinChannel("SERVER_TEST_HHE"); // odoohondoo channel_id ni static
    // WATCH CHANNEL
    const state = await watchChannel(channel);

    // CHECKING IF EVENT IS "MESSAGE.NEW" AND ID IS PROVIDED
    if (parent_id && req.body.type === "message.new") { //odoohondoo urgelj "message.new" bn gj bodson
        let choice = await controller.getChoice(parent_id);

        //--- CHOICE байхгүй үед answer буцаана ---
        if (choice.length === 0) {
            const answer = await answerController.getAnswer(parent_id);
            return res.status(200).json({
                status: "success",
                data: {
                    answer: answer
                }
            });
        }

        // SENDING MESSAGE TO USER FROM DATABASE
        for (let i = 0; i < choice.length; i++) {
            const message = await sendMessage(channel, choice[i].choice_content, [], "limebot");
        }

        //--- CHOICE байгаа үед choice буцаана ---
        return res.status(200).json({
            status: "success",
            data: {
                choice: choice
            }
        });
    }
}