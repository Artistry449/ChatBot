const express = require("express");
const morgan = require("morgan");

const choiceRouter = require("./routes/choiceRoutes");
const answerRouter = require("./routes/answerRoutes");
const userRouter = require("./routes/userRoutes");
// const messageRouter = require("./routes/messageRoutes");

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
app.use(express.json());

// ROUTES
app.use("/api/v1/choice", choiceRouter);
app.use("/api/v1/answer", answerRouter);
app.use("/api/v1/user", userRouter);

const StreamChat = require("stream-chat").StreamChat;

const api_key = "3gz3rab6wg27";
const secret = "ynbxpurm2jq62cgt593vjjkyybcv9qvu6r3qe5bndqbvzsdpjvvsa4qvc68ds5wb";
const app_id = "1315407";

const client = StreamChat.getInstance(api_key, secret, app_id);

const createChannel = async () => {

};

app.post("/webhook", async (req, res) => {
    // await createChannel();

    const channel = client.channel("messaging", {
        members: ["limebot", "1"],
        created_by_id: "limebot" // specifying the bot user who is creating the channel
    });

    try {
        console.log("Creating channel...");
        await channel.create();
        console.log("Channel created successfully.");
    } catch (error) {
        console.error("Error creating channel:", error);
    }
    // res.status(200).send({ message: "Channel creation triggered." });

    const state = await channel.watch();

    const message = await channel.sendMessage({
        text: "ochjinuuuuuuu",
        attachments: [],
        user_id: "limebot"
    });

    res.status(200).json({
        message
    })

});

// Uncomment if token generation is needed
// app.get('/token/:userId', (req, res) => {
//     const userId = req.params.userId;
//     const token = client.createToken(userId);
//     res.send({ token });
// });

module.exports = app;
