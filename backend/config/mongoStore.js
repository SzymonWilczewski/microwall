const { uri, db } = require("./mongoConfig");
const expressSession = require("express-session");
const MongoStore = require("connect-mongodb-session")(expressSession);

const mongoStore = new MongoStore(
  {
    uri: uri,
    databaseName: db,
    collection: "sessions",
  },
  (error) => {
    if (error) {
      console.error("Can't connect to MongoDB Store\n", error);
    } else {
      console.log("Connected to MongoDB Store");
    }
  }
);

module.exports = mongoStore;
