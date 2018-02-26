import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import auth from './routes/auth';
import users from './routes/users';

dotenv.config();
const app = express();
mongoose.connect(process.env.MONGODB_URL);

app.use(bodyParser.json());
app.use(auth);
app.use(users);

app.get('/*',(req,res)=>{
  res.sendFile(path.join(__dirname,'index.html'))
})

app.listen(8000, () => console.log("API running on port 8000"));