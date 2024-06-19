const express = require("express");
const morgan = require("morgan");
const cors = require('cors');

const choiceRouter = require("./routes/choiceRoutes");
const answerRouter = require("./routes/answerRoutes");
// const userRouter = require("./routes/userRoutes");
const ratingRouter = require("./routes/ratingRoutes");
const webhookRouter = require("./routes/webhookRoutes");

const app = express();
app.use(cors());

// MIDDLEWARES
if (process.env.NODE_ENV === "development") {
    app.use(morgan("combined"));
}
app.use(express.json());

// ROUTES
// app.use("/api/v1/choice", choiceRouter);
// app.use("/api/v1/answer", answerRouter);
// app.use("/api/v1/rating", ratingRouter)
// app.use("/api/v1/user", userRouter);
app.use("/webhook", webhookRouter);

// Uncomment if token generation is needed
// app.get('/token/:userId', (req, res) => {
//     const userId = req.params.userId;
//     const token = client.createToken(userId);
//     res.send({ token });
// });

module.exports = app;
