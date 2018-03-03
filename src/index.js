import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import auth from './routes/auth';
import users from './routes/users';
import members from './routes/members';
import socket from 'socket.io';
import User from './models/User';

dotenv.config();
const app = express();
mongoose.connect(process.env.MONGODB_URL);

app.use(bodyParser.json());
app.use(auth);
app.use(users);
app.use('/api/members', members);

app.get('/*',(req,res)=>{
  res.sendFile(path.join(__dirname,'index.html'))
})

const server = app.listen(8000, () => console.log("API running on port 8000"));
const io = socket(server);

io.on('connect',(socket)=>{
  console.log('A user Connected with email : '+socket.handshake.query.email);
  User.findOne({email:socket.handshake.query.email}).then(user=>{
    if(user){
      user.socket.push(socket.id);
      user.save();
      socket.broadcast.emit('statusOn',socket.handshake.query.email);
    }
  })

  socket.on('disconnect',()=>{
    User.findOneAndUpdate({socket:socket.id},{$pull:{socket:socket.id}}).then(user=>{
      if(user){
        console.log('User Disconnected with email : '+user.email);
        socket.broadcast.emit('statusOff',user.email);
      }
    })
  })
})
