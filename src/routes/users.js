import {Router} from 'express';
var router = Router();
import User from '../models/User';
import {sendConfirmationEmail} from '../mailer';

router.post('/api/signup',(req,res)=>{
    let {email,name,mobile,pass} = req.body.user;
    let userRecord = new User({email,name,mobile});
    userRecord.setPassword(pass);
    userRecord.setConfirmationToken();
    userRecord.save()
    .then((user)=>{
      sendConfirmationEmail(user);
      res.json({user:user.toAuthJWT()});
    })
    .catch((err)=>{
      res.status(400).json(err);
    })
})

router.post('/api/resend',(req,res)=>{
  User.findOne({confirmationToken:req.body.token}).then(user=>{
    sendConfirmationEmail(user);
    res.json({status:true});
  })
})
export default router;
