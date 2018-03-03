import {Router} from 'express';
import User from '../models/User';
var router = Router();

router.post('/fetch',(req,res)=>{
  User.find({email:{$ne:req.body.email}},{name:1,email:1,_id:0,socket:1})
  .then(users=>{
    users.forEach(user=>user.socket = user.socket.length);
    res.json({users});
  });
})

export default router;
