import {Server} from "socket.io";
import http from "http";
import express from "express"

const app=express();
const server=http.createServer(app);


const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173"], 
      credentials: true
    }
  });

  export function getReceiverSocketId(userId){
    return usersocketmap[userId];
  }

  // used to store onilne user
const usersocketmap={};  // {userId:socketId}


io.on("connection",(socket)=>{
    console.log("A user connected",socket.id);

    const userId=socket.handshake.query.userId;
    if(userId) usersocketmap[userId]=socket.id;


    // io.emit() is used to send events to all the connected clinets or broadcasting it user is online
    io.emit("getonlineusers",Object.keys(usersocketmap));

    socket.on("disconnect",()=>{
        console.log("A user disconnect",socket.id);
        delete usersocketmap[userId];
        io.emit("getonlineusers",Object.keys(usersocketmap));

    })
})



export {io,app,server};