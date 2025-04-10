import Message from "../models/message.model.js";
import User from "../models/user.model.js"
import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId,io } from "../lib/socket.js";

export const getUsersForSidebar=async(req,res)=>{
    try {
        const logedInUserId=req.user._id;
        const FilteredUsers=await User.find({_id:{$ne:logedInUserId}}).select("-password");
        // console.log(FilteredUsers);
        res.status(200).json(FilteredUsers);
    } catch (error) {
        console.log("error",error.message);
        res.status(500).json({message:"internal server error"});

    }
}

export const getMessages=async(req,res)=>{
    try {
        const {id:userToChatId}=req.params;
        const myId=req.user._id;

        const messages=await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        });
        res.status(200).json(messages)
    } catch (error) {
        console.log("error",error.message);
        res.status(500).json({message:"internal server error"});

    }
}

export const sendMessage=async(req,res)=>{
    try {
        const {text,images}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id;

        let imageUrl;
        if(images){
            //upload base64 image to cloudinary
            const uploadResponse=await cloudinary.uploader.upload(images);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            images:imageUrl
        });

        await newMessage.save();
        const receiversocketid=getReceiverSocketId(receiverId);
        if(receiversocketid){
            io.to(receiversocketid).emit("newMessage",newMessage)
        }
        res.status(200).json(newMessage);

    } catch (error) {
        console.log("error",error.message);
        res.status(500).json({message:"internal server error"});

    }
}