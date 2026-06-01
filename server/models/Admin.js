import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
  {
    adminId,
    email,

    password,

    provider: {
      type: String,
      enum: [
        "local",
        "google",
        "github"
      ]
    },

    googleId,
    githubId,

    avatar,

    role: {
      type: String,
      default: "admin"
    },

    lastLogin,

    isActive: true
  });

// Hash password before saving
adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("Admin", adminSchema);
