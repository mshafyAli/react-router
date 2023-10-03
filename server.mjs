import express from 'express';
import path from 'path';
import cors from 'cors';
import 'dotenv/config';
import jwt from 'jsonwebtoken';

import cookieParser from 'cookie-parser';
const __dirname = path.resolve();


import authRouter from './routes/auth.mjs';
import postRouter from './routes/post.mjs'; 


const app = express();
app.use(express.json());//body parser
app.use(cookieParser());//cokiee parser
app.use(cors({
  origin: ["http://localhost:3001"],
  credentials:true}
  ));



app.use("/api/v1",authRouter);

// jwt
app.use((req, res, next) => {
  console.log("cookies: ", req.cookies);
  

  const token = req.cookies.token;
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    
    console.log('decoded', decoded);

    req.body.decoded = {
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      email: decoded.email,
      isAdmin: decoded.isAdmin
    };
    
    
    next();
  

  }catch(err){
   res.status(401).send({message: "invalid token"});
  }
})

app.use("/api/v1",postRouter);

app.use("/api/v1/ping",(req,res) =>{
  res.send("ok");
})


app.use(express.static(path.join(__dirname, 'public')));
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})