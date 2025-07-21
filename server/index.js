const express = require('express');
const http = require('http'); // ✅ This is required
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const cors = require('cors');



const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    // origin: "https://horizonsudarshan.netlify.app/", // ✅ Use your Netlify domain (no trailing slash)
    // methods: ["GET", "POST"]
  }
});

app.use(cors());


app.use(bodyParser.json())

const emailToSocketMapping=new Map();
const socketToEmailMapping = new Map();

io.on('connection',(socket)=>{
    console.log('new connection');
   socket.on('join-room',(data)=>{
     const {roomId,emailId}=data;
     console.log("User",emailId,"Joined Room",roomId);
     emailToSocketMapping.set(emailId,socket.id);
     socketToEmailMapping.set(socket.id,emailId);
     socket.join(roomId);
     socket.emit('joined-room',{roomId})
     socket.broadcast.to(roomId).emit("user-joined",{emailId});
 });    
     socket.on("call-user",(data)=>{
      const{emailId,offer}=data;
      const fromEmail=socketToEmailMapping.get(socket.id)
      const socketId=emailToSocketMapping.get(emailId);
      socket.to(socketId).emit("incomming-call",{from:fromEmail,offer});
       
     });


     socket.on("call-accepted",(data)=>{
      const {emailId,ans}=data;
      const socketId=emailToSocketMapping.get(emailId);
      socket.to(socketId).emit('call-accepted',{ans})
     });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





// const express=require('express');
// const bodyparser=require('body-parser');
// const {Server}=require('socket.io');

// const io=new Server({
//     cors:true,
// });
// const app=express();

// app.use(bodyparser.json())

// const emailToSocketMapping=new Map();
// const socketToEmailMapping = new Map();

// io.on('connection',(socket)=>{
//     console.log('new connection');
//    socket.on('join-room',(data)=>{
//      const {roomId,emailId}=data;
//      console.log("User",emailId,"Joined Room",roomId);
//      emailToSocketMapping.set(emailId,socket.id);
//      socketToEmailMapping.set(socket.id,emailId);
//      socket.join(roomId);
//      socket.emit('joined-room',{roomId})
//      socket.broadcast.to(roomId).emit("user-joined",{emailId});
//  });    
//      socket.on("call-user",(data)=>{
//       const{emailId,offer}=data;
//       const fromEmail=socketToEmailMapping.get(socket.id)
//       const socketId=emailToSocketMapping.get(emailId);
//       socket.to(socketId).emit("incomming-call",{from:fromEmail,offer});
       
//      });


//      socket.on("call-accepted",(data)=>{
//       const {emailId,ans}=data;
//       const socketId=emailToSocketMapping.get(emailId);
//       socket.to(socketId).emit('call-accepted',{ans})
//      });
// });

// app.listen(8000, ()=> console.log('PORT is running on 8000'));
// io.listen(8001);