const { Thought, User } = require("../models");

const thoughtControl = {
    getAllThoughts(req, res) {
        Thought.find({})
            .populate({
                path: "thoughts",
            })
            .sort({ _id: -1 })
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => {
                res.status(400).json(err);
            });
    },

    // Grabs only one thought with the _id
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.thoughtId })
            .populate({
                path: "thoughts",
            })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No thoughts found with this id!" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => {
                res.status(400).json(err);
            });
    },
    // POST - Create new thoughts 
    addThoughts({ params, body }, res) {
        Thought.create(body)
            .then(({ _id }) => {
                console.log(_id);
                return User.findOneAndUpdate(
                    { _id: body.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then((dbUserData) => {
                console.log(dbUserData);
                if (!dbUserData) {
                    res.status(404).json({ message: "No user found with this id" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
    },
    // PUT - update thoughts with _id
    updateThought({ params, body }, res) {
        console.log(params.thoughtId);
        console.log(body);
        Thought.findOneAndUpdate({ _id: params.thoughtId }, body, {
            new: true,
            runValidators: true,
        })
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No thoughts found with this id" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.status(400).json(err));
    },

    // DELETE - removes thoughts according to _id
    removeThoughts({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
        .then((deletedThought) => {
            if (!deletedThought) {
                return res.status(404).json({ message: "No thought with this id!"});
            }
            console.log(deletedThought);
            User.findOneAndUpdate(
                { username: deletedThought.username },
                { $pull: { thoughts: params.thoughtId } },
                { new: true }
            ).then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No user found with this id" });
                    return;
                }
                res.json(dbUserData);
            });
        })
        .catch((err) => res.json(err));
    },
    // POST - creates reaction
    addReaction({ params, body}, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then((dbUserData) => {
                if (!dbUserData) {
                    res.status(404).json({ message: "No user found with this id" });
                    return;
                }
                res.json(dbUserData);
            })
            .catch((err) => res.json(err));
    },
    // DELETE - remove reaction according to reactionId
    removeReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { new: true }
        )
            .then((dbUserData) => res.json(dbUserData))
            .catch((err) => res.json(err));
    },
};

module.exports = thoughtControl;