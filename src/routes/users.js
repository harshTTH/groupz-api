import {Router} from 'express';
var router = Router();
import User from '../models/User';

router.post('/api/signup',(req,res)=>{
    let {email,name,mobile,pass} = req.body.user;
    let userRecord = new User({email,name,mobile});
    userRecord.setPassword(pass);
    userRecord.save()
    .then((user)=>res.json({user:user.toAuthJWT()}))
    .catch((err)=>res.status(400).json(err));
})

export default router;
