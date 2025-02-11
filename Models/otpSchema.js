const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({

     email:{
        type:String
     },
     otp:{
        type:String
     },
     createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60
     }

})

module.exports = mongoose.model("OTP" , otpSchema);

const sendVerificationEmail = async(email , otp)=>{
    try{
       await mailSender(email , `Verification mail from study notion to the email: {email}` , otp);
    }catch(error){
       console.error(error);
    }
}

otpSchema.post("save" , async function(next){
    try{

        await sendVerificationEmail(this.email , this.otp)
        next()

    } catch(error){
        console.log("error in sending the email by function call")
    }
})

