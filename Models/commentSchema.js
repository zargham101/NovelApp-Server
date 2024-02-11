const mongoose=require('mongoose');

const commentSchema=mongoose.Schema({
    text:String,
    status:{
        type:String,
        default:''
    },

    user:[{
        type:mongoose.Types.ObjectId,
        ref:'users'
    }],
    blog:{
        type:mongoose.Types.ObjectId,
        ref:'blogs'
    }

})

const commentModel=mongoose.model('comments',commentSchema);

module.exports=commentModel;