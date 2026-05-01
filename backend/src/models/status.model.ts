import mongoose from "mongoose";

const statusSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now }
});

export default mongoose.model("Status", statusSchema);