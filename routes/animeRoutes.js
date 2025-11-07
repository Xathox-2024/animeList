const express = require("express");
const router = express.Router();

const { getAnimeList, listAnimesJson, createAnime } =
  require("../controllers/animes/animesControllers");

const isAuthenticated = require("./Middlewares/authRoutes/isAuthenticated");
const multerCloudinary = require("./Middlewares/authRoutes/multerCloudinary");
const validateAnime = require("./Middlewares/validateAnime");

router.get("/anime", getAnimeList);
router.get("/api/anime", listAnimesJson);
router.post("/anime",
  isAuthenticated,
  multerCloudinary.single("image"),
  validateAnime,
  createAnime
);

module.exports = router;
