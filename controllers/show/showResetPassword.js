module.exports = (req, res) => {
    if (req.session.userId) return res.redirect("/");
    res.render("resetPassword", { session: req.session, token: null });
};