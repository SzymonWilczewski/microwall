const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question(
  "\nAre you sure you want to delete all data?\nThis operation is irreversible!\nDo you want to continue? [Y/n]: ",
  (answer) => {
    console.log();
    if (answer.toLowerCase() === "y" || answer.toLowerCase() === "yes") {
      const User = require("./models/User");
      const Post = require("./models/Post");
      const Comment = require("./models/Comment");

      User.deleteMany({})
        .then(() => Post.deleteMany({}))
        .then(() => Comment.deleteMany({}))
        .then(() => console.log("All records deleted successfully"))
        .then(() => process.exit())
        .catch((error) => console.error(error));
    } else {
      rl.close();
    }
  }
);
