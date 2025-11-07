module.exports = (req, res, next) => {
  const { name, year } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ ok: false, message: "Nom obligatoire" });
  }
  if (year && !/^\d{4}$/.test(String(year))) {
    return res.status(400).json({ ok: false, message: "Année invalide (YYYY)" });
  }
  next();
};
