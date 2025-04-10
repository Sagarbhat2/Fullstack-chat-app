import mongoose, { mongo } from "mongoose";
// import { connectDB } from "../lib/db";


const UserSchema=mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    fullName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        minlength:6,
    },
    profilePic:{
        type:String,
        default:"",
    },
},
{timestamps:true}
);
const User=mongoose.model("User",UserSchema);

export default User;