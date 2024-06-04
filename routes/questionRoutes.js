const express = require("express");

const router = express.Router();

const questionController = require("./../controllers/questionController");

router.route("/")
    .get(questionController.getQuestions)
    .post(questionController.createQuestion);

router.route("/:id")
    .get(questionController.getQuestion)
    .patch(questionController.updateQuestion)
    .delete(questionController.deleteQuestion)

module.exports = router;