import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
{
  username: {
    type: String,
    unique: true,
    sparse: true,
  },

  email: {
    type: String,
    unique: true,
    sparse: true,
  },

  password: String,

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

  isVerified: {
    type: Boolean,
    default: false,
  },

  plan: {
    type: String,
    enum: [
      "free",
      "pro",
      "enterprise",
    ],
    default: "free",
  },
},
{
  timestamps: true,
}
);

userSchema.pre("save", async function(next) {
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

export default mongoose.models.User ||
mongoose.model(
  "User",
  userSchema
);