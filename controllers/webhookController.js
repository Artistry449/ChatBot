const StreamChat = require("stream-chat").StreamChat;

const controller = require("./choiceController");
const answerController = require("./answerController");

const api_key = process.env.api_key
const secret = process.env.secret
const app_id = process.env.app_id

const client = StreamChat.getInstance(api_key, secret, app_id);

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

const checkID = (id) => {
    if (!isNaN(id) && typeof id === "number")
        return true;
    if (typeof id === "string" && /^[+-]?\d+(\.\d+)?$/.test(id))
        return true;
    return false;
};


exports.webhookHandler = async (req, res) => {
    let isBotIncluded = false;
    const members = req.body.members;

    for (let i = 0; i < members.length; i++) {
        if (members[i].user_id === "limebot") {
            isBotIncluded = true;
            break;
        }
    };

    if (isBotIncluded) {

        // Bot-руу мессэж бичиж буй channel-ийн id
        const channel_id = req.body.channel_id;

        // Одоо байгаа channel-руу орох
        const channel = await joinChannel(channel_id);

        // // DO NOT UNCOMMENT UNLESS YOU WANT POWER - Хэрэглэгчийн мессэж бичиж буй channel-рүү bot-ийг нэмэх
        // await channel.addMembers([{
        //     user_id: 'limebot',
        // }]);

        // Тухайн channel-ийг watch хийж эхэлсний дараа тухайн choice_id-аар баазаас контентоор үйлчлэх
        await watchChannel(channel).then(async () => {

            // Channel дээр шинэ мессэж ирсэн, мөн уг шинэ мессэж нь "limebot" бот-оос өөр хэрэглэгч бичсэн үед ажиллах
            if (req.body.user.id !== "limebot" && req.body.type === "message.new") {
                // Гаднаас хариултыг нь авахыг хүсэж буй товчны id
                const choice_id = Number(req.body.message.choice_id);

                let isValid = checkID(choice_id);

                if (isValid) {
                    // Ирсэн id-ийн харгалзах choice-ийг хайх
                    let choice = await controller.getChoice(choice_id);
                    // Хэрвээ хэрэглэгчийн сонгосон id-тай choice олдохгүй бол answer хүснэгтээс хайна
                    if (choice == false) {
                        choice = await answerController.getAnswer(choice_id);
                        // Answer хүснэгтээс мөн олдохгүй бол 404 буцаах
                        if (choice == null) {
                            return res.status(404).json({
                                status: "fail",
                                message: "Not Found"
                            });
                        }
                        // Олдсон үр дүнгийн сүүлд нь эцэг элементийг нь явуулах
                        const parent_content = await controller.getParentChoice(choice_id);
                        let result = [];
                        result.push(choice);
                        result.push(parent_content);

                        sendMessage(channel, JSON.stringify(result), [
                            { bot_type: "limebot" },
                        ], "limebot");

                        return res.status(200).json({
                            status: "success"
                        });
                    }
                    // Олдсон үр дүнгийн сүүлд нь эцэг элементийг нь явуулах
                    const parent_content = await controller.getParentChoice(choice_id);
                    choice.push(parent_content);

                    // "limebot"-ийн id-аар channel-руу chat бичих
                    sendMessage(channel, JSON.stringify(choice), [
                        { bot_type: "limebot" },
                    ], "limebot");
                    return res.status(200).json({
                        status: "success"
                    });
                };
            }
            else {
                return res.status(400).json({
                    status: "fail",
                    message: "Invalid id"
                });
            }
        });
    }
}