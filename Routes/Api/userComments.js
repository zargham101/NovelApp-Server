const express=require('express');
const commentModel=require('../../Models/commentSchema');
const blogsModel=require('../../Models/novelSchema');
const userModel=require('../../Models/userSchema');
const router=express.Router();




 router.get('/',async(req,res)=>{
        const comments=await commentModel.find().populate('user').populate('blog');
        res.send(comments);
    });

router.post('/:bId/:uId',async(req,res)=>{
    const blog=await blogsModel.findById(req.params.bId);
    const user=await userModel.findById(req.params.uId);
    const comment=new commentModel();
    comment.blog=blog;
    comment.user=user;
    comment.text=req.body.text;
    await comment.save();
    blog.comments.push(comment);
    await blog.save();
    user.comments.push(comment);
    await user.save();
    res.json({message:'Comment was successfully made.'});
    
    })
    
    router.get('/:id', async (req,res)=>{
        const comments=await commentModel.find({blog:req.params.id}).populate('user','-confirm -password'  );
        res.send(comments);
    })


    router.delete('/:id',async (req,res)=>{
        const comment=await commentModel.findByIdAndDelete(req.params.id);
        res.json({message:'Comment Successfully Deleted.'})
    })
   
    router.put('/:cId/:bId/:uId',async (req,res)=>{
        const comment=await commentModel.findById(req.params.cId);
        const blog=await blogsModel.findById(req.params.bId);
        const user=await userModel.findById(req.params.uId);
        comment.text=req.body.text;
        comment.user=user;
        comment.blog=blog;
        comment.status='edited';
        await comment.save();
        blog.comments.push(comment);
        await blog.save();  
        user.comments.push(comment);
        await user.save();
         
        res.json({message:'Comment was successfully Edited.'});
    } )


module.exports=router;