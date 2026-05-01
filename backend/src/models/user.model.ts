  import mongoose from "mongoose";

  export interface IUser {
    username: string;
    email: string;
    password?: string; // Optional for Google auth
    googleId?: string;
    role: "user" | "admin";
    profilePic?: string;
  }

  const userSchema = new mongoose.Schema<IUser>({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Not required for Google auth
    googleId: { type: String },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    profilePic: { type: String, default: "" },
  });

  export const User = mongoose.model<IUser>("User", userSchema);

  export default User;

  