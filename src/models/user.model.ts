import mongoose from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

const userSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
}); 

export const User = mongoose.model<IUser>("User", userSchema);

export default User;