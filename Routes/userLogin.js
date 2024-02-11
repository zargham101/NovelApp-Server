const express=require('express');
const userModel=require('../Models/userSchema');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const config=require('config');
const router=express.Router();




router.post('/',async(req,res)=>{
    
    if(req.body.email.length ===0 || req.body.password.length ===0) return res.status(401).json({message:'Input Fields Left Empty.'})
    const user=await userModel.findOne({email:req.body.email});
    if (!user) return res.status(401).json({message:'User is not registered.'});
   const isVerify=await bcrypt.compare(req.body.password,user.password);
   if(!isVerify) return res.status(401).json({message:"Invalid Password."});

   const token=jwt.sign({
    _id:user._id
   },config.get('SomePrivateKey'), );
  
   res.cookie('token',token,{expires:new Date(Date.now() +10000000)});
   res.send(token);
   
   
   
})

module.exports=router;