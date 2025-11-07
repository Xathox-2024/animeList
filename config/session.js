const session = require("express-session");
const connectMongo = require("connect-mongo");
const mongoose = require("mongoose");

async function createSessionMiddleware() {
  await mongoose.connection.asPromise();
  return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 14400000 },
    store: connectMongo.create({
      client: mongoose.connection.getClient(),
      collectionName: "sessions",
      ttl: 14400,
    }),
  });
}

module.exports = createSessionMiddleware;