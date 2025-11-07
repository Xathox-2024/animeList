module.exports = async (req, res) => {
  try {
    res.render("animeList", {
      title: "AnimeList",
      session: req.session,
    });
  } catch (e) {
    console.error("showHome error:", e);
    res.status(500).send("Erreur serveur");
  }
};
