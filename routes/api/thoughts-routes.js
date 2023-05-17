const router = require("express").Router();

const { getAllThoughts, getThoughtById, addThoughts, updateThought, removeThoughts, addReaction, removeReaction } = require("../../controllers/thought-controller");

router.route("/").get(getAllThoughts).post(addThoughts);

router.route("/:thoughtId").get(getThoughtById).put(updateThought).delete(removeThoughts);

router.route("/:thoughtId/reactions").post(addReaction);

router.route("/:thoughtId/reactions/:reactionId").delete(removeReaction);

module.exports = router;