const jwt =require("jsonwebtoken");


function authenticator(req,res,next)
{
    jwt.verify(req.cookies.jwttoken,process.env.SECRET_KEY,(err,decoded)=>{
         if(err)
         {
            res.json({message:"Not registered"});
         }
         else{
            req.decoded=decoded;
            next();
         }
    })
}
module.exports=authenticator;