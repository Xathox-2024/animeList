module.exports = (req, res) => {
    if (req.session.userId) return res.redirect("/");
    res.render("login", { session: req.session });
};