import {create} from "zustand"
import { axiosinstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Navigate } from "react-router-dom";
import { io } from "socket.io-client";
const BASE_URL= import.meta.env.MODE === "development" ? "http://localhost:5001" :"/";



export const useAuthStore=create((set,get)=>({
    authUser:null,
    isSigninUp:false,
    isLoggingIng:false,
    isUpdatedProfile:false,
    isCheckingAuth:true,
     onlineUsers:[],


    CheckAuthi:async()=>{
        try {
          const res=await axiosinstance.get("/auth/check");
          set({authUser:res.data}); 
          get().connectsocket()
 
        } catch (error) {
            console.log("error in Auth check",error);
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false});        }
    },


Signup:async(data)=>{
    set({isSigninUp:true});
    try {
        const res=await axiosinstance.post("/auth/signup",data);
        console.log(res);
        set({authUser:req.user});
        toast.success("Register Sucess");
        get().connectsocket()

    } catch (error) {
        console.log(error)
        toast.error(error.response.data.message);
        set({isSigninUp:false});
}
},

logout:async ()=>{
    try {
        await axiosinstance.post("/auth/logout");
        set({authUser:null});
        toast.success("Logged Out Sucessfully");
        get().disconnectsocket();
    } catch (error) {
        toast.error(error.response.data.message);
    }
},

Login:async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosinstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectsocket()
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },


  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosinstance.put("/auth/update-profile",data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectsocket:()=>{
    const {authUser}=get()
    if(!authUser || get().socket?.connected) return;
    const socket=io(BASE_URL,{
      query:{
        userId:authUser._id
      }
    });
    socket.connect();
    set({socket:socket});
    socket.on("getonlineusers",(userids)=>{
      set({onlineUsers:userids})
    });
  },
  disconnectsocket:()=>{
    if(get().socket?.connected) get().socket.disconnect();
  }

}));
