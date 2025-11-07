const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    avatar: { type: String, required: true },           
    avatarPublicId: { type: String, required: true },
    resetToken: { type: String, default: null },
    resetTokenExpires: { type: Date, default: null },
    resetRequestCount: { type: Number, default: 0 },
    lastResetRequest: { type: Date, default: null },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
