const crypto = require("crypto");
const User = require("../../models/userModel");
const { sendMail } = require("../../services/mailer");
require("dotenv").config();

const LIMIT_BY_WINDOW = 2;                 // 2 demandes max
const WINDOW_MS = 24 * 60 * 60 * 1000;     // 24h

module.exports = async (req, res) => {
  try {
    const email = (req.body.email || '').toLowerCase();
    const user = await User.findOne({ email });

    if (!user) return res.redirect("/login?mail=sent");

    const now = Date.now();

    if (user.lastResetRequest && (now - user.lastResetRequest.getTime()) > WINDOW_MS) {
      user.resetRequestCount = 0;
      user.lastResetRequest = null;
    }

    // Si la limite est atteinte → stop
    if (user.resetRequestCount >= LIMIT_BY_WINDOW) {
      return res.redirect("/login?mail=limit");
    }

    // Générer token 15 min
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExpires = now + (15 * 60 * 1000);

    user.resetRequestCount = (user.resetRequestCount || 0) + 1;
    user.lastResetRequest = new Date(now);

    await user.save();

    const resetLink = `${process.env.BASE_URL}/resetpassword/${token}`;
    const html = `
      <div style="font-family:Segoe UI,Arial,sans-serif;color:#111">
        <h2>Réinitialisation de mot de passe</h2>
        <p>Voici votre lien (valable 15 minutes) :</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.</p>
      </div>
    `;

    await sendMail({
      to: user.email,
      subject: "Réinitialisation de votre mot de passe",
      html,
    });

    return res.redirect("/login?mail=sent");
  } catch (error) {
    console.error("Erreur resetPasswordEmail:", error);
    if (process.env.NODE_ENV !== "production") {
      console.log("Lien de réinitialisation :", `${process.env.BASE_URL}/resetpassword/<token>`);
    }
    return res.redirect("/login?mail=error");
  }
};
