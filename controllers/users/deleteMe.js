const User = require("../../models/userModel");
const cloudinary = require("../../config/cloudinary");

module.exports = async (req, res) => {
  try {
    if (!req.session || !req.session.userId) return res.redirect("/");

    const me = await User.findById(req.session.userId)
      .select("avatarPublicId avatar");
    if (!me) return res.redirect("/?error=Compte introuvable");

    // Supprime l’avatar Cloudinary si on a le public_id
    try {
      if (me.avatarPublicId) {
        await cloudinary.uploader.destroy(me.avatarPublicId);
      }
    } catch (e) {
      console.error("Cloudinary destroy (self) error:", e);
    }

    await User.findByIdAndDelete(req.session.userId);

    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      return res.redirect("/?message=Compte supprimé");
    });
  } catch (e) {
    console.error("deleteMe error:", e);
    return res.redirect("/?error=Erreur serveur");
  }
};
