const router = require("express").Router();
const access = require("./access");
const user = require("./user");
const post = require("./post");
const comment = require("./comment");

router.use("/", access);
router.use("/user", user);
router.use("/post", post);
router.use("/comment", comment);

module.exports = router;
