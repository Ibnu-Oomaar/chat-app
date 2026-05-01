import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Message", messageSchema);