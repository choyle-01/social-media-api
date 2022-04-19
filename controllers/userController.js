const { User, Thoughts } = require('../models');

module.exports = {
  // Get all user
  getUsers(req, res) {
    User.find()
      .then(async (user) => {
        const userObj = {user};
        return res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select('-__v')
      .populate('thoughts')
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: 'No User with that ID' })
          : res.json({user})
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a user 
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) =>
        res.status(200).json({ message: 'User successfully deleted' })
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  // Update a User by Id
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with this id!' })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
  addFriend({ params }, res) {
    User.findOneAndUpdate(
        { _id: params.userId },
        { $push: { friends: params.friendId } },
        { new: true }
    )
        .then(user => {
            if (!user) {
                res.status(404).json({ message: 'No User Found Using This ID!' });
                return;
            }
            res.json(user)
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
},
deleteFriend({ params }, res) {
  User.findOneAndUpdate(
      { _id: params.userId },
      { $pull: { friends: params.friendId } },
      { new: true }
  )
      .then(user => {
          if (!user) {
              res.status(404).json({ message: 'No User Found Using This ID!' });
              return;
          }

          res.json(user);
      })
      .catch(err => {
          console.log(err);
          res.status(400).json(err);
      })
}
}