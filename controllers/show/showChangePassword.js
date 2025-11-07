module.exports = async (req, res) => {
  try {
    return res.render("changePassword", {
      error: req.query.error || "",
      message: req.query.message || "",
    });
  } catch (e) {
    console.error("showChangePassword error:", e);
    return res.redirect("/?error=Erreur serveur");
  }
};
