
import express from "express";
import http from "http";
import mongoose from "mongoose";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";


dotenv.config();

/*
========================================
EXPRESS APP SETUP
========================================
*/

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is working 🚀");
});


app.get("/api/users", (req, res) => {
  res.json({ message: "Users route working" });
});

/*
========================================
DATABASE CONNECTION
========================================
*/

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    await mongoose.connect(mongoURI);

    console.log("🗄️ MongoDB connected");
  } catch (err) {
    console.log("❌ MongoDB error:", err);
  }
};

/*
========================================
HTTP SERVER
========================================
*/

const httpServer = http.createServer(app);

/*
========================================
SOCKET.IO SETUP
========================================
*/

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("message", (data) => {
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

/*
========================================
START SERVER
========================================
*/

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();