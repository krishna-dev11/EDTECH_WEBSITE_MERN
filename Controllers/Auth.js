const user = require("../Models/user");
const OTP = require("../Models/otpSchema")

// signUP
const signUp = async(req , res)=>{

    try{
        const{email} = req.body;
    
    if(!email){
        return res.status(401).json({
            success:false,
            message:"enter the email"
        })
    }

    const result = await user.findOne({email:email});
    
    if(result){
        return res.status(401).json({
            success:false,
            message:"you are already exist in our database so go to login page and make login"
        })
    }

    const otp = otpGenerator.generate(6 , {
        lowerCaseAlphabets:false,
        upperCaseAlphabets:false,
        specialChars:false
    })

    const sameOtpPresent  = await OTP.findOne({otp:otp})

    while(sameOtpPresent)
    {
         otp = otpGenerator.generate(6 , {
            lowerCaseAlphabets:false,
            upperCaseAlphabets:false,
            specialChars:false
        })
        
         sameOtpPresent  = await OTP.findOne({otp:otp})

    }

    const updateOTP =  await OTP.create({email , otp})

    res.status(200).json({
        success:true,
        message:"entery of otp successfully created in database"
    })

    } catch(error){
        return res.status(500).json({
            success:false,
            message:"there should be some error in sending the otp to the user's email"
        })
    }



}
// login