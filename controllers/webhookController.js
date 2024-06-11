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

// ID-аар нь channel руу орох
const joinChannel = async (id) => {
    const channel = client.channel("messaging", id);
    return channel;
}
// Watch channel
const watchChannel = async (channel) => {
    const state = await channel.watch();

    return state;
}
// Серверээс мессэж илгээх функц
const sendMessage = async (channel, text, attachments, user_id) => {
    const message = await channel.sendMessage({
        text: text,
        attachments: attachments,
        user_id: user_id
    });

    return message;
}

exports.webhookHandler = async (req, res) => {
    const choice_id = Number(req.body.message.choice_id);
    const channel_id = req.body.channel_id;

    const channel = await joinChannel(`${channel_id}`);

    // // DO NOT UNCOMMENT UNLESS YOU WANT POWER
    // await channel.addMembers([{
    //     user_id: 'limebot',
    // }]);

    await watchChannel(channel).then(async () => {
        if (req.body.user.id !== "limebot" && req.body.type === "message.new") {
            let choice = await controller.getChoice(choice_id);
            if (choice.length === 0) {
                choice = await answerController.getAnswer(choice_id);
            }
            else {
                const parent_content = await controller.getParentChoice(choice_id);
                choice.push(parent_content);
                sendMessage(channel, JSON.stringify(choice), [
                    { bot_type: "limebot" },
                ], "limebot");
            }
        };
    })
    return res.status(200).json({
        status: "success"
    });
}