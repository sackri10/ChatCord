const path =require('path');
const express= require('express');
const http = require ('http');
var serveStatic = require("serve-static");
const socketio=require('socket.io');
const formatMessage= require('./utils/messages')
const {getCurrentUser,userJoin,userLeft,getRoomUsers} = require("./utils/users");

const app= express();
const server =http.createServer(app);
const io =socketio(server);
const botName='ChatCord Bot'

app.use(serveStatic(path.join(__dirname,'public')));
io.on('connection',(socket)=> {
    console.log('Connection Created');
    socket.on('joinRoom',({username,room})=>{

        const  user=userJoin(socket.id,username,room);
        socket.join(user.room);
        
        socket.emit('message',formatMessage(botName,'Welcome to ChatCord Application'));


    //broad cast when user connects
    socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`));

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });

    //emits to all users
    //io.emit();

    });
    socket.on('chatMessage',(message)=>{
        const user=getCurrentUser(socket.id);
        io.to(user.room).emit('message',formatMessage(user.username,message));
    })

    socket.on("disconnect", () => {
        const user= userLeft(socket.id);
        if(user){
            io.to(user.room).emit("message", formatMessage(botName, `${user.username} has left the chat`));

            io.to(user.room).emit("roomUsers", {
              room: user.room,
              users: getRoomUsers(user.room),
            });

        }
    });



})

const PORT= process.env.PORT || 3000;

server.listen(PORT,()=> console.log(`Server running on PORT ${PORT}`));