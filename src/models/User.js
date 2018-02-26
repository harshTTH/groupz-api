import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
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
        },
        name:{
            type:String,
            required:true
        },
        mobile:{
            type:String,
            required:true
        },
        confirmed:{
            type:Boolean,
            required:true,
            default:false
        },
        confirmationToken:{
          type:String,
          default:''
        }
},{timestamps:true});

schema.methods.isValidPassword = function(password){
        return bcrypt.compareSync(password, this.passwordHash)
}

schema.methods.setPassword = function(password){
    this.passwordHash = bcrypt.hashSync(password,10);
}

schema.methods.setConfirmationToken = function setConfirmationToken(){
  this.confirmationToken = this.generateJWT();
}

schema.methods.getConfirmationEmail = function getConfirmationEmail(){
  return `${process.env.HOST}/confirmation/${this.confirmationToken}`
}
schema.methods.generateJWT = function(){
    return jwt.sign({
        email:this.email,
        confirmed:this.confirmed,
    },process.env.TOKEN_KEY);
};

schema.methods.toAuthJWT = function(){
    return {
        email:this.email,
        name:this.name,
        mobile:this.mobile,
        confirmed:this.confirmed,
        token:this.generateJWT()
    }
};

schema.plugin(uniqueValidator, { message: "This email is already taken" });

export default mongoose.model('User',schema);
