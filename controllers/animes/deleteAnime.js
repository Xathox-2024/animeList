const Anime = require("../../models/animeModel");
const cloudinary = require("../../config/cloudinary"); // tu l'as déjà dans /config

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await Anime.findById(id);
    if (!doc) return res.status(404).json({ ok: false, message: "Introuvable" });

    // (optionnel) sécurité : seul le créateur ou un admin
    if (req.session?.userId && req.session.role !== "admin") {
      if (String(doc.createdBy || "") !== String(req.session.userId)) {
        return res.status(403).json({ ok: false, message: "Non autorisé" });
      }
    }

    // supprime l'image Cloudinary si dispo
    try { 
      if (doc.imagePublicId && cloudinary?.uploader) {
        await cloudinary.uploader.destroy(doc.imagePublicId);
      }
    } catch (_) {}

    await doc.deleteOne();

    return res.json({ ok: true, id });
  } catch (e) {
    console.error("deleteAnime error:", e);
    return res.status(500).json({ ok: false, message: "Erreur serveur" });
  }
};
