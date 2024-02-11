const { response } = require('express');
const express=require('express');
const bcrypt=require('bcryptjs');
const router=express.Router();
const userModel=require('../../Models/userSchema');
const uploads=require('../../middlewares/multer');
const blogsModel=require('../../Models/novelSchema')




router.get('/',async(req,res)=>{
    const users=await userModel.find().select({confirm:0, password:0}).populate('blogs').populate('comments');
    res.send(users);
})





router.get('/:id',async (req,res)=>{
    
    
    const user=await userModel.findById(req.params.id).populate('blogs');
    res.send(user);
})

router.post('/', uploads.single('Avatar'), async (req,res)=>{
    const url=req.protocol + '://' + req.get('host');
    const isRegistered=await userModel.findOne({email:req.body.email});
if (isRegistered) return res.status(401).json({message:'User is Already Registered'});
    const user=new userModel();
    if(!req.file)
    {
        user.name=req.body.name;
        if(req.body.password !== req.body.confirm) return res.status(401).send('Invalid Password.')
          const hashedPassword=await bcrypt.hash(req.body.password,12);
          const confirmPassword=await bcrypt.hash(req.body.confirm,12);
          user.password=hashedPassword;
          user.confirm=confirmPassword;
          user.email=req.body.email;
          user.blogs=[];
         await user.save();
         res.json({message:'User Successfully Registered.'});
    }
    else{
        user.name=req.body.name;
        if(req.body.password !== req.body.confirm) return res.status(401).send('Invalid Password.')
          const hashedPassword=await bcrypt.hash(req.body.password,12);
          const confirmPassword=await bcrypt.hash(req.body.confirm,12);
          user.password=hashedPassword;
          user.confirm=confirmPassword;
     
        user.image=url+ '/Images/' +  req.file.filename;
          user.email=req.body.email;
          user.blogs=[];
         await user.save();
         res.json({message:'User Successfully Registered.'});
    }
   

})




router.delete('/:id',async (req,res)=>{
    const user=await userModel.findByIdAndDelete(req.params.id);

})

router.put('/:id', uploads.single('Avatar'),async(req,res)=>{
const user=await userModel.findById(req.params.id);
user.name=req.body.name;
   if(req.body.password !== req.body.confirm) return res.status(401).send('Passwords do not match.')
     const hashedPassword=await bcrypt.hash(req.body.password,12);
     const confirmPassword=await bcrypt.hash(req.body.confirm,12);
     user.password=hashedPassword;
     user.confirm=confirmPassword;

     user.image=req.file.filename;
    
    await user.save();
   
})




module.exports=router;