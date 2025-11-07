const POLICY_VERSION = "2025-11-03";

const cookieConsent = (req, res, next) => {
  const raw = req.cookies?.cookie_consent || null;

  if (!raw) {
    res.locals.cookieConsent = null;
    return next();
  }

  const [choice, version] = String(raw).split(":");

  if (!choice || !version || version !== POLICY_VERSION) {
    res.locals.cookieConsent = null;
    return next();
  }

  res.locals.cookieConsent = choice === "accepted" ? "accepted" : "rejected";
  return next();
};

module.exports = cookieConsent;
