const express = require("express");
const router = express.Router();

const getAnimeList = require("../controllers/animes/getAnimeList");
const listAnimesJson = require("../controllers/animes/listAnimesJson");
const createAnime = require("../controllers/animes/createAnime");
const deleteAnime = require("../controllers/animes/deleteAnime");

const isAuthenticated = require("./Middlewares/authRoutes/isAuthenticated");
const multerCloudinary = require("./Middlewares/authRoutes/multerCloudinary");
const validateAnime = require("./Middlewares/validateAnime");

router.get("/anime", getAnimeList);
router.get("/api/anime", listAnimesJson);

// création (protège si tu veux)
router.post(
  "/anime",
  multerCloudinary.single("image"),
  validateAnime,
  createAnime
);

// 🔥 suppression
router.delete("/anime/:id",
  isAuthenticated,
  deleteAnime
);

module.exports = router;
