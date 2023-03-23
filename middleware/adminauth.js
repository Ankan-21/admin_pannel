
const jwt=require('jsonwebtoken');

exports.authejwt=(req,res,next)=>{
    if (req.cookies && req.cookies.admintoken) {
        jwt.verify(req.cookies.admintoken,'ankan34567',(err,data)=>{
            req.user=data
            next()
        })
    } else {
        next()
    }
}