
const multer=require('multer');
const Storage=multer.diskStorage({
    destination:'Public/Images',
    filename:(req,file,cb)=>{
        cb(null, file.originalname);
    }
})

const uploads=multer({
    storage:Storage,
    fileFilter:(req,file,cb)=>{
        if(file.mimetype == 'image/png' || file.mimetype == 'image/jpeg' ){
         cb(null,true);
        }
        else{
            return cb(new Error('Invalid Format Please choose correct image format.'),false)
        }
    }
})

module.exports=uploads;