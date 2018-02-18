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
})

export default router;
