const jwt = require('jsonwebtoken')
require('dotenv').config()
const authorization= async(req,res,next)=>{
    let token = req.headers.authorization.split(' ')[1]
    try{
        jwt.verify(token,process.env.SECRET_KEY, function(err,docoded){
            if(err){
                res.send("Please Login again")
            }else{
                req.body.user_id = docoded.user_id
                next()
            }
        })
    }catch(err){
        res.send(err)
    }


}
module.exports =authorization