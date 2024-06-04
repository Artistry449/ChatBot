const express = require("express");
const morgan = require("morgan");

const questionRouter = require("./routes/questionRoutes");
const answerRouter = require("./routes/answerRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
app.use(express.json());

// ROUTES
app.use("/api/v1/question", questionRouter);
app.use("/api/v1/answer", answerRouter);
app.use("/api/v1/user", userRouter);

module.exports = app;