const session = require("express-session");
const connectMongo = require("connect-mongo");
const mongoose = require("mongoose");

async function createSessionMiddleware() {
  await mongoose.connection.asPromise();
  return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7200 },
    store: connectMongo.create({
      client: mongoose.connection.getClient(),
      collectionName: "sessions",
      ttl: 259200,
    }),
  });
}

module.exports = createSessionMiddleware;