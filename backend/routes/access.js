const router = require("express").Router();
const passport = require("passport");
const User = require("../models/User");
const Post = require("../models/Post");

router.post("/register", async (req, res) => {
  const { first_name, last_name, username, password } = req.body;

  User.register(
    new User({
      username: username,
      first_name: first_name,
      last_name: last_name,
      friends: [],
    }),
    password
  )
    .then(() => {
      return res.status(201).json({
        message: "apiRegisterSuccess",
      });
    })
    .catch((error) => {
      const message = `api${error.name}`;
      switch (error.name) {
        case "UserExistsError":
          return res.status(409).json({ message });
        case "MissingUsernameError":
        case "MissingPasswordError":
          return res.status(422).json({ message });
        default:
          return res.status(400).json({ message: "apiUnknownError" });
      }
    });
});

router.post("/login", async (req, res) => {
  passport.authenticate("local", (_, user, info) => {
    if (user) {
      req.login(user, () => {
        return res.status(201).json({
          message: "apiLoginSuccess",
        });
      });
    } else if (info.message === "Missing credentials") {
      return res.status(422).json({ message: "apiMissingCredentialsError" });
    } else {
      switch (info.name) {
        case "IncorrectUsernameError":
        case "IncorrectPasswordError":
          return res
            .status(403)
            .json({ message: "apiIncorrectCredentialsError" });

        default:
          return res.status(400).json({ message: "apiUnknownError" });
      }
    }
  })(req, res);
});

router.get("/me", async (req, res) => {
  if (req.user) {
    User.findById(req.user._id.toString())
      .populate("friends.user", "_id first_name last_name username")
      .then((user) =>
        user
          ? res.status(200).json({
              user: user,
              message: "apiUserFound",
            })
          : res.status(404).json({
              message: "apiUserDoesNotExistError",
            })
      )
      .catch((error) => res.status(500).json({ message: `api${error}` }));
  } else {
    res.json({
      message: "apiUserDoesNotExistError",
    });
  }
});

router.get("/user", async (req, res) => {
  User.find({})
    .populate("friends.user", "_id first_name last_name username")
    .then((users) =>
      res.status(200).json({ users: users, message: "apiUsersFound" })
    )
    .catch((error) => res.status(500).json({ message: `api${error}` }));
});

router.get("/user/:id", async (req, res) => {
  User.findById(req.params.id)
    .populate("friends.user", "_id first_name last_name username")
    .then((user) =>
      user
        ? res.status(200).json({
            user: user,
            message: "apiUserFound",
          })
        : res.status(404).json({
            message: "apiUserDoesNotExistError",
          })
    )
    .catch((error) => res.status(500).json({ message: `api${error}` }));
});

// router.get("/post/public/:id", async (req, res) => {
//   Post.find({
//     author: req.params.id,
//     $or: [{ type: "PUBLIC" }, { type: "GENERAL" }],
//   })
//     .sort({ date: -1 })
//     .populate("author", "_id first_name last_name username")
//     .then((posts) =>
//       res.status(200).json({ posts: posts, message: "apiPostsFound" })
//     )
//     .catch((error) => res.status(500).json({ message: `api${error}` }));
// });

router.use(async (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else if (req.path === "/post/public" && req.method === "GET") {
    return next();
  } else {
    return res.status(401).json({ message: "apiUnauthorizedError" });
  }
});

router.post("/logout", async (req, res) => {
  req.logout();
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    return res.status(201).json({ message: "apiLogoutSuccess" });
  });
});

module.exports = router;
