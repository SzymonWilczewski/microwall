const router = require("express").Router();
const User = require("../models/User");
const mongoose = require("../config/mongo");

router.patch("/", async (req, res) => {
  User.findByIdAndUpdate(req.user._id.toString(), req.body)
    .then((user) => {
      if (user) {
        if (req.body?.old_password && req.body?.new_password) {
          user
            .changePassword(req.body.old_password, req.body.new_password)
            .then(() => res.json({ message: "apiUserPatchedSuccessfully" }))
            .catch((error) => res.status(422).json({ message: `api${error}` }));
        } else {
          res.json({ message: "apiUserPatchedSuccessfully" });
        }
      } else {
        res.status(404).json({ message: "apiNoUserFoundError" });
      }
    })
    .catch((error) => res.status(500).json({ message: `api${error}` }));
});

router.post("/friends/:id", async (req, res) => {
  try {
    const userId1 = new mongoose.Types.ObjectId(req.user._id.toString());
    const userId2 = new mongoose.Types.ObjectId(req.params.id);

    const user1 = await User.findById(req.user._id.toString());
    const user2 = await User.findById(req.params.id);

    // User doesn't exist
    if (!user2) {
      return res.status(404).json({
        message: "apiUserDoesNotExistError",
      });
    }
    // User Is Already a friend
    else if (
      user1.friends.findIndex((f) => f.user.equals(userId2) && f.status === 3) +
      1
    ) {
      return res.status(422).json({
        message: `apiUserIsAlreadyAFriendError`,
      });
    }
    // Cannot add yourself to friends
    else if (userId1.toString() === userId2.toString()) {
      return res.status(422).json({
        message: "apiCannotAddYourselfToFriendsError",
      });
    }
    // Send request
    else if (!(user1.friends.findIndex((f) => f.user.equals(userId2)) + 1)) {
      user1.friends.push({ user: userId2, status: 1 });
      user2.friends.push({ user: userId1, status: 2 });
      user1.save();
      user2.save();

      friendsWorkspace.emit("refresh");
      // friendsNotificationWorkspace.emit(userId1.toString(), "+");
      friendsNotificationWorkspace.emit("+", userId2.toString());
      // friendsNotificationWorkspace.emit("-", userId2.toString());
      return res.status(201).json({
        message: "apiFriendRequestSent",
      });
    }
    // Accept request
    else if (
      user1.friends.findIndex((f) => f.user.equals(userId2) && f.status === 2) +
      1
    ) {
      user1.friends.map((f) => (f.user.equals(userId2) ? (f.status = 3) : f));
      user2.friends.map((f) => (f.user.equals(userId1) ? (f.status = 3) : f));
      user1.save();
      user2.save();

      friendsWorkspace.emit("refresh");
      friendsNotificationWorkspace.emit("+", userId2.toString());
      postNotificationsWorkspace.emit("refresh");
      return res.status(201).json({
        message: "apiAddedToFriends",
      });
    } else {
      return res.status(500).json({
        message: "apiServerError",
      });
    }
  } catch (e) {
    return res.status(500).json({
      message: `api${e}`,
    });
  }
});

router.delete("/friends/:id", async (req, res) => {
  try {
    const userId1 = new mongoose.Types.ObjectId(req.user._id.toString());
    const userId2 = new mongoose.Types.ObjectId(req.params.id);

    const user1 = await User.findById(req.user._id.toString());
    const user2 = await User.findById(req.params.id);

    if (!user2) {
      return res.status(404).json({
        message: "apiUserDoesNotExistError",
      });
    } else if (!(user1.friends.findIndex((f) => f.user.equals(userId2)) + 1)) {
      return res.status(404).json({
        message: `apiNoFriendsToDeleteError`,
      });
    } else {
      user1.friends = user1.friends.filter((f) => !f.user.equals(userId2));
      user2.friends = user2.friends.filter((f) => !f.user.equals(userId1));
      user1.save();
      user2.save();

      friendsWorkspace.emit("refresh");
      friendsNotificationWorkspace.emit("-", userId2.toString());
      postNotificationsWorkspace.emit("refresh");
      return res.status(200).json({
        message: "apiSuccessfullyDeletedFriend",
      });
    }
  } catch (e) {
    return res.status(500).json({
      message: `api${e}`,
    });
  }
});

router.get("/friends/notifications", async (req, res) => {
  try {
    res.status(200).json({
      notifications: req.user.friends.filter((friend) => friend.status === 2)
        .length,
      message: "apiUsersFound",
    });
  } catch (error) {
    res.status(500).json({ message: `api${error}` });
  }
});

module.exports = router;
