const jwt = require("jsonwebtoken");
require("dotenv").config();
// auth
exports.auth = async(req , res , next)=>{
    try{
    
        const token = req.body.token || req.cookie.token || req.header("Authorisation").replace("Bearer " , "");

        if(!token){
            return res.status(401).json({
                success:false,
                message:"token is missing"
            })
        }

        try{
          
            const payload = jwt.verify(token , process.env.SECRET_KEY);
            req.user = payload;

        }catch(error){
            
            return res.status(401).json({
                success:false,
                message:"token is Invalid"
            })

        }

        next();

    }catch(error){
       
        return res.status(500).json({
            success:false,
            message:"there would be some error in fetching the token"
        })

    }
}



// isstudent

exports.isStudent = async(req , res , next)=>{
    try{

        if(req.user.accountType !== "student"){
            return res.status(401).json({
                success:false,
                message:"these is a protected route for student"
            })
        }

        next();

    }catch(error){

        return res.status(500).json({
            success:false,
            message:"there would be some error in fetching th accountType of user"

        })

    }
}



// isInstructor

exports.isInstructor = async(req , res , next)=>{
    try{

        if(req.user.accountType !== "instructor"){
            return res.status(401).json({
                success:false,
                message:"these is a protected route for instructor"
            })
        }

        next();

    }catch(error){

        return res.status(500).json({
            success:false,
            message:"there would be some error in fetching th accountType of user"

        })

    }
}



// isAdmin

exports.isAdmin = async(req , res , next)=>{
    try{

        if(req.user.accountType !== "admin"){
            return res.status(401).json({
                success:false,
                message:"these is a protected route for Admin"
            })
        }

        next();

    }catch(error){

        return res.status(500).json({
            success:false,
            message:"there would be some error in fetching th accountType of user"

        })

    }
}
