const mongoose = require("mongoose");

const animeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    date: { type: String, trim: true },         
    year: { type: Number },                    
    genres: [{ type: String, trim: true }],     
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String, required: true },
    description: { type: String, trim: true, maxlength: 2000 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

animeSchema.index({ name: 1 }); // je trie/cherche vite

module.exports = mongoose.model("Anime", animeSchema);
