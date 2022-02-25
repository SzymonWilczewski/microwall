module.exports = {
  uri: `mongodb://${process.env.MONGO_USERNAME || "mongo"}:${
    process.env.MONGO_PASSWORD || "mongo"
  }@${process.env.MONGO_HOST || "localhost"}:${
    process.env.MONGO_PORT || 27017
  }`,
  db: process.env.MONGO_DATABASE || "mongo",
};
