
const jwt=require('jsonwebtoken');
const config=require('config');
function auth(req,res,next){

const user=req.session.user

if(!user) {
    req.flash('info','Token is not present');
    return res.redirect('/user/Login');
}


   next();




}




module.exports=auth;