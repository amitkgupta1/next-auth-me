import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    verifyToken: String,
    verifyTokenExpiry: Date,
    forgotPassword: String,
    forgotPasswordExpiry: Date,

  }, {timestamps: true}
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
