const express = require("express");
const ratingController = require("./../controllers/ratingController");

const router = express.Router();

router.route("/")
    .get(ratingController.getRatings);
router.route("/:id")
    .get(ratingController.getRating)
    .post(ratingController.createRating);

module.exports = router;