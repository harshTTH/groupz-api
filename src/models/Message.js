import mongoose from 'mongoose';

const schema = new mongoose.Schema(
    {
      name:{
        type:String,
        required:true
      },
      message:{
        type:String,
        require:true
      }
},{timestamps:true});


export default mongoose.model('Message',schema);
