import type { NextFunction , Request , Response} from "express";
import User from "../models/user.model";
import argon2 from "argon2";
import { generateToken } from "../middlewares/jwt.middleware";

// register user

export const regisetUser = async (req:Request ,res:Response , next:NextFunction)=>{
    try {
        const {name,email,password,role} = req.body;

        if(!name || !email || !password || !role){
            res.status(401).json({message:"Oops! something went is missing"})
            return;
        } 

        //exists user
        const userExists = await User.findOne({email});
        if(userExists){
            res.status(400).json({message:"User already exists"})
            return;
        }

        // hash password user
        const hashpassword = await argon2.hash(password);

        //create user
        const registeredUser= await User.create({
            name,
            email,
            password:hashpassword,
            role:role || "user",
        }) 

        // generate access token (FIXED)
        const token = generateToken({
            id: registeredUser._id,
            email: registeredUser.email,
            role: registeredUser.role
        });

        if(!registeredUser){
            res.status(400).json({message:"Invalid register user"})
        } else{
            res.status(201).json({
                message:"successfully register user",
                token
            })
        }

    } catch (error) {
        next(error)
    }
}