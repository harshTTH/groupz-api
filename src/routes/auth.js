import {Router} from 'express';
var router = Router();
import jwt from 'jsonwebtoken';
import User from '../models/User';
import {sendConfirmationEmail, sendResetPasswordLink} from '../mailer';

router.post('/api/auth',(req,res)=>{
    let {credentials} = req.body;
    User.findOne({email: credentials.email}).then(user =>{
        if(user && user.isValidPassword(credentials.pass)){
            user.setConfirmationToken();
            user.save();
            res.json({user:user.toAuthJWT()});
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

router.post('/api/auth/forgotpass',(req,res)=>{
  User.findOne({email:req.body.email}).then((user)=>{
    if(user){
      if(!user.passResetToken){
        user.passResetToken = user.generateResetToken();
        user.save();
      }
      sendResetPasswordLink(user);
      res.json({});
    }
    else res.status(401).json({});
  })
  .catch(()=>res.status(401).json({}));
});

router.post('/api/resend',(req,res)=>{
  console.log('resend request user found');
  User.findOne({confirmationToken:req.body.token}).then(user=>{
    if(user){
      sendConfirmationEmail(user);
      res.json({status:true});
    }
    else res.json({status:false});
  })
});

router.post('/api/auth/verifylink',(req,res)=>{
  User.findOne({passResetToken:req.body.token})
  .then(user=>{
    jwt.verify(user.passResetToken,process.env.TOKEN_KEY,err=>{
      //console.log(err);
      if(!err){
        res.json({});
      }else {
        res.status(401).json({});
      }
    })
  })
  .catch(()=>res.status(400).json({}))
})

router.post('/api/auth/resetpassreq',(req,res)=>{
  console.log(req.body);
  jwt.verify(req.body.token, process.env.TOKEN_KEY, err=>{
    if(!err){
      User.findOne({passResetToken:req.body.token})
                  .then(user=>{
                    user.setPassword(req.body.pass);
                    user.passResetToken = "";
                    user.save();
                    res.json({})
                  })
                  .catch(()=>res.status(401));
    }else{
      res.status(401).json({});
    }
  })
})
export default router;
