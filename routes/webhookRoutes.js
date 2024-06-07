const express = require("express");
const webhookController = require("./../controllers/webhookController");

const router = express.Router();

router.route("/:id?")
    .post(webhookController.webhookHandler);

module.exports = router;