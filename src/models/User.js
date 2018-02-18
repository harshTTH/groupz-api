import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const schema = new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            index:true,
            unique:true
        },
        passwordHash:{
            type:String,
            required:true
        }
},{timestamps:true});

schema.methods.isValidPassword = function(password){
        return bcrypt.compareSync(password, this.passwordHash)
}

schema.methods.generateJWT = function(){
    return jwt.sign({
        email:this.email
    },process.env.TOKEN_KEY);
};

schema.methods.toAuthJWT = function(){
    return {
        email:this.email,
        token:this.generateJWT()
    }
};

export default mongoose.model('User',schema);
