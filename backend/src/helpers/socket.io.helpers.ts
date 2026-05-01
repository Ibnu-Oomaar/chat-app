import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../models/message.model";

export const socketHandler = (io: Server) => {

    io.use((socket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token) return next(new Error("No token"));

        try {
            const user = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET as string
            );

            (socket as any).user = user;
            next();
        } catch (err) {
            next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket) => {

        console.log("User connected:", (socket as any).user);

        // 🔥 ADDED: save message to DB
        socket.on("message", async (msg) => {

            const saved = await Message.create({
                sender: (socket as any).user.id,
                text: msg
            });

            io.emit("message", {
                user: (socket as any).user,
                text: saved.text,
                _id: saved._id,
                createdAt: saved.createdAt
            });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
};