const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../../../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    if (!file.mimetype.startsWith("image/")) {
      throw new Error("Seules les images sont autorisées pour l’avatar.");
    }
    return {
      folder: "AnimeList",
      format: "png",
      public_id: Date.now() + "-" + Math.round(Math.random() * 1e9),
    };
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Seules les images sont autorisées pour l’avatar"), false);
  }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
