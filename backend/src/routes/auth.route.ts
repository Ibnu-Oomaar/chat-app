import express from "express";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model";
import jwt from "jsonwebtoken";

const router = express.Router();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"; // Replace with env
const client = new OAuth2Client(CLIENT_ID);

router.post("/google", async (req, res) => {
  try {
    const { token } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const { sub: googleId, email, name } = payload;

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      // Create new user
      user = new User({
        username: name,
        email,
        googleId,
        // password not needed for Google auth
      });
      await user.save();
    } else {
      // Update googleId if not set
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    }

    // Generate JWT
    const jwtToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "7d" }
    );

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token: jwtToken,
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
});

export default router;