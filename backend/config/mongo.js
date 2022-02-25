const { uri, db } = require("./mongoConfig");
const mongoose = require("mongoose");

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: db,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Can't connect to MongoDB\n", error);
  });

module.exports = mongoose;
