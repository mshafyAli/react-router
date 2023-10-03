import express from 'express';
let router = express.Router();
import { client } from '../mongoDb.mjs';

import jwt from 'jsonwebtoken';
import {
  stringToHash,
  varifyHash
} from "bcrypt-inzi"


const userCollection = client.db('cruddb').collection("users");

router.post('/login', async (req, res, next) => {

    if ( !req.body.email
      || !req.body.password
    ) {
      res.status(403);
      res.send(`required parameters missing, 
          example request body:
          {
              email:     "some@gmail.com",
              password:   "somePassword"
  
          } `);
      return;
    }
  
    req.body.email = req.body.email.toLowerCase();
  
    try {
  
      let result = await userCollection.findOne({ email: req.body.email });
      console.log("result", result)
  
      if (!result) { // user not found 
        res.status(403).send({  
          message: 'email or password is incorrect'
        });
        return;
      } else { // user already exists
  
  
        const isMatch = await varifyHash(req.body.password, result.password)
  
        if (isMatch) {
  
          //jwt token
  
          const token = jwt.sign({ 
            isAdmin: false,
            email: req.body.email,
            createdOn: new Date().getTime()
           }, process.env.SECRET,{
            expiresIn: '24h',
           });
  
  
          res.cookie('token',token,{
            httpOnly: true,
            secure: true
          });
  
          res.send({
            message: "login successfull",
          });
          return;
        } else {
          res.status(401).send({
            message: "login failed"
          });
          return;
        }
  
      }
  
  
    } catch (e) {
      console.log("error getting in mongoDb", e);
      res.status(500).send('server error, please try later');
    }
  
  });
  
  
  router.post('/signup', async (req, res, next) => {
  
    if (
      !req.body?.firstName
      || !req.body?.lastName
      || !req.body?.email
      || !req.body?.password
    ) {
      res.status(403);
      res.send(`required parameters missing, 
          example request body:
          {
              firstName: "some  firstName",
              lastName:  "some  lastname",
              email:     "some@gmail.com",
              password:   "somePassword"
  
          } `);
      return;
    }
  
    req.body.email = req.body.email.toLowerCase();
    //toDo validate email
  
  
  
  
    try {
  
      let result = await userCollection.findOne({ email: req.body.email });
      console.log('result:', result);
  
      if (!result) {//user not found
  
  
        const passwordHash = await stringToHash(req.body.password);
  
        const insertResponse = await userCollection.insertOne({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: passwordHash,
          createdOn: new Date()
  
        });
  
          //Generate a token
          
          const token = jwt.sign({
            isAdmin: false,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
          }, process.env.SECRET, {
            expiresIn: '24h'
          });
  
  
          //set the token as a cookie
          res.cookie('token',token, {
            httpOnly: true,
            secure: true,
            expires: new Date(Date.now() + 86400000)
          });
  
          //send a response
          res.send({message: "Signup Successfully", token});
          
  
          console.log("InsertRespone :", insertResponse);
  
  
      } else { // user already exists 
        res.status(403).send({ message: "user already exist with this email" })
      }
  
    } catch (e) {
      console.log("error getting data mongodb: ", e);
      res.status(500).send('server error please later');
    }
  })
  

export default router;