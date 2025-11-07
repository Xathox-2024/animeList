const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_PROD);
  } catch (err) {
    console.error("Erreur de connexion MongoDB:", err);
    process.exit(1);
  }
};

module.exports = connectDB;
