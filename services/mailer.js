const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid");
require("dotenv").config();

const transporter = nodemailer.createTransport(
  sgTransport({
    apiKey: process.env.SENDGRID_API_KEY,
  })
);

async function sendMail({ to, subject, html }) {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject,
      html,
    });
    console.log("✅ Mail envoyé à :", to);
  } catch (err) {
    console.error("❌ Erreur d’envoi :", err.message);
  }
}

module.exports = { sendMail };
