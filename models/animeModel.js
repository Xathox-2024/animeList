const mongoose = require("mongoose");

const animeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    year: { type: Number },                     // année seule
    genres: [{ type: String, trim: true }],
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String, required: true },
    description: { type: String, trim: true, maxlength: 2000 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Anime", animeSchema);
