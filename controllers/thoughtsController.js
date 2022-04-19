const { User, Thoughts } = require('../models');

module.exports = {
  // Get all thoughts
  getThoughts(req, res) {
    Thoughts.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },
  // Get a thought
  getSingleThought(req, res) {
    Thoughts.findOne({ _id: req.params.thoughtId })
      .then((thoughts) =>
        !thoughts
          ? res.status(404).json({ message: 'No thought with that ID' })
          : res.json(thoughts)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a thoughts
  createThought(req, res) {
    console.log(req.body)
    Thoughts.create(req.body)
    .then((thought) => {
        console.log(req.body);
        return User.findOneAndUpdate(
          { _id: req.body.userId }, 
          { $push: { thoughts: thought._id } }, 
          { new: true });
      })
      .then((user) =>
        !user ?
        res
        .status(404)
        .json({
          message: 'Thought created, but found no user with that ID'
        }) :
        res.json('Thought created')
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Delete a thought
  deleteThought(req, res) {
    Thoughts.findOneAndDelete({ _id: req.params.thoughtId })
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with that ID' })
          : User.deleteMany({ _id: { $in: thought.users } })
      )
      .then(() => res.json({ message: 'Thought deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  // Update a thought
  updateThought(req, res) {
    Thoughts.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: 'No thought with this id!' })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
  createReaction({ params, body }, res) {
    Thoughts.findOneAndUpdate(
        { _id: params.thoughtId },
        { $push: { reactions: body } },
        { new: true, runValidators: true }
    )
        .then(thoughts => {
            if (!thoughts) {
                res.status(404).json({ message: 'No Thoughts Using This ID Found!' });
                return;
            }

            res.json(thoughts);
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
},
removeReaction({ params }, res) {
  Thoughts.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId } } },
      { new: true }
  )
      .then(thoughts => {
          if (!thoughts) {
              res.status(404).json({ message: 'No thoughts found at this id!' });
              return;
          }

          res.json(thoughts);
      })
      .catch(err => {
          console.log(err);
          res.status(400).json(err);
      });
}
};
