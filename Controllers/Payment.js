const mongoose  = require("mongoose");
const courses = require("../Models/courses")
const {instance} = require("../config/RazorpayInstance");
const user = require("../Models/user");
const {mailSender} = require("../Utilities/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmal")

exports.capturePayment = async(req , res)=>{
    try{
 
        const {courseId} = req.body;

        const userId = req.user.id;

        if(!courseId ){
            return res.status(400).json({
                success:false,
                message:"please fill all details carefully"
            })
        }

        const iscourseExist = await courses.findById({_id:courseId})
        if(!iscourseExist){
            return res.status(400).json({
                success:false,
                message:"Course is not exist with these course Id"
            })
        }

        const uid = new mongoose.Types.ObjectId(userId);
        if(iscourseExist.studentEnrolled.includes(uid)){
            return res.status(400).json({
                success:false,
                message:"User is already Enrolled in these course"
            })
        }


        // create order
        const amount = iscourseExist.price
        const currency = "INR"

        const options = {
            amount : amount * 100,
            currency,
            receipt : Math.random(Date.now()).toString(),
            notes:{
                courseId : courseId,
                userId
            }
        }

        try{
           const paymentResponse =  await instance.orders.create(options);
            return res.status(200).json({
                success:true,
                courseName : iscourseExist.courseName,
                thumbnail : iscourseExist.thumbnail,
                courseDescription : iscourseExist.courseDescription,
                amount : paymentResponse.amount,
                currency : paymentResponse.currency,
                orderId : paymentResponse.id
            })
        }catch(error){
            return res.status(400).json({
                success:false,
                message:"some error in using the instance of razorpay"
            })
        }

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"some error in carturing the payments"
        })
    }
};


exports.verifySignature = async(req , res)=>{
    try{
      
        const webhookSecret = "123445566"

        const Signature = req.header["x-razorpay-signature"];

        const Shasum = crypto.createHmac("Sha256" , webhookSecret);
        Shasum.update(JSON.stringify(req.body));
        const digest = Shasum.digest("hex");

        if(digest === Signature){

            const {courseId , userId} = req.body.payload.payment.entity.notes;

            const updatecourse = await courses.findByIdAndUpdate({_id:courseId},
                {
                    $push:{
                        studentEnrolled:userId
                    }
                },
                {new:true}
            )

            if(!updatecourse){
                return res.status(500).json({
                    success:false,
                    message:"course is not found with these it given by razorpay request"
                })
            }

            const updateUser = await user.findByIdAndUpdate({_id:userId},
                {
                    $push:{
                        courses:courseId
                    }
                },
                {new:true}
            )

            if(!updateUser){
                return res.status(400).json({
                    success:false,
                    message:"user is not found with these it given by razorpay request"
                })
            }

           const coursesuccessfulluBuyEmail =  await mailSender(updateUser.email , 
                "congratulations from Krishna Gothwal" , 
                "payment successfull email" 
            )
        }



        return res.status(200).json({
            success:true,
            message:"verification  completed after payment successfull"
        })   

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"some error occurs in the verification after payment successfull"
        })
    }
}

