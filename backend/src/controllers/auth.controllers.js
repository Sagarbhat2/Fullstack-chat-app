import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"

export const signup=async(req,res)=>{
    console.log(req.body)
    const {fullName,email,password}=req.body;
   try {
    if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }
    if(password.length<6){
        return res.status(400).json({message:"Password must be at least 6 character"});
    }
    const user= await User.findOne({email});
    if(user) return res.status(400).json({message:"User Already exist"});

    //hash password
    const salt=await bcrypt.genSalt(10);
    const HashedPassword=await bcrypt.hash(password,salt)

    const newUser= new User({fullName,email,password:HashedPassword});

    // jwt tocken
    if(newUser){
      // generate jwt tocken
      generateToken(newUser._id,res);
      await newUser.save();

      res.status(200).json({
        _id:newUser._id,
        fullName:newUser.fullName,
        email:newUser.email,
        profilepic:newUser.profilepic,
      });
    }


   } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({message:"Internt error"})
   }
};

export const login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user =await User.findOne({email})
        if(!user){
            return res.status(400).json({message:"Invalid Creadentials"});
        }

       const ispassowrdcorrect= await bcrypt.compare(password,user.password);
       if(!ispassowrdcorrect){
        return res.status(400).json({message:"Invalid Creadentials"})
       }
       generateToken(user._id,res);

       res.status(200).json({
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profilepic:user.profilepic
       })
    } catch (error) {
        console.log("error",error.message);
        res.status(500).json({message:"Internal error"})
    }
}


export const logout=(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged out sucessfully"})
    } catch (error) {
        console.log("error",error.message)
        res.status(500).json({message:"internal error"})

    }
}

export const updateprofile=async(req,res)=>{
    try {
        const {profilePic}=req.body;
        const userId=req.user._id

        if(!profilePic){
            return res.status(400).json({message:"Profile pic is required"});
        }
        const uploadresponse=await cloudinary.uploader.upload(profilePic);
        const upadateduser=await User.findByIdAndUpdate(userId,{profilePic:uploadresponse.secure_url},{new:true});

        res.status(200).json(upadateduser)
    } catch (error) {
        console.log("error",error);
        return res.status(500).json({message:"Internal server error"});

    }
    
}
export const checkAuth=async(req,res,next)=>{
    try {
         res.status(200).json(req.user);
         next();

    } catch (error) {
        console.log("Error in checkAuth controller",error.message);
        return res.status(500).json({message:"Internal server error"});

    }
}