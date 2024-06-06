const express = require('express');

const messageController = require("./../controllers/messageController");

const router = express.Router();

router.route("/")
    .get(messageController.createChannel);

module.exports = router;