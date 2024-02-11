const express=require('express');

const userModel=require('../Models/userSchema');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const config=require('config');
const blogsModel=require('../Models/novelSchema')
const auth=require('../middlewares/authentication');
const uploads=require('../middlewares/multer');
const authorize=require('../middlewares/authorize');

const router=express.Router();


router.get('/Login', async(req,res)=>{


    const token=req.cookies.token;

var user=req.session.user;
      




    


    if(user){
        req.flash('success','User is already logged in');
        return res.render('MyNovels',{user});
    }
    else{
        return res.render('Login');
    }
   
})



router.post('/serverLogin',async(req,res)=>{
    if(req.body.email.length ===0 || req.body.password.length ===0) return res.status(401).json({message:'Input Fields Left Empty.'})
    const user=await userModel.findOne({email:req.body.email});
    if (!user) return res.status(401).json({message:'User is not registered.'});
   const isVerify=await bcrypt.compare(req.body.password,user.password);
   if(!isVerify) return res.status(401).json({message:"Invalid Password."});

   const token=jwt.sign({
    _id:user._id
   },config.get('SomePrivateKey'), );
  
   res.cookie('token',token,{expires:new Date(Date.now()+90000000)});
   



req.session.user=user;


   
   res.redirect('/user/myNovel');
})



router.get('/MyNovel/', auth, async(req,res)=>{
    var user=req.session.user;
      
    const Blogs=await blogsModel.find({user:user._id}).populate('user');


    res.render('MyNovels',{Blogs});
})

router.get('/LogOut',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/');
    })
})

router.get('/Register',(req,res)=>{
    res.render('Register');
})

router.post('/Register', uploads.single('Avatar') ,async (req,res)=>{
    const url=req.protocol + '://' + req.get('host');
    const alreadyRegistered=await userModel.findOne({email:req.body.email});
    if(alreadyRegistered) return res.status(401).json({message:"User is already Registered"});
const user= new userModel();
if(!req.file){
    user.name=req.body.name;
    user.email=req.body.email;
    
    const hashedPassword=await bcrypt.hash(req.body.password,12);
    const confirmHashed=await bcrypt.hash(req.body.confirm,12);
    if(req.body.password !== req.body.confirm) return res.status(401).json({message:'Passwords Do not match.'});
    
    user.password=hashedPassword;
    user.confirm=confirmHashed;
    user.role='admin'
    await user.save();
    res.redirect('/user/Login');
}
else{
    user.name=req.body.name;
user.email=req.body.email;
user.image= url + '/Images/' + req.file.filename;
const hashedPassword=await bcrypt.hash(req.body.password,12);
const confirmHashed=await bcrypt.hash(req.body.confirm,12);
if(req.body.password !== req.body.confirm) return res.status(401).json({message:'Passwords Do not match.'});

user.password=hashedPassword;
user.confirm=confirmHashed;
user.role='admin';
await user.save();
res.redirect('/user/Login');
}


})

router.get('/edit/:id', auth, authorize, async(req,res)=>{
    res.send('Hello');
})


module.exports=router;