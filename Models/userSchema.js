const mongoose=require('mongoose');

const userSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    confirm:String,
    image:String,
    role:{
        type:String,
        default:'user'
    },

    blogs:[{
        type:mongoose.Types.ObjectId,
        ref:'blogs'
    }],
    comments:[{
        type:mongoose.Types.ObjectId,
        ref:'comments'
    }]
})

const userModel=mongoose.model('users',userSchema);

module.exports=userModel;