const express = require("express");
const router = express.Router();

// Change cette date à chaque fois que la politique cookies/CGU change
const POLICY_VERSION = "2025-11-03";

router.post("/consent", (req, res) => {
  const choice = (req.body?.choice || "").toLowerCase();
  if (!["accepted", "rejected"].includes(choice)) {
    return res.status(400).json({ ok: false, error: "invalid_choice" });
  }

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("cookie_consent", `${choice}:${POLICY_VERSION}`, {
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 jours
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
  });

  return res.json({ ok: true, choice, version: POLICY_VERSION });
});

router.post("/consent/reset", (req, res) => {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("cookie_consent", {
    httpOnly: true,
    sameSite: "lax",
    secure: isProd,
    path: "/",
  });
  return res.json({ ok: true });
});

module.exports = router;
