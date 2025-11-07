const Anime = require("../../models/animeModel");

module.exports = async (req, res) => {
  try {
    const { name, year, genres, description } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ ok: false, message: "Nom obligatoire" });
    }

    const file = req.file || {};
    const imageUrl = file.path || file.secure_url;
    const imagePublicId = file.filename || file.public_id;

    if (!imageUrl || !imagePublicId) {
      return res.status(400).json({ ok: false, message: "Image requise" });
    }

    const genresArray = (genres || "")
      .split(",")
      .map(g => g.trim())
      .filter(Boolean);

    const doc = await Anime.create({
      name: name.trim(),
      year: year ? Number(year) : undefined,
      genres: genresArray,
      description: (description || "").trim(),
      imageUrl,
      imagePublicId,
      createdBy: req.session?.userId || null
    });

    return res.status(201).json({ ok: true, data: doc });
  } catch (e) {
    console.error("createAnime error:", e);

    if (e && e.code === 11000) {
      return res.status(409).json({ ok: false, message: "Cet anime existe déjà." });
    }
    return res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
};
