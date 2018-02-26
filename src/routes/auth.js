import {Router} from 'express';
var router = Router();
import User from '../models/User';

router.post('/api/auth',(req,res)=>{
    let {credentials} = req.body;
    User.findOne({email: credentials.email}).then(user =>{
        if(user && user.isValidPassword(credentials.pass)){
            res.json({user:user.toAuthJWT()})
        }else{
            res.status(400).json({errors:{global:"Email Not Found"}})
        }
  })
});

router.post('/api/auth/confirmation',(req,res)=>{
  let token = req.body.token;
  User.findOneAndUpdate(
    {confirmationToken:token},
    {confirmed:true}
  ).then(user=>{
    if(user){
      if(!user.confirmed){
        user.confirmed = true;
        res.json({user:user.toAuthJWT()});
      }
      else if(user.confirmed)res.status(400).json({error:"Email Already Confirmed !"})
    }
    else res.status(400).json({error:"Invalid Token!"});
  })
})
export default router;
