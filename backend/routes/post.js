const router = require("express").Router();
const Post = require("../models/Post");
// const User = require("../models/User");

router.get("/public", async (req, res) => {
  Post.find({
    $or: [{ type: "PUBLIC" }, { type: "GENERAL" }],
  })
    .sort({ date: -1 })
    .populate("author", "_id first_name last_name username")
    .then((posts) =>
      res.status(200).json({ posts: posts, message: "apiPostsFound" })
    )
    .catch((error) => res.status(500).json({ message: `api${error}` }));
});

// In access.js

router.get("/public/:id", async (req, res) => {
  Post.find({
    author: req.params.id,
    $or: [{ type: "PUBLIC" }, { type: "GENERAL" }],
  })
    .sort({ date: -1 })
    .populate("author", "_id first_name last_name username")
    .then((posts) =>
      res.status(200).json({ posts: posts, message: "apiPostsFound" })
    )
    .catch((error) => res.status(500).json({ message: `api${error}` }));
});

router.get("/private/:id", async (req, res) => {
  if (
    req.user.friends.some(
      (friend) =>
        friend.user._id.toString() === req.params.id && friend.status === 3
    ) ||
    req.params.id === req.user._id.toString()
  ) {
    Post.find({
      author: req.params.id,
      $or: [{ type: "PRIVATE" }, { type: "GENERAL" }],
    })
      .sort({ date: -1 })
      .populate("author", "_id first_name last_name username")
      .then((posts) => {
        Post.updateMany(
          {
            author: req.params.id,
            $or: [{ type: "PRIVATE" }, { type: "GENERAL" }],
          },
          { $addToSet: { visited: req.user._id } }
        ).catch((error) => console.error(error));
        // postNotificationsWorkspace.emit("refresh");
        res.status(200).json({ posts: posts, message: "apiPostsFound" });
      })
      .catch((error) => res.status(500).json({ message: `api${error}` }));
  } else {
    return res.status(403).json({ message: "apiAccessDeniedError" });
  }
});

router.get("/notifications", async (req, res) => {
  try {
    // const me = await User.findById(req.user._id.toString());

    const unreadPosts = await Promise.all(
      req.user.friends
        .filter((friend) => friend.status === 3)
        .map((friend) =>
          Post.find({
            author: friend.user,
            type: "PRIVATE",
            visited: { $ne: req.user._id },
          })
        )
    );

    res.status(200).json({
      notifications: unreadPosts.flat().length,
      message: "apiPostsFound",
    });
  } catch (error) {
    res.status(500).json({ message: `api${error}` });
  }
});

router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!req.user) {
    Post.find({
      _id: req.params.id,
      $or: [{ type: "PUBLIC" }, { type: "GENERAL" }],
    })
      .populate("author", "_id first_name last_name username")
      .then((post) => {
        if (post.length > 0) {
          res.status(200).json({ post: post[0], message: "apiPostFound" });
        } else {
          res.status(404).json({ message: "apiPostDoesNotExistError" });
        }
      })
      .catch((error) => res.status(500).json({ message: `api${error}` }));
  } else if (
    req.user.friends.some(
      (friend) =>
        friend.user._id.toString() === post.author.toString() &&
        friend.status === 3
    ) ||
    req.params.id === req.user._id.toString()
  ) {
    Post.find({
      _id: req.params.id,
      // $or: [{ type: "PUBLIC" }, { type: "GENERAL" }],
    })
      .populate("author", "_id first_name last_name username")
      .then((post) => {
        if (post.length > 0) {
          res.status(200).json({ post: post[0], message: "apiPostFound" });
        } else {
          res.status(404).json({ message: "apiPostDoesNotExistError" });
        }
      })
      .catch((error) => res.status(500).json({ message: `api${error}` }));
  } else {
    Post.find({
      _id: req.params.id,
      $or: [{ type: "PUBLIC" }, { type: "GENERAL" }],
    })
      .populate("author", "_id first_name last_name username")
      .then((post) => {
        if (post.length > 0) {
          res.status(200).json({ post: post[0], message: "apiPostFound" });
        } else {
          res.status(404).json({ message: "apiPostDoesNotExistError" });
        }
      })
      .catch((error) => res.status(500).json({ message: `api${error}` }));
  }
});

router.post("/", async (req, res) => {
  new Post({
    author: req.user._id,
    type: req.body.type,
    text: req.body.text,
    visited: [req.user._id],
  })
    .save()
    .then(() => {
      // postNotificationsWorkspace.emit("refresh");

      if (req.body.type === "PRIVATE") {
        req.user.friends.map((friend) => {
          if (friend.status === 3 && friend.user.toString() in connectedUsers) {
            io.of("/user/" + friend.user.toString()).emit("PRIVATE", {
              type: req.body.type,
              author_id: req.user._id,
            });
          }
        });
      } else {
        Object.values(connectedUsers).forEach((socket) => {
          io.of(socket.nsp.name).emit("PUBLIC", {
            type: req.body.type,
            author_id: req.user._id,
          });
        });
      }

      res.status(201).json({ message: "apiPostCreated" });
    })
    .catch((error) => res.status(500).json({ message: `api${error}` }));
});

module.exports = router;
