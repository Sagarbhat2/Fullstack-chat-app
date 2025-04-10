import {create} from "zustand";
import {toast} from "react-hot-toast";
import {axiosinstance} from "../lib/axios";
import {useAuthStore} from "./useAuthStore"

export const useChatStore = create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUseresLoading:false,
    isMessagesLoading:false,



    getUsers:async()=>{
        set({isUseresLoading:true});
        try {
        const res=await axiosinstance.get("/messages/users");
        set({users:res.data});
        // console.log(res.data);
        
        } catch (error) {
            toast.error(error.response.data.message);
        }finally{
            set({isUseresLoading:false});
        }
        
    },

    getMessages:async(UserId)=>{
        set({isMessagesLoading:true});
        try {
            const res=await axiosinstance.get(`/messages/${UserId}`);
            set({messages:res.data})
        } catch (error) {
            toast.error.response.data.message;
        }finally{
            set({isMessagesLoading:false});
        }
    },
    
    sendMessage:async(messageData)=>{
        const {selectedUser,messages}=get();
        try {
            const res=await axiosinstance.post(`/messages/send/${selectedUser._id}`,messageData);
            set({messages:[...messages,res.data]});
        } catch (error) {
            toast.error(error.response.data.message);

        }
    },

    subscribetomessages:()=>{
        const {selectedUser} = get();
        if(!selectedUser) return

        const socket=useAuthStore.getState().socket;


        socket.on("newMessage",(newMessage)=>{
            const  ismessagesentfromSelectedUser=newMessage.senderId !== selectedUser._id;
            if(ismessagesentfromSelectedUser) return;
            set({messages:[...get().messages,newMessage]});
        });
    },

    unsubscribefrommessages:()=>{
        const socket=useAuthStore.getState().socket;
        socket.off("newMessages");
    },



    setSelectedUser:(selectedUser)=>set({selectedUser}),

}))