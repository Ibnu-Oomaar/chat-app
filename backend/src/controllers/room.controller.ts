import type { Request, Response, NextFunction } from "express";
import Room from "../models/room.model";

// create room
export const createRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { name, createdBy } = req.body || {};

        if (!name || !createdBy) {
            return res.status(400).json({ message: "Missing fields" });
        }

        const room = await Room.create({
            name,
            createdBy
        });

        res.status(201).json(room);

    } catch (error) {
        next(error);
    }
};

// get all rooms
export const getRooms = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const rooms = await Room.find().populate("members");

        res.status(200).json(rooms);

    } catch (error) {
        next(error);
    }
};