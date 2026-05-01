import type { Request, Response, NextFunction } from "express";
import Message from "../models/message.model";

// send message (REST fallback ama history save)
export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { text, roomId } = req.body || {};

        if (!text) {
            return res.status(400).json({ message: "Missing text" });
        }

        const messageData: any = {
            sender: (req as any).user.id,
            text
        };
        
        if (roomId) {
            messageData.room = roomId;
        }

        const message = await Message.create(messageData);
        await message.populate("sender", "username email");

        res.status(201).json({
            message: "Message sent",
            data: message
        });

    } catch (error) {
        next(error);
    }
};

// get all messages
export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { room } = req.query;
        let query: any = {};
        
        if (room) {
            query.room = room;
        } else {
            query.room = { $exists: false }; // Global messages
        }

        const messages = await Message.find(query).populate("sender", "username email");

        res.status(200).json(messages);

    } catch (error) {
        next(error);
    }
};