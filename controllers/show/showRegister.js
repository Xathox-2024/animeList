module.exports = (req, res) => {
    if (req.session.userId) return res.redirect("/");
    res.render("register", { session: req.session });
};
