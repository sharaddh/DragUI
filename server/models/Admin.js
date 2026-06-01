import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const adminSchema = new mongoose.Schema(
{
  adminId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },

  password: {
    type: String,
  },

  provider: {
    type: String,
    enum: [
      "local",
      "google",
      "github",
    ],
    default: "local",
  },

  googleId: String,

  githubId: String,

  avatar: String,

  role: {
    type: String,
    enum: [
      "super_admin",
      "admin",
      "editor",
    ],
    default: "admin",
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  lastLogin: Date,
},
{
  timestamps: true,
}
);

adminSchema.pre("save", async function(next) {
  if (!this.isModified("password"))
    return next();

  const salt =
    await bcrypt.genSalt(10);

  this.password =
    await bcrypt.hash(
      this.password,
      salt
    );

  next();
});

adminSchema.methods.comparePassword =
async function(password) {
  return bcrypt.compare(
    password,
    this.password
  );
};

export default mongoose.model(
  "Admin",
  adminSchema
);