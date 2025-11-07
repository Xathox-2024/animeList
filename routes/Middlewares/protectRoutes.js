const protectRoutes = (req, res, next) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.set("Pragma", "no-cache");
    res.set("Expires", "-1");
  
    if (
      !req.session.userId &&
      !["/", "/login", "/register"].includes(req.path) &&
      !req.path.startsWith("/resetpassword")
    ) {
      return res.redirect("/login");
    }
  
    next();
  };
  
  module.exports = protectRoutes;
  