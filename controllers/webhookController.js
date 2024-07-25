const StreamChat = require("stream-chat").StreamChat;

const controller = require("./choiceController");
const answerController = require("./answerController");
const ratingController = require("./../controllers/ratingController");

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

const timers = new Map();
const setReminder = (channel_id, channel) => {
    if (timers.has(channel_id)) {
        clearTimeout(timers.get(channel_id));
    }

    const timerId = setTimeout(() => {
        sendMessage(channel, "Таньд үйлчилгээ авахад хэр хялбар байсан бэ?",
            [
                {
                    text: "rating"
                }
            ],
            "limebot");
        timers.delete(channel_id);
    }, 1 * 60 * 1000);

    timers.set(channel_id, timerId);
};


exports.webhookHandler = async (req, res) => {
    let isBotIncluded = false;

    if (req.body.members) {

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

            // Тухайн channel-ийг watch хийж эхэлсний дараа тухайн choice_id-аар баазаас контентоор үйлчлэх
            await watchChannel(channel).then(async () => {
                const messages = channel.state.messages;
                const last_message = messages[messages.length - 1];
                // Channel дээр шинэ мессэж ирсэн, мөн уг шинэ мессэж нь "limebot" бот-оос өөр хэрэглэгч бичсэн үед ажиллах
                if (req.body.user.id !== "limebot" && req.body.type === "message.new" && last_message.text !== "Ажилтантай холбогдох") {
                    // Гаднаас хариултыг нь авахыг хүсэж буй товчны id
                    const choice_id = Number(req.body.message.choice_id);

                    if (last_message.rating && last_message.rating === true) {

                        const user_id = last_message.user.id;
                        const user_rating = last_message.text;

                        console.log(last_message);
                        console.log("-----user rating:\n");
                        console.log(user_rating);

                        try {
                            await ratingController.createRating(user_id, user_rating)
                            sendMessage(channel, "Үнэлгээ өгсөн таньд баярлалаа. Өдрийг сайхан өнгөрүүлээрэй 😇", [], "limebot");
                        }
                        catch (error) {
                            console.log(error);
                        }

                    } else {
                        setReminder(channel_id, channel);
                    }

                    let isValid = checkID(choice_id);

                    if (isValid) {
                        // if (choice_id === 2) {
                        //     sendMessage(channel, "Сайн байна уу, LIME оператор удахгүй таньтай холбогдох болно. Та хэлэх зүйлээ үлдээнэ үү.", [], "limebot");
                        // }
                        // Ирсэн id-ийн харгалзах choice-ийг хайх
                        let choice = await controller.getChoice(choice_id);

                        // Хэрвээ хэрэглэгчийн сонгосон id-тай choice олдохгүй бол answer хүснэгтээс хайна
                        if (choice[0].childChoices == false) {
                            choice = await answerController.getAnswer(choice_id);

                            // Answer хүснэгтээс мөн олдохгүй бол 404 буцаах
                            if (choice == null) {
                                return res.status(404).json({
                                    status: "fail",
                                    message: "Not Found"
                                });
                            }
                            // Олдсон үр дүнгийн сүүлд нь эцэг элементийг нь явуулах
                            // const parent_content = await controller.getParentChoice(choice_id);
                            // let result = [];
                            // result.push(choice);
                            // result.push(parent_content);
                            sendMessage(channel, "Sent message", [
                                { text: JSON.stringify(choice) }
                            ], "limebot");

                            return res.status(200).json(choice);
                        }
                        // Олдсон үр дүнгийн сүүлд нь эцэг элементийг нь явуулах
                        // const parent_content = await controller.getParentChoice(choice_id);
                        // choice.push(parent_content);

                        // "limebot"-ийн id-аар channel-руу chat бичих
                        sendMessage(channel, "Sent message",
                            [
                                {
                                    text: JSON.stringify(choice)
                                },
                            ],
                            "limebot"
                        );
                        return res.status(200).json(choice);
                    };
                    return res.status(404).json({
                        status: "fail",
                        message: "Invalid id"
                    });
                }
                else if (req.body.user.id !== "limebot") {
                    sendMessage(channel, "Сайн байна уу, LIME оператор удахгүй таньтай холбогдох болно. Та хэлэх зүйлээ үлдээнэ үү.", [], "limebot");

                    return res.status(200).json();
                }
            });
        }
    }

}