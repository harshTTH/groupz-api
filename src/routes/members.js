import {Router} from 'express';
import User from '../models/User';
import Message from '../models/Message';
var router = Router();

router.post('/fetch',(req,res)=>{
  User.find({email:{$ne:req.body.email}},{name:1,email:1,_id:0,socket:1})
  .then(users=>{
    users.forEach(user=>user.socket = user.socket.length);
    res.json({users});
  });
})

router.post('/fetch/msg',(req,res)=>{
  User.find({token:req.body.token})
  .then(user=>{
    if(user){
      Message.find({},{updatedAt:0})
      .then(messages=>res.json({messages}))
    }else{
      res.status(401).json({});
    }
  })
  .catch(()=>res.status(401).json({}))
})
export default router;
