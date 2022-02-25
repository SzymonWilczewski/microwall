require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const history = require("connect-history-api-fallback");
const https = require("https");
const fs = require("fs");
const passport = require("passport");
const passportLocal = require("passport-local");

const app = express();

const server = https.createServer(
  {
    key: fs.readFileSync("./ssl/my.key"),
    cert: fs.readFileSync("./ssl/my.crt"),
  },
  app
);

global.io = require("socket.io")(server, {
  cors: {
    origin: "https://localhost:3000",
    credentials: true,
  },
});
global.connectedUsers = {};
const workspaces = io.of(/^\/post\/[a-f\d]{24}$/);
const friendsWorkspaces = io.of("/friends");
const friendsNotificationsWorkspaces = io.of("/friends/notifications");
const postNotificationsWorkspaces = io.of("/post/notifications");
const userWorkspaces = io.of(/^\/user\/[a-f\d]{24}$/);
const postsWorkspaces = io.of("/posts");

app.use(cors({ origin: "https://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());
const mongoStore = require("./config/mongoStore");
const sessionMiddleware = expressSession({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true },
  store: mongoStore,
});
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());
const User = require("./models/User");
passport.use(new passportLocal.Strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const router = require("./routes/router");
app.use("/api", router);

app.use(history());
app.use(express.static("public"));

const wrap = (middleware) => (socket, next) =>
  middleware(socket.request, {}, next);

workspaces.use(wrap(sessionMiddleware));
workspaces.use(wrap(passport.initialize()));
workspaces.use(wrap(passport.session()));

workspaces.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error("apiUnauthorizedError"));
  }
});

workspaces.on("connection", (socket) => {
  const workspace = socket.nsp;

  global.workspace = workspace;

  const session = socket.request.session;
  session.socketId = socket.id;
  session.save();

  socket.on("error", (err) => {
    console.dir(err);
  });
});

friendsWorkspaces.use(wrap(sessionMiddleware));
friendsWorkspaces.use(wrap(passport.initialize()));
friendsWorkspaces.use(wrap(passport.session()));

friendsWorkspaces.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error("apiUnauthorizedError"));
  }
});

friendsWorkspaces.on("connection", (socket) => {
  const friendsWorkspace = socket.nsp;

  global.friendsWorkspace = friendsWorkspace;

  const session = socket.request.session;
  session.socketId = socket.id;
  session.save();

  socket.on("error", (err) => {
    console.dir(err);
  });
});

friendsNotificationsWorkspaces.use(wrap(sessionMiddleware));
friendsNotificationsWorkspaces.use(wrap(passport.initialize()));
friendsNotificationsWorkspaces.use(wrap(passport.session()));

friendsNotificationsWorkspaces.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error("apiUnauthorizedError"));
  }
});

friendsNotificationsWorkspaces.on("connection", (socket) => {
  const friendsNotificationWorkspace = socket.nsp;

  global.friendsNotificationWorkspace = friendsNotificationWorkspace;

  const session = socket.request.session;
  session.socketId = socket.id;
  session.save();

  socket.on("error", (err) => {
    console.dir(err);
  });
});

postNotificationsWorkspaces.use(wrap(sessionMiddleware));
postNotificationsWorkspaces.use(wrap(passport.initialize()));
postNotificationsWorkspaces.use(wrap(passport.session()));

postNotificationsWorkspaces.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error("apiUnauthorizedError"));
  }
});

postNotificationsWorkspaces.on("connection", (socket) => {
  const postNotificationsWorkspace = socket.nsp;

  global.postNotificationsWorkspace = postNotificationsWorkspace;

  const session = socket.request.session;
  session.socketId = socket.id;
  session.save();

  socket.on("error", (err) => {
    console.dir(err);
  });
});

userWorkspaces.use(wrap(sessionMiddleware));
userWorkspaces.use(wrap(passport.initialize()));
userWorkspaces.use(wrap(passport.session()));

userWorkspaces.use((socket, next) => {
  if (socket.request.user) {
    socket.user = socket.request.user;
    socket.friends = socket.request.user.friends.filter(
      (friend) => friend.status === 3
    );
    // console.log("SocketId:", socket.id);
    // console.log("User:", socket.user);
    // console.log("Friends:", socket.friends);
    next();
  } else {
    next(new Error("apiUnauthorizedError"));
  }
});

userWorkspaces.on("connection", (socket) => {
  const userWorkspace = socket.nsp;
  global.userWorkspace = userWorkspace;

  connectedUsers = {
    [socket.user._id.toString()]: socket,
    ...connectedUsers,
  };

  const session = socket.request.session;
  session.socketId = socket.id;
  session.save();

  socket.on("disconnect", () => {
    delete session.socketId;
    session.save();

    delete connectedUsers[socket.user._id.toString()];
  });
  socket.on("error", (err) => {
    console.dir(err);
  });
});

postsWorkspaces.use(wrap(sessionMiddleware));
postsWorkspaces.use(wrap(passport.initialize()));
postsWorkspaces.use(wrap(passport.session()));

postsWorkspaces.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error("apiUnauthorizedError"));
  }
});

postsWorkspaces.on("connection", (socket) => {
  const postsWorkspace = socket.nsp;

  global.postsWorkspace = postsWorkspace;

  const session = socket.request.session;
  session.socketId = socket.id;
  session.save();

  socket.on("error", (err) => {
    console.dir(err);
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
