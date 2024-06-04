const express = require("express");

const router = express.Router();

const choiceController = require("../controllers/choiceController");

router.route("/")
    .get(choiceController.getChoices)
    .post(choiceController.createChoice);

router.route("/:id")
    .get(choiceController.getChoice)
    .patch(choiceController.updateChoice)
    .delete(choiceController.deleteChoice)

module.exports = router;