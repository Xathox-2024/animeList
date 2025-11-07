const Anime = require("../../models/animeModel");

module.exports = async (req, res) => {
  try {
    const { name, date, year, genres, description } = req.body;

    // je nettoie les genres
    const genresArray = (genres || "")
      .split(",")
      .map(g => g.trim())
      .filter(Boolean);

    if (!req.file || !req.file.path || !req.file.filename) {
      return res.status(400).json({ ok: false, message: "Image requise" });
    }

    const anime = await Anime.create({
      name: name?.trim(),
      date: date?.trim() || "",
      year: year ? Number(year) : undefined,
      genres: genresArray,
      description: description?.trim() || "",
      imageUrl: req.file.path,          
      imagePublicId: req.file.filename, 
      createdBy: req.session?.userId || null
    });

    res.status(201).json({ ok: true, data: anime });
  } catch (e) {
    console.error("createAnime:", e);
    if (e.code === 11000) {
      return res.status(409).json({ ok: false, message: "Cet anime existe déjà." });
    }
    res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
};
