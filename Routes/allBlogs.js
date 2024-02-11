const express=require('express');
const userModel=require('../Models/userSchema');
const blogsModel=require('../Models/novelSchema');
const router=express.Router();

router.get('/',async(req,res)=>{
const novels=await blogsModel.find().populate('user');

    res.render('Index',{novels});
})

module.exports=router;



