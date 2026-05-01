import type { NextFunction , Request , Response} from "express";
import User from "../models/user.model";
import argon2 from "argon2";
import { generateToken } from "../middlewares/jwt.middleware";

// register user

export const regisetUser = async (req:Request ,res:Response , next:NextFunction)=>{
    try {

        const {username,email,password} = req.body || {};

        if(!username || !email || !password){
            res.status(400).json({message:"Oops! something went is missing"})
            return;
        } 

        // check user exists
        const userExists = await User.findOne({email});

        if(userExists){
            res.status(400).json({message:"User already exists"})
            return;
        }

        // hash password
        const hashpassword = await argon2.hash(password);

        // create user
        const registeredUser = await User.create({
            username,
            email,
            password: hashpassword,
            role: "user",
        });

        // generate token
        const token = generateToken({
            id: registeredUser._id,
            email: registeredUser.email,
            role: registeredUser.role
        });

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                _id: registeredUser._id,
                username: registeredUser.username,
                email: registeredUser.email,
            }
        });

    } catch (error) {
        next(error);
    }
};