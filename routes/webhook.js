const express = require('express');

const choiceController = require("./../controllers/choiceController");

const router = express.Router();

router.route("/")
    .post(choiceController.createChannel);

router.route("/:id")
    .get(choiceController.checkID, choiceController.getChoice)

module.exports = router;