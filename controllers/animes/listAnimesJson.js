const Anime = require("../../models/animeModel");

module.exports = async (req, res) => {
  try {
    const animes = await Anime.find({})
      .sort({ name: 1 })
      .lean();

    res.json({ ok: true, data: animes });
  } catch (e) {
    console.error("listAnimesJson:", e);
    res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
};
