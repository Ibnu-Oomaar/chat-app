import type { Request, Response, NextFunction } from "express";
import Friend from "../models/friends.model";

// send friend request
export const sendRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { requester, receiver } = req.body || {};

        if (!requester || !receiver) {
            return res.status(400).json({ message: "Missing users" });
        }

        if (requester === receiver) {
            return res.status(400).json({ message: "You cannot add yourself" });
        }

        const exists = await Friend.findOne({
            $or: [
                { requester, receiver },
                { requester: receiver, receiver: requester }
            ]
        });

        if (exists) {
            return res.status(400).json({ message: "Request already exists or you are already friends" });
        }

        const request = await Friend.create({
            requester,
            receiver,
            status: "pending"
        });

        res.status(201).json(request);
    } catch (error) {
        next(error);
    }
};

// accept request
export const acceptRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const updated = await Friend.findByIdAndUpdate(
            id,
            { status: "accepted" },
            { new: true }
        );
        res.status(200).json(updated);
    } catch (error) {
        next(error);
    }
};

// reject/remove request
export const rejectRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await Friend.findByIdAndDelete(id);
        res.status(200).json({ message: "Request removed" });
    } catch (error) {
        next(error);
    }
};

// get friends
export const getFriends = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const friends = await Friend.find({
            $or: [
                { requester: userId, status: "accepted" },
                { receiver: userId, status: "accepted" }
            ]
        }).populate("requester receiver", "-password");

        res.status(200).json(friends);
    } catch (error) {
        next(error);
    }
};

// get pending requests for a user
export const getPendingRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;
        const pending = await Friend.find({
            receiver: userId,
            status: "pending"
        }).populate("requester", "username email profilePic");

        res.status(200).json(pending);
    } catch (error) {
        next(error);
    }
};