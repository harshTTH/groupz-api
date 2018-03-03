import {Router} from 'express';
var router = Router();
import User from '../models/User';
import {sendConfirmationEmail} from '../mailer.js';


router.post('/api/signup',(req,res)=>{
    let {email,name,mobile,pass} = req.body.user;
    let userRecord = new User({email,name,mobile});
    userRecord.setPassword(pass);
    userRecord.setConfirmationToken();
    userRecord.save()
    .then((user)=>{
      sendConfirmationEmail(user);
      console.log(user.toAuthJWT())
      res.json({user:user.toAuthJWT()});
    })
    .catch((err)=>{
      res.status(400).json(err);
    })
})

export default router;
