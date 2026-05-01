import express from "express";
import http from "http";
import mongoose from "mongoose";
import { Server as SocketIOServer } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";

// ROUTES
import registerRoutes from "./routes/register.route";
import loginRoutes from "./routes/login.route";
import authRoutes from "./routes/auth.route";
import friendRoutes from "./routes/friends.route";
import messageRoutes from "./routes/message.route";
import roomRoutes from "./routes/room.route";
import statusRoutes from "./routes/status.route";
import profileRoutes from "./routes/profile.route";

// MIDDLEWARES
import { jwtMiddleware } from "./middlewares/jwt.middleware";

dotenv.config();

/*
========================================
EXPRESS APP SETUP
========================================
*/

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*
========================================
BASIC ROUTE
========================================
*/

app.get("/", (req, res) => {
  res.send("API is working 🚀");
});

/*
========================================
ROUTES
========================================
*/

// AUTH
app.use("/api/users", registerRoutes);
app.use("/api/users", loginRoutes);
app.use("/api/auth", authRoutes);

// FRIENDS
app.use("/api/friends", friendRoutes);

// MESSAGES
app.use("/api/messages", messageRoutes);

// ROOMS
app.use("/api/rooms", roomRoutes);

// STATUS
app.use("/api/status", statusRoutes);

// PROFILE
app.use("/api/profile", profileRoutes);

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

// Map to keep track of connected users (userId -> socketId)
const userSockets = new Map();

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // When a user logs in / connects, they send their userId
  socket.on("register_user", (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`👤 User registered: ${userId} with socket: ${socket.id}`);
    
    // Broadcast to others that this user is online
    socket.broadcast.emit("user_status", { userId, isOnline: true });
  });

  socket.on("message", (data) => {
    // If it's a room message, we emit to everyone. (Could be optimized with socket.join(room))
    io.emit("message", data);
  });

  // Friend Request Real-time Event
  socket.on("send_friend_request", (data) => {
    const { receiverId, requester } = data;
    const receiverSocketId = userSockets.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_friend_request", requester);
    }
  });

  // Call Signaling Events (WebRTC)
  socket.on("call_user", (data) => {
    const { userToCall, signalData, from, name } = data;
    const receiverSocketId = userSockets.get(userToCall);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incoming_call", { signal: signalData, from, name });
    }
  });

  socket.on("answer_call", (data) => {
    const { to, signal } = data;
    const callerSocketId = userSockets.get(to);
    if (callerSocketId) {
      io.to(callerSocketId).emit("call_accepted", signal);
    }
  });

  socket.on("end_call", (data) => {
    const { to } = data;
    const receiverSocketId = userSockets.get(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("call_ended");
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
    
    // Find and remove the disconnected user
    let disconnectedUserId = null;
    for (const [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        userSockets.delete(userId);
        break;
      }
    }

    if (disconnectedUserId) {
      // Broadcast that this user is offline
      io.emit("user_status", { userId: disconnectedUserId, isOnline: false });
    }
  });
});

/*
========================================
START SERVER
========================================
*/

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 6030;

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();