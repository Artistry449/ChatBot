const express = require("express");
const webhookController = require("./../controllers/webhookController");
// const choiceController = require("./../controllers/choiceController");

const router = express.Router();

router.route("/:id?")
    .post(webhookController.webhookHandler);

module.exports = router;