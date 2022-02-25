const router = require("express").Router();
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const User = require("../models/User");
const mongoose = require("../config/mongo");

router.get("/public/:id", async (req, res) => {
  Comment.find({
    post: req.params.id,
    type: "PUBLIC",
  })
    .sort({ date: -1 })
    .populate("author", "_id first_name last_name username")
    .populate("post", "_id author type text")
    .then((comments) =>
      res.status(200).json({ comments: comments, message: "apiCommentsFound" })
    )
    .catch((error) => res.status(500).json({ message: `api${error}` }));
});

router.get("/private/:id", async (req, res) => {
  const me = await User.findById(req.user._id.toString());

  if (me) {
    Comment.find({
      post: req.params.id,
      type: "PRIVATE",
    })
      .sort({ date: -1 })
      .populate("author", "_id first_name last_name username")
      .populate("post", "_id author type text")
      .then((comments) => {
        if (comments.length > 0) {
          if (
            me.friends.findIndex(
              (f) => f.user.equals(comments[0].post.author) && f.status === 3
            ) + 1 ||
            me._id.toString() === comments[0].post.author.toString()
          ) {
            res
              .status(200)
              .json({ comments: comments, message: "apiCommentsFound" });
          } else {
            return res.status(500).json({
              message: "apiServerError",
            });
          }
        } else {
          res.status(200).json({ comments: [], message: "apiCommentsFound" });
        }
      })
      .catch((error) => res.status(500).json({ message: `api${error}` }));
  }
});

router.post("/", async (req, res) => {
  const post = await Post.findById(req.body._id);

  if (post?.type === req.body.type || post?.type === "GENERAL") {
    new Comment({
      author: req.user._id,
      post: req.body._id,
      type: req.body.type,
      text: req.body.text,
    })
      .save()
      .then(() => {
        if (global.workspace) {
          if (req.body.type === "PRIVATE") {
            workspace.emit("commentsPrivate", {
              type: req.body.type,
              id: req.body._id,
            });
          } else {
            workspace.emit("commentsPublic", {
              type: req.body.type,
              id: req.body._id,
            });
          }
        }
        res.status(201).json({ message: "apiCommentCreated" });
      })
      .catch((error) => res.status(500).json({ message: `api${error}` }));
  } else if (!post) {
    return res.status(404).json({ message: "apiPostNotFoundError" });
  } else {
    return res.status(422).json({ message: "apiWrongCommentTypeError" });
  }
});

module.exports = router;
