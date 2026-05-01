import type { Request, Response, NextFunction } from "express";
import Status from "../models/status.model";

// set user online/offline
export const updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { userId, isOnline } = req.body || {};

        if (!userId) {
            return res.status(400).json({ message: "Missing userId" });
        }

        const status = await Status.findOneAndUpdate(
            { userId },
            {
                isOnline,
                lastSeen: new Date()
            },
            { upsert: true, new: true }
        );

        res.status(200).json(status);

    } catch (error) {
        next(error);
    }
};

// get online users
export const getOnlineUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const users = await Status.find({ isOnline: true }).populate("userId");

        res.status(200).json(users);

    } catch (error) {
        next(error);
    }
};