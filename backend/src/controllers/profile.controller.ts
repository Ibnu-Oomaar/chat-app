import type { Request, Response } from "express";
import User from "../models/user.model";
import { uploadToCloudinary } from "../helpers/cloudinary.helper";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { username, email } = req.body;
    let profilePicUrl = "";

    if (req.file) {
      const result: any = await uploadToCloudinary(req.file);
      profilePicUrl = result.secure_url;
    }

    const updateData: any = { username, email };
    if (profilePicUrl) updateData.profilePic = profilePicUrl;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
    
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    
    res.json(updatedUser);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
