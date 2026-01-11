const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

const cookieParser = require("cookie-parser");
const cookieConsent = require("./routes/Middlewares/cookieConsent");
const consentRoutes = require("./routes/consentRoutes");

const connectDB = require("./config/database");
const createSessionMiddleware = require("./config/session");
const authRoutes = require("./routes/authRoutes");
const animeRoutes = require("./routes/animeRoutes");

dotenv.config();

const app = express();

connectDB();

app.set("view engine", "ejs");

app.set("views", path.join(path.resolve(), "views"));

app.use(express.static('public'));

app.use(express.json());

// x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser()); 
app.use(cookieConsent);      
app.use(consentRoutes);      

(async () => {
  const sessionMiddleware = await createSessionMiddleware();

  app.use(sessionMiddleware);

  app.use((req, res, next) => {
    res.locals.session = req.session || {};
    next();
  });



  app.use("/", authRoutes);

  app.use(animeRoutes);

  const PORT = process.env.PORT || 8080;

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Serveur lancer`);
  });
})();
