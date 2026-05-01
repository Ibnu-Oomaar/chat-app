import type { NextFunction , Request , Response} from "express";
import User from "../models/user.model";
import argon2 from "argon2";
import { deleteAccessToken, generateToken } from "../middlewares/jwt.middleware";


// login user

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Opps! something went is missing" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    if (!user.password) {
      res.status(401).json({ message: "This account was created with Google. Please use 'Sign in with Google'." });
      return;
    }

    const isPasswordValid = await argon2.verify(user.password, password);

    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = generateToken({ id: user._id, email: user.email, role: 'user' });

    res.status(200).json({ message: "Login successful", token, user: { _id: user._id, username: user.username, email: user.email } });
  } catch (error) {
    next(error);
  }
};

export default loginUser;




// getAllUsers

export const getAllUsers = async (req:Request , res:Response , next : NextFunction)=>{
    try {
        const { q } = req.query;
        let query = {};
        if (q && typeof q === 'string') {
            query = {
                $or: [
                    { username: { $regex: q, $options: 'i' } },
                    { email: { $regex: q, $options: 'i' } }
                ]
            };
        }
        const users = await User.find(query).select('-password');
        res.status(200).json(users);
    } catch (error) {
        next(error)
    }
}

// Get one 

export const getOneUser = async (req:Request , res:Response , next : NextFunction)=>{
  try {
    const {id}= req.params;
    const user = await User.findById(id);
    if(!user){
      res.status(404).json({message:"User not found"});
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    next(error)
  }
}

// update user

export const updateUser = async (req:Request , res:Response , next : NextFunction)=>{
  try {
    const {id}= req.params;
    const {username , email} = req.body;
    const user = await User.findById(id);
    if(!user){
      res.status(404).json({message:"User not found"});
      return;
    }
    user.username = username;
    user.email = email;
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    next(error)
  }
}

// delete user 

export const deleteUser = async (req:Request , res:Response , next : NextFunction)=>{
  try {
    const {id} = req.params;
    const user = await User.findById(id);
    if(!user){
      res.status(404).json({message:"User not found"});
      return;
    }
    await user.deleteOne();
    res.status(200).json({message:"User deleted successfully"});  
  } catch (error) {
    next(error)
  }
}



// logout

export const logOutUser = async (req:Request , res:Response , next:NextFunction)=>{
  try {
    deleteAccessToken();
    res.status(200).json({message:"User logged out successfully"});
  } catch (error) {
    next(error)
  
  }
}