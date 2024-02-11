

function authorize (req,res,next){
const User=req.session.user;

if (User.role === 'admin') return next();

return res.status(403).json({message:'You are not Authorized for this action'});
}

module.exports=authorize;